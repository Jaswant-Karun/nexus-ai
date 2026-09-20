/**
 * NEXUS AI — Nexus Auto Router
 *
 * Intelligent model routing that classifies the user's task and selects the
 * best model for the job — no manual model picking required.
 *
 *   ┌─────────┐     ┌──────────────┐     ┌────────────────────┐
 *   │  User   │ ──▶ │ Nexus Router │ ──▶ │ Best Model + Chain │
 *   └─────────┘     └──────────────┘     └────────────────────┘
 *
 * Classification is heuristic-based (keyword + input-size detection) so it is
 * instant and free — no extra LLM call needed to pick a model.
 *
 * Examples:
 *   "Write a Java program..."    → coding     → Claude / GPT-5
 *   "Latest AI news"             → realtime   → Grok (web-enabled)
 *   "Analyze this 100-page doc"  → longcontext → Gemini Pro / Claude
 */

import type { ChatMessage, ModelDef, RouteDecision, TaskCategory } from "./types";
import { getAvailableModels, getModel } from "./config";

// ─── Category → preferred model chain ─────────────────────────────────────────
// primary first, then fallbacks.  The router filters this to available models.

const ROUTE_MAP: Record<TaskCategory, { primary: string; fallbacks: string[] }> = {
  // Strong coding models first.
  coding: {
    primary: "claude-sonnet",
    fallbacks: ["gpt-5", "deepseek-reasoner", "gemini-2.5-pro"],
  },
  // Web-enabled / real-time model first (Grok has live web access).
  realtime: {
    primary: "grok",
    fallbacks: ["gemini-2.5-pro", "gpt-5", "claude-sonnet"],
  },
  // Largest context windows first.
  longcontext: {
    primary: "gemini-2.5-pro",
    fallbacks: ["claude-sonnet", "claude-opus", "gpt-5"],
  },
  // Dedicated reasoning model first.
  reasoning: {
    primary: "deepseek-reasoner",
    fallbacks: ["claude-sonnet", "gpt-5", "gemini-2.5-pro"],
  },
  // Most capable creative model first.
  creative: {
    primary: "claude-opus",
    fallbacks: ["gpt-5", "gemini-2.5-pro", "claude-sonnet"],
  },
  // Fast, cost-efficient default.
  general: {
    primary: "gpt-5-mini",
    fallbacks: ["gemini-2.5-flash", "deepseek-chat", "claude-sonnet"],
  },
};

// ─── Classification heuristics ──────────────────────────────────────────────────

const LONG_CONTEXT_THRESHOLD = 50_000; // ~12K tokens of combined input

interface Rule {
  category: TaskCategory;
  pattern: RegExp;
  label: string;
}

const RULES: Rule[] = [
  {
    category: "longcontext",
    pattern: /\b(analy[sz]e|summariz|review|process)\b.+\b(document|pdf|file|paper|article|report|chapter|book)\b/i,
    label: "Document-analysis request — routing to long-context model",
  },
  {
    category: "realtime",
    pattern: /\b(latest|news|current|today|recent|happening|now|up ?to ?date|real[- ]?time|breaking|trending)\b/i,
    label: "Current-information query — routing to web-enabled model",
  },
  {
    category: "coding",
    pattern: /\b(code|program|function|bug|debug|algorithm|class|component|api|sql|compile|stack ?trace|error|implement|refactor|script|typescript|python|java|javascript|react|node|rust|c\+\+|golang|kotlin|swift|html|css|regex)\b/i,
    label: "Coding task — routing to strong code model",
  },
  {
    category: "reasoning",
    pattern: /\b(math|calculate|prove|theorem|logic|step[- ]?by[- ]?step|reason|derive|equation|integral|derivative|proof|solve for|complexity|optimi[sz]e|analy[sz]e this)\b/i,
    label: "Reasoning task — routing to reasoning model",
  },
  {
    category: "creative",
    pattern: /\b(write|story|poem|creative|essay|article|blog|narrative|character|dialogue|screenplay|novel|fiction|song|lyrics)\b/i,
    label: "Creative task — routing to creative model",
  },
];

/**
 * Classify the user's task from the message history.
 * Returns the detected category and a human-readable reason.
 */
export function classifyTask(
  messages: ChatMessage[],
): { category: TaskCategory; reason: string } {
  // Find the most recent user message.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return { category: "general", reason: "No user message detected" };

  const text = lastUser.content;

  // Long-context: total input size exceeds threshold.
  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars >= LONG_CONTEXT_THRESHOLD) {
    return {
      category: "longcontext",
      reason: `Large input (${totalChars.toLocaleString()} chars) — routing to long-context model`,
    };
  }

  // Apply heuristic rules in priority order.
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      return { category: rule.category, reason: rule.label };
    }
  }

  return { category: "general", reason: "General query — routing to balanced default model" };
}

/**
 * Filter a model chain to only include models whose provider has an API key
 * configured.  If none are available, returns the full chain unchanged so the
 * orchestrator can produce a clear "no providers configured" error.
 */
function filterToAvailable(modelIds: string[]): { ids: string[]; availableCount: number } {
  const availableSet = new Set(getAvailableModels().map((m) => m.id));
  const filtered = modelIds.filter((id) => availableSet.has(id));
  return {
    ids: filtered.length ? filtered : modelIds,
    availableCount: filtered.length,
  };
}

/**
 * Given a chat request, produce a routing decision: the task category, the
 * reason, and an ordered model chain to try (primary first).
 */
export function routeTask(messages: ChatMessage[]): RouteDecision {
  const { category, reason } = classifyTask(messages);
  const routeEntry = ROUTE_MAP[category];
  const fullChain = [routeEntry.primary, ...routeEntry.fallbacks];

  const { ids, availableCount } = filterToAvailable(fullChain);

  // If no providers are configured, append a note in the reason.
  const finalReason =
    availableCount === 0
      ? `${reason} (⚠ No API keys configured — add provider keys to .env.local)`
      : reason;

  return {
    category,
    reason: finalReason,
    modelChain: ids,
  };
}

/**
 * Build a fallback chain for a specific (non-auto) model selection.
 * The selected model is primary, followed by other models from different
 * providers that make sense as fallbacks.
 */
export function buildFallbackChain(modelId: string): string[] {
  const selected = getModel(modelId);
  if (!selected) return [modelId];

  const available = getAvailableModels();
  if (available.length === 0) return [modelId];

  // Start with the selected model.
  const chain: string[] = [modelId];

  // Prefer same-tier models from different providers, then any available model.
  const candidates = available
    .filter((m) => m.id !== modelId && m.provider !== selected.provider)
    .sort((a, b) => {
      // Prefer same tier, then flagships, then fast.
      const tierOrder = { flagship: 0, reasoning: 1, fast: 2 };
      const aTier = a.tier === selected.tier ? -1 : tierOrder[a.tier];
      const bTier = b.tier === selected.tier ? -1 : tierOrder[b.tier];
      return aTier - bTier;
    });

  for (const c of candidates) {
    if (chain.length >= 4) break;
    chain.push(c.id);
  }

  return chain;
}
