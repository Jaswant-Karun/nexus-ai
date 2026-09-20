/**
 * NEXUS AI — Anthropic Claude Provider (native Messages API)
 *
 * Endpoint:  POST https://api.anthropic.com/v1/messages
 * Streaming: POST https://api.anthropic.com/v1/messages  (stream: true, SSE)
 *
 * Unlike OpenAI, Anthropic puts the system prompt in a top-level `system`
 * field and only accepts "user"/"assistant" roles in the messages array.
 */

import type {
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

// ─── Anthropic API wire types ──────────────────────────────────────────────────

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
}

type AnthropicContentBlock =
  | { type: "text"; text: string }
  | {
      type: "tool_use";
      id: string;
      name: string;
      input: Record<string, unknown>;
    }
  | {
      type: "tool_result";
      tool_use_id: string;
      content: string;
    };

interface AnthropicResponse {
  id: string;
  model: string;
  role: "assistant";
  content: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; id: string; name: string; input: unknown }
  >;
  stop_reason?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

// ─── Provider implementation ───────────────────────────────────────────────────

export class AnthropicProvider extends BaseProvider {
  readonly id: ProviderId = "anthropic";
  readonly name = "Anthropic";
  protected apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  protected baseUrl = "https://api.anthropic.com/v1";

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      "anthropic-version": "2023-06-01",
    };
  }

  /** Convert generic messages to Anthropic format (system goes top-level). */
  private toAnthropicMessages(
    req: ChatRequest,
  ): { system?: string; messages: AnthropicMessage[] } {
    let system: string | undefined = req.systemPrompt;
    const messages: AnthropicMessage[] = [];

    for (const m of req.messages) {
      if (m.role === "system") {
        // Merge multiple system messages into the top-level field.
        system = system ? `${system}\n\n${m.content}` : m.content;
        continue;
      }
      if (m.role === "tool") {
        // Attach tool result as a user message with tool_result block.
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: m.toolCallId ?? m.name ?? "",
              content: m.content,
            },
          ],
        });
        continue;
      }
      messages.push({
        role: m.role as "user" | "assistant",
        content: m.content,
      });
    }

    return { system, messages };
  }

  private toAnthropicTools(
    tools?: ToolDefinition[],
  ): AnthropicToolDef[] | undefined {
    if (!tools?.length) return undefined;
    return tools.map((t) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
  }

  // ── Non-streaming ──

  async chat(req: ChatRequest, apiModel: string): Promise<ChatResponse> {
    const { system, messages } = this.toAnthropicMessages(req);
    const body: Record<string, unknown> = {
      model: apiModel,
      messages,
      max_tokens: req.maxTokens ?? 4096,
      temperature: req.temperature ?? 0.7,
    };
    if (system) body.system = system;
    const tools = this.toAnthropicTools(req.tools);
    if (tools) body.tools = tools;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/messages`, {
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

    const data = (await res.json()) as AnthropicResponse;
    const usage: TokenUsage = {
      promptTokens: data.usage?.input_tokens ?? 0,
      completionTokens: data.usage?.output_tokens ?? 0,
      totalTokens:
        (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    };

    // Extract text and tool-use blocks.
    let content = "";
    const toolCalls: ToolCall[] = [];

    for (const block of data.content ?? []) {
      if (block.type === "text") {
        content += block.text;
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          type: "function",
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input ?? {}),
          },
        });
      }
    }

    return {
      content,
      model: data.model ?? apiModel,
      provider: this.id,
      usage,
      toolCalls: toolCalls.length ? toolCalls : undefined,
      finishReason: data.stop_reason,
      latencyMs: 0,
    };
  }

  // ── Streaming (SSE) ──

  async *streamChat(
    req: ChatRequest,
    apiModel: string,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const { system, messages } = this.toAnthropicMessages(req);
    const body: Record<string, unknown> = {
      model: apiModel,
      messages,
      max_tokens: req.maxTokens ?? 4096,
      temperature: req.temperature ?? 0.7,
      stream: true,
    };
    if (system) body.system = system;
    const tools = this.toAnthropicTools(req.tools);
    if (tools) body.tools = tools;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/messages`, {
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

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const evt = JSON.parse(jsonStr) as {
              type?: string;
              delta?: {
                type?: string;
                text?: string;
                partial_json?: string;
              };
              content_block?: {
                type?: string;
                id?: string;
                name?: string;
              };
              message?: { model?: string };
              usage?: {
                input_tokens?: number;
                output_tokens?: number;
              };
            };

            switch (evt.type) {
              case "message_start":
                if (evt.message?.model) {
                  // model name available
                }
                if (evt.usage) {
                  usage = {
                    promptTokens: evt.usage.input_tokens ?? 0,
                    completionTokens: 0,
                    totalTokens: evt.usage.input_tokens ?? 0,
                  };
                }
                break;

              case "content_block_start":
                // A new content block — tool_use blocks start here.
                if (evt.content_block?.type === "tool_use") {
                  // Tool call id/name arrive here; arguments stream next.
                }
                break;

              case "content_block_delta":
                if (evt.delta?.type === "text_delta" && evt.delta.text) {
                  yield { type: "delta", content: evt.delta.text };
                }
                break;

              case "message_delta":
                if (evt.usage?.output_tokens && usage) {
                  usage.completionTokens = evt.usage.output_tokens;
                  usage.totalTokens =
                    usage.promptTokens + usage.completionTokens;
                }
                break;

              case "message_stop":
                break;
            }
          } catch {
            // skip malformed
          }
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
