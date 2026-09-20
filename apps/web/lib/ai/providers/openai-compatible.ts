/**
 * NEXUS AI — OpenAI-Compatible Provider Base
 *
 * OpenAI, xAI Grok, and DeepSeek all speak the OpenAI Chat Completions wire
 * format.  This shared implementation handles request mapping, SSE streaming
 * parsing, and error normalisation.  Each concrete provider only supplies its
 * id, name, baseUrl, and API key.
 *
 * Endpoint: POST {baseUrl}/chat/completions
 */

import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ProviderId,
  StreamChunk,
  TokenUsage,
  ToolCall,
  ToolDefinition,
} from "../types";
import { ProviderError, wrapFetchError } from "../errors";
import { BaseProvider } from "./base";

// ─── OpenAI API wire types (subset we use) ────────────────────────────────────

interface OpenAIMessage {
  role: string;
  content: string;
  name?: string;
  tool_call_id?: string;
}

interface OpenAIChoice {
  message?: {
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: { name: string; arguments: string };
    }>;
  };
  finish_reason?: string;
}

interface OpenAIChatResponse {
  id: string;
  model: string;
  choices: OpenAIChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIDelta {
  content?: string;
  tool_calls?: Array<{
    index: number;
    id?: string;
    type?: "function";
    function?: { name?: string; arguments?: string };
  }>;
}

interface OpenAIStreamChunk {
  choices?: Array<{
    delta?: OpenAIDelta;
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ─── Shared implementation ─────────────────────────────────────────────────────

export abstract class OpenAICompatibleProvider extends BaseProvider {
  protected abstract apiKey: string;
  protected abstract baseUrl: string;

  protected headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  protected toOpenAIMessages(req: ChatRequest): OpenAIMessage[] {
    const msgs: OpenAIMessage[] = [];
    if (req.systemPrompt) {
      msgs.push({ role: "system", content: req.systemPrompt });
    }
    for (const m of req.messages) {
      const msg: OpenAIMessage = { role: m.role, content: m.content };
      if (m.name) msg.name = m.name;
      if (m.toolCallId) msg.tool_call_id = m.toolCallId;
      msgs.push(msg);
    }
    return msgs;
  }

  protected toOpenAITools(
    tools?: ToolDefinition[],
  ): Array<{ type: "function"; function: ToolDefinition["function"] }> | undefined {
    if (!tools?.length) return undefined;
    return tools.map((t) => ({ type: "function", function: t.function }));
  }

  // ── Non-streaming ──

  async chat(req: ChatRequest, apiModel: string): Promise<ChatResponse> {
    const body: Record<string, unknown> = {
      model: apiModel,
      messages: this.toOpenAIMessages(req),
      temperature: req.temperature ?? 0.7,
      stream: false,
    };
    if (req.maxTokens) body.max_tokens = req.maxTokens;
    const tools = this.toOpenAITools(req.tools);
    if (tools) body.tools = tools;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (err) {
      throw wrapFetchError(err);
    }

    if (!res.ok) {
      const errBody = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new ProviderError(
        res.status,
        errBody.error?.message ?? res.statusText,
      );
    }

    const data = (await res.json()) as OpenAIChatResponse;
    const choice = data.choices?.[0];
    const usage: TokenUsage = {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    };

    return {
      content: choice?.message?.content ?? "",
      model: data.model ?? apiModel,
      provider: this.id,
      usage,
      toolCalls: choice?.message?.tool_calls?.map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: { name: tc.function.name, arguments: tc.function.arguments },
      })),
      finishReason: choice?.finish_reason,
      latencyMs: 0, // set by the orchestrator
    };
  }

  // ── Streaming (SSE) ──

  async *streamChat(
    req: ChatRequest,
    apiModel: string,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const body: Record<string, unknown> = {
      model: apiModel,
      messages: this.toOpenAIMessages(req),
      temperature: req.temperature ?? 0.7,
      stream: true,
      stream_options: { include_usage: true },
    };
    if (req.maxTokens) body.max_tokens = req.maxTokens;
    const tools = this.toOpenAITools(req.tools);
    if (tools) body.tools = tools;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (err) {
      throw wrapFetchError(err);
    }

    if (!res.ok) {
      const errBody = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new ProviderError(
        res.status,
        errBody.error?.message ?? res.statusText,
      );
    }

    const reader = res.body?.getReader();
    if (!reader) throw new ProviderError(500, "No response stream");

    const decoder = new TextDecoder();
    let buffer = "";
    let usage: TokenUsage | undefined;
    let finishReason: string | undefined;

    // Accumulate tool-call fragments (OpenAI streams them in pieces).
    const toolCallAccumulator: Map<
      number,
      { id: string; name: string; arguments: string }
    > = new Map();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const chunk = JSON.parse(jsonStr) as OpenAIStreamChunk;

            // Content delta
            const delta = chunk.choices?.[0]?.delta;
            if (delta?.content) {
              yield { type: "delta", content: delta.content };
            }

            // Tool-call fragments — accumulate then emit complete calls
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const existing =
                  toolCallAccumulator.get(tc.index) ?? {
                    id: "",
                    name: "",
                    arguments: "",
                  };
                if (tc.id) existing.id = tc.id;
                if (tc.function?.name) existing.name = tc.function.name;
                if (tc.function?.arguments)
                  existing.arguments += tc.function.arguments;
                toolCallAccumulator.set(tc.index, existing);
              }
            }

            if (chunk.choices?.[0]?.finish_reason) {
              finishReason = chunk.choices[0].finish_reason ?? undefined;
            }

            if (chunk.usage) {
              usage = {
                promptTokens: chunk.usage.prompt_tokens ?? 0,
                completionTokens: chunk.usage.completion_tokens ?? 0,
                totalTokens: chunk.usage.total_tokens ?? 0,
              };
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }

      // Emit accumulated tool calls
      for (const [, tc] of toolCallAccumulator) {
        if (tc.id && tc.name) {
          yield {
            type: "toolCall",
            toolCall: {
              id: tc.id,
              type: "function",
              function: { name: tc.name, arguments: tc.arguments },
            },
          };
        }
      }

      yield {
        type: "done",
        usage,
        finishReason,
        model: apiModel,
        provider: this.id,
      };
    } finally {
      reader.releaseLock();
    }
  }
}
