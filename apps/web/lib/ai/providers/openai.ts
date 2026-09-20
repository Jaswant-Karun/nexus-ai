/**
 * NEXUS AI — OpenAI Provider
 * Endpoint: POST https://api.openai.com/v1/chat/completions  (OpenAI wire format)
 */

import type { ProviderId } from "../types";
import { OpenAICompatibleProvider } from "./openai-compatible";

export class OpenAIProvider extends OpenAICompatibleProvider {
  readonly id: ProviderId = "openai";
  readonly name = "OpenAI";
  protected apiKey = process.env.OPENAI_API_KEY ?? "";
  protected baseUrl = "https://api.openai.com/v1";
}
