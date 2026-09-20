/**
 * NEXUS AI — Google Gemini Provider (native generateContent API)
 *
 * Endpoint:  POST .../v1beta/models/{apiModel}:generateContent?key=KEY
 * Streaming: POST .../v1beta/models/{apiModel}:streamGenerateContent?alt=sse&key=KEY
 *
 * Key differences from OpenAI:
 *   - Roles are "user" and "model" (not "assistant").
 *   - System prompt goes in a top-level `systemInstruction` field.
 *   - Content is wrapped in `parts: [{ text }]`.
 *   - Tools use `functionDeclarations` (not the OpenAI shape).
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

// ─── Gemini API wire types ────────────────────────────────────────────────────

interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[]; role?: string };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

interface GeminiToolDef {
  functionDeclarations: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
}

// ─── Provider implementation ───────────────────────────────────────────────────

export class GeminiProvider extends BaseProvider {
  readonly id: ProviderId = "gemini";
  readonly name = "Gemini";
  protected apiKey = process.env.GOOGLE_AI_API_KEY ?? "";
  protected baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  private toGeminiContents(
    req: ChatRequest,
  ): { systemInstruction?: { parts: { text: string }[] }; contents: GeminiContent[] } {
    let systemInstruction: { parts: { text: string }[] } | undefined;
    const contents: GeminiContent[] = [];

    const systemParts: string[] = [];
    if (req.systemPrompt) systemParts.push(req.systemPrompt);

    for (const m of req.messages) {
      if (m.role === "system") {
        systemParts.push(m.content);
        continue;
      }
      if (m.role === "tool") {
        // Tool results come back as a "model" turn with functionResponse.
        contents.push({
          role: "model",
          parts: [
            {
              functionResponse: {
                name: m.name ?? "",
                response: { result: m.content },
              },
            },
          ],
        });
        continue;
      }

      // Check if this is a tool-call turn (assistant with tool_calls already
      // rendered — for simplicity we pass text-only assistant turns).
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
    }

    if (systemParts.length) {
      systemInstruction = { parts: [{ text: systemParts.join("\n\n") }] };
    }

    return { systemInstruction, contents };
  }

  private toGeminiTools(
    tools?: ToolDefinition[],
  ): GeminiToolDef | undefined {
    if (!tools?.length) return undefined;
    return {
      functionDeclarations: tools.map((t) => ({
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters,
      })),
    };
  }

  private buildBody(
    req: ChatRequest,
    apiModel: string,
    stream: boolean,
  ): { url: string; body: Record<string, unknown> } {
    const { systemInstruction, contents } = this.toGeminiContents(req);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: req.temperature ?? 0.7,
        maxOutputTokens: req.maxTokens ?? 8192,
      },
    };
    if (systemInstruction) body.systemInstruction = systemInstruction;
    const tools = this.toGeminiTools(req.tools);
    if (tools) body.tools = [tools];

    const action = stream ? "streamGenerateContent" : "generateContent";
    const query = stream ? "?alt=sse" : "";
    const url = `${this.baseUrl}/models/${apiModel}:${action}${query}`;

    return { url, body };
  }

  private extractContent(data: GeminiResponse): {
    content: string;
    toolCalls: ToolCall[];
    finishReason?: string;
  } {
    let content = "";
    const toolCalls: ToolCall[] = [];

    for (const candidate of data.candidates ?? []) {
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
        // keep non-stop reasons (e.g. MAX_TOKENS)
      }
      for (const part of candidate.content?.parts ?? []) {
        if (part.text) content += part.text;
        if (part.functionCall) {
          toolCalls.push({
            id: `call_${part.functionCall.name}_${Date.now()}`,
            type: "function",
            function: {
              name: part.functionCall.name,
              arguments: JSON.stringify(part.functionCall.args ?? {}),
            },
          });
        }
      }
    }

    return { content, toolCalls, finishReason: data.candidates?.[0]?.finishReason };
  }

  private extractUsage(data: GeminiResponse): TokenUsage {
    const m = data.usageMetadata ?? {};
    return {
      promptTokens: m.promptTokenCount ?? 0,
      completionTokens: m.candidatesTokenCount ?? 0,
      totalTokens: m.totalTokenCount ?? 0,
    };
  }

  // ── Non-streaming ──

  async chat(req: ChatRequest, apiModel: string): Promise<ChatResponse> {
    const { url, body } = this.buildBody(req, apiModel, false);
    const fullUrl = `${url}&key=${this.apiKey}`;

    let res: Response;
    try {
      res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const data = (await res.json()) as GeminiResponse;
    const { content, toolCalls, finishReason } = this.extractContent(data);
    const usage = this.extractUsage(data);

    return {
      content,
      model: apiModel,
      provider: this.id,
      usage,
      toolCalls: toolCalls.length ? toolCalls : undefined,
      finishReason,
      latencyMs: 0,
    };
  }

  // ── Streaming (SSE via streamGenerateContent) ──

  async *streamChat(
    req: ChatRequest,
    apiModel: string,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const { url, body } = this.buildBody(req, apiModel, true);
    const fullUrl = `${url}&key=${this.apiKey}`;

    let res: Response;
    try {
      res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            const chunk = JSON.parse(jsonStr) as GeminiResponse;
            const { content, toolCalls } = this.extractContent(chunk);

            if (content) {
              yield { type: "delta", content };
            }
            for (const tc of toolCalls) {
              yield { type: "toolCall", toolCall: tc };
            }

            if (!finishReason) {
              finishReason = chunk.candidates?.[0]?.finishReason;
            }
            if (chunk.usageMetadata && !usage) {
              usage = this.extractUsage(chunk);
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
