/**
 * NEXUS AI — DeepSeek Provider
 * Endpoint: POST https://api.deepseek.com/v1/chat/completions  (OpenAI-compatible)
 */

import type { ProviderId } from "../types";
import { OpenAICompatibleProvider } from "./openai-compatible";

export class DeepSeekProvider extends OpenAICompatibleProvider {
  readonly id: ProviderId = "deepseek";
  readonly name = "DeepSeek";
  protected apiKey = process.env.DEEPSEEK_API_KEY ?? "";
  protected baseUrl = "https://api.deepseek.com/v1";
}
