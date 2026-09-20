/**
 * NEXUS AI — Multi-Model Orchestrator
 *
 * The central entry point that ties together:
 *
 *   ┌───────────┐   ┌────────────┐   ┌──────────┐   ┌──────────────┐
 *   │ Router     │──▶│ Fallback   │──▶│ Provider │──▶│ Usage Tracker│
 *   │ (Auto)    │   │ Chain      │   │ Call     │   │              │
 *   └───────────┘   └────────────┘   └──────────┘   └──────────────┘
 *
 * Flow:
 *   1.  If model === "auto"  → Nexus Router classifies the task and picks a chain.
 *       If a specific model is chosen → build a fallback chain around it.
 *   2.  Try the primary model. On success → record usage, return.
 *   3.  On a retryable failure (rate limit, 5xx, timeout, connection) →
 *       try the next model in the chain.
 *   4.  On a non-retryable failure (auth, bad request) → fail fast.
 *
 * Usage is recorded for every attempt (success or failure) so the dashboard
 * can show per-provider request counts, tokens, and cost.
 */

import type {
  ChatRequest,
  ChatResponse,
  ProviderId,
  StreamChunk,
  TaskCategory,
  TokenUsage,
  UsageRecord,
} from "./types";
import { getModel, getProviders, getProviderConfig } from "./config";
import { getProvider } from "./providers";
import { buildFallbackChain, routeTask } from "./router";
import { getUsageStore } from "./usage";
import { ProviderError } from "./errors";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function estimateCost(
  usage: TokenUsage,
  costPer1kIn: number,
  costPer1kOut: number,
): number {
  return (
    (usage.promptTokens * costPer1kIn + usage.completionTokens * costPer1kOut) /
    1000
  );
}

/**
 * Returns the status of every provider + model for the UI.
 */
export function getProviderStatus() {
  return getProviders();
}

/**
 * True if at least one provider has an API key configured.
 */
export function anyProvidersConfigured(): boolean {
  return getProviders().some((p) => p.available);
}

/**
 * Determine the model chain for a request.
 * - "auto" → Nexus Router classifies the task and returns a ranked chain.
 * - specific model id → that model first, then sensible fallbacks.
 */
function resolveChain(
  model: string,
  messages: { content: string; role: string }[],
): {
  chain: string[];
  category?: TaskCategory;
  reason?: string;
} {
  if (model === "auto") {
    const decision = routeTask(
      messages as { role: "user" | "assistant" | "system" | "tool"; content: string }[],
    );
    return { chain: decision.modelChain, category: decision.category, reason: decision.reason };
  }
  return { chain: buildFallbackChain(model) };
}

function recordAttempt(
  provider: ProviderId,
  modelId: string,
  usage: TokenUsage | undefined,
  costUsd: number,
  success: boolean,
  latencyMs: number,
  category?: TaskCategory,
) {
  const record: UsageRecord = {
    timestamp: new Date().toISOString(),
    provider,
    model: modelId,
    promptTokens: usage?.promptTokens ?? 0,
    completionTokens: usage?.completionTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0,
    costUsd: success ? costUsd : 0,
    success,
    latencyMs,
    category,
  };
  getUsageStore().record(record);
}

// ─── Public API ─────────────────────────────────────────────────────────────────

/**
 * Send a chat request with automatic routing and fallback.
 *
 * @throws ProviderError if all models in the chain fail.
 */
