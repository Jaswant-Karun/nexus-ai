/**
 * NEXUS AI — Provider Registry
 *
 * Lazy singleton instances of each provider.  The registry exposes a
 * `getProvider(providerId)` lookup used by the orchestrator and router.
 */

import type { ProviderId } from "../types";
import { BaseProvider } from "./base";
import { OpenAIProvider } from "./openai";
import { GrokProvider } from "./grok";
import { DeepSeekProvider } from "./deepseek";
import { AnthropicProvider } from "./anthropic";
import { GeminiProvider } from "./gemini";

const instances: Partial<Record<ProviderId, BaseProvider>> = {};

export function getProvider(provider: ProviderId): BaseProvider {
  if (instances[provider]) return instances[provider]!;

  let instance: BaseProvider;
  switch (provider) {
    case "openai":
      instance = new OpenAIProvider();
      break;
    case "grok":
      instance = new GrokProvider();
      break;
    case "deepseek":
      instance = new DeepSeekProvider();
      break;
    case "anthropic":
      instance = new AnthropicProvider();
      break;
    case "gemini":
      instance = new GeminiProvider();
      break;
    default:
      throw new Error(`Unknown provider: ${provider as string}`);
  }

  instances[provider] = instance;
  return instance;
}

/** All provider instances keyed by id (for status/health checks). */
export function getAllProviders(): Record<ProviderId, BaseProvider> {
  const all: Record<ProviderId, BaseProvider> = {
    openai: getProvider("openai"),
    anthropic: getProvider("anthropic"),
    gemini: getProvider("gemini"),
    grok: getProvider("grok"),
    deepseek: getProvider("deepseek"),
  };
  return all;
}
