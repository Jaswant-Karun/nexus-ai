/**
 * NEXUS AI — Abstract base provider.
 *
 * Every provider implements two operations:
 *   chat()       — non-streaming, returns the full response + usage.
 *   streamChat() — async generator yielding StreamChunk deltas.
 *
 * Both accept the configured `apiModel` string so the same provider class can
 * serve multiple models from the same family.
 */

import type {
  ChatRequest,
  ChatResponse,
  ProviderId,
  StreamChunk,
  TokenUsage,
} from "../types";

export abstract class BaseProvider {
  abstract readonly id: ProviderId;
  abstract readonly name: string;

  protected abstract apiKey: string;
  protected abstract baseUrl: string;

  /** true when an API key is present in the environment. */
  get available(): boolean {
    return !!this.apiKey;
  }

  abstract chat(req: ChatRequest, apiModel: string): Promise<ChatResponse>;
  abstract streamChat(
    req: ChatRequest,
    apiModel: string,
  ): AsyncGenerator<StreamChunk, void, unknown>;

  /** Rough cost estimate from token usage. */
  protected estimateCost(
    usage: TokenUsage,
    costPer1kIn: number,
    costPer1kOut: number,
  ): number {
    return (
      (usage.promptTokens * costPer1kIn +
        usage.completionTokens * costPer1kOut) /
      1000
    );
  }
}
