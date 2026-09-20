/**
 * NEXUS AI — xAI Grok Provider
 * Endpoint: POST https://api.x.ai/v1/chat/completions  (OpenAI-compatible)
 */

import type { ProviderId } from "../types";
import { OpenAICompatibleProvider } from "./openai-compatible";

export class GrokProvider extends OpenAICompatibleProvider {
  readonly id: ProviderId = "grok";
  readonly name = "Grok";
  protected apiKey = process.env.XAI_API_KEY ?? "";
  protected baseUrl = "https://api.x.ai/v1";
}