export async function chat(req: ChatRequest): Promise<ChatResponse> {
  if (!anyProvidersConfigured()) {
    throw new ProviderError(
      503,
      "No AI providers are configured. Add API keys to apps/web/.env.local (OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_AI_API_KEY, XAI_API_KEY, DEEPSEEK_API_KEY).",
    );
  }

  const { chain, category, reason } = resolveChain(req.model, req.messages);

  let lastError: Error | null = null;

  for (let i = 0; i < chain.length; i++) {
    const modelId = chain[i];
    const modelDef = getModel(modelId);
    if (!modelDef) {
      lastError = new Error(`Unknown model: ${modelId}`);
      continue;
    }

    const provider = getProvider(modelDef.provider);
    if (!provider.available) {
      const cfg = getProviderConfig(modelDef.provider);
      lastError = new Error(
        `${modelDef.provider} not configured (missing ${cfg?.envKey ?? "API key"})`,
      );
      continue;
    }

    const fellBack = i > 0;
    const start = Date.now();

    try {
      const response = await provider.chat(
        { ...req, model: modelId },
        modelDef.apiModel,
      );
      const latencyMs = Date.now() - start;
      const costUsd = estimateCost(
        response.usage,
        modelDef.costPer1kIn,
        modelDef.costPer1kOut,
      );

      recordAttempt(
        modelDef.provider,
        modelId,
        response.usage,
        costUsd,
        true,
        latencyMs,
        category,
      );

      return {
        ...response,
        model: modelId,
        provider: modelDef.provider,
        latencyMs,
        fellBack,
        routedCategory: category,
        routedReason: reason,
      };
    } catch (err) {
      const latencyMs = Date.now() - start;
      lastError = err instanceof Error ? err : new Error(String(err));

      recordAttempt(
        modelDef.provider,
        modelId,
        undefined,
        0,
        false,
        latencyMs,
        category,
      );

      // Non-retryable (auth / bad request) — don't bother with fallback.
      if (err instanceof ProviderError && !err.retryable) {
        throw err;
      }

      // Retryable — try the next model in the chain.
      continue;
    }
  }

  throw (
    lastError ??
    new Error("All models in the fallback chain failed or were unconfigured.")
  );
}

/**
 * Stream a chat response with automatic routing and fallback.
 *
 * Fallback only works BEFORE any deltas are sent to the client. Once tokens
 * start flowing, a mid-stream failure cannot be retried (the client already
 * has partial output).
 */
export async function* streamChat(
  req: ChatRequest,
): AsyncGenerator<StreamChunk, void, unknown> {
  if (!anyProvidersConfigured()) {
    yield {
      type: "error",
      error:
        "No AI providers are configured. Add API keys to apps/web/.env.local.",
    };
    return;
  }

  const { chain, category, reason } = resolveChain(req.model, req.messages);
  let hasStreamed = false;
  let lastError: Error | null = null;

  for (let i = 0; i < chain.length; i++) {
    const modelId = chain[i];
    const modelDef = getModel(modelId);
    if (!modelDef) continue;

    const provider = getProvider(modelDef.provider);
    if (!provider.available) {
      lastError = new Error(`${modelDef.provider} not configured`);
      continue;
    }

    const fellBack = i > 0;
    const start = Date.now();
    const gen = provider.streamChat(
      { ...req, model: modelId },
      modelDef.apiModel,
    );

    let streamFailedEarly = false;

    try {
      for await (const chunk of gen) {
        if (chunk.type === "error") {
          if (!hasStreamed) {
            streamFailedEarly = true;
            lastError = new Error(chunk.error);
            break;
          }
          yield chunk;
          return;
        }

        hasStreamed = true;

        if (chunk.type === "done") {
          // Enrich with routing metadata + record usage.
          const latencyMs = Date.now() - start;
          const costUsd = chunk.usage
            ? estimateCost(
                chunk.usage,
                modelDef.costPer1kIn,
                modelDef.costPer1kOut,
              )
            : 0;

          recordAttempt(
            modelDef.provider,
            modelId,
            chunk.usage,
            costUsd,
            true,
            latencyMs,
            category,
          );

          yield {
            ...chunk,
            model: modelId,
            provider: modelDef.provider,
            fellBack,
          };
        } else {
          yield chunk;
        }
      }
    } catch (err) {
      const latencyMs = Date.now() - start;
      lastError = err instanceof Error ? err : new Error(String(err));

      recordAttempt(
        modelDef.provider,
        modelId,
        undefined,
        0,
        false,
        latencyMs,
        category,
      );

      if (!hasStreamed) {
        // Can still fall back to the next model.
        streamFailedEarly = true;
        continue;
      }

      // Already streamed partial output — can't recover.
      if (err instanceof ProviderError && !err.retryable) {
        yield { type: "error", error: err.message };
      } else {
        yield { type: "error", error: lastError.message };
      }
      return;
    }

    // Stream completed without early failure → done.
    if (!streamFailedEarly) return;
    // If we already streamed tokens, we can't fall back further.
    if (hasStreamed) return;
  }

  // All models failed before streaming started.
  yield {
    type: "error",
    error: lastError?.message ?? "All models failed",
  };
}
