/**
 * NEXUS AI — Provider Configuration & Model Catalog
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  MODEL IDS ARE FULLY CONFIGURABLE VIA ENVIRONMENT VARIABLES.             │
 * │  Providers change their catalogues over time — override the apiModel    │
 * │  field for any model using the documented env var.                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Required API keys (set in .env.local):
 *   OPENAI_API_KEY=
 *   ANTHROPIC_API_KEY=
 *   GOOGLE_AI_API_KEY=
 *   XAI_API_KEY=
 *   DEEPSEEK_API_KEY=
 *
 * Optional model-id overrides (defaults shown):
 *   OPENAI_MODEL_GPT5=gpt-5
 *   OPENAI_MODEL_GPT5_MINI=gpt-5-mini
 *   ANTHROPIC_MODEL_SONNET=claude-sonnet-4-5-20250929
 *   ANTHROPIC_MODEL_OPUS=claude-opus-4-1-20250805
 *   GEMINI_MODEL_PRO=gemini-2.5-pro
 *   GEMINI_MODEL_FLASH=gemini-2.5-flash
 *   XAI_MODEL_GROK=grok-4
 *   DEEPSEEK_MODEL_CHAT=deepseek-chat
 *   DEEPSEEK_MODEL_REASONER=deepseek-reasoner
 */

import type { ModelDef, ProviderId, ProviderInfo } from "./types";

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  envKey: string;
  baseUrl: string;
  models: ModelDef[];
}

function model(
  id: string,
  name: string,
  provider: ProviderId,
  apiModel: string,
  contextWindow: number,
  costPer1kIn: number,
  costPer1kOut: number,
  capabilities: string[],
  tier: ModelDef["tier"],
): ModelDef {
  return { id, name, provider, apiModel, contextWindow, costPer1kIn, costPer1kOut, capabilities, tier };
}

// ─── Provider Definitions ─────────────────────────────────────────────────────
// Order here determines the display order in the model selector.

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: "gemini",
    name: "Gemini",
    envKey: "GOOGLE_AI_API_KEY",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: [
      model(
        "gemini-2.5-pro",
        "Gemini 2.5 Pro",
        "gemini",
        process.env.GEMINI_MODEL_PRO ?? "gemini-2.5-pro",
        1_000_000,
        0.00125,
        0.005,
        ["chat", "vision", "tools", "long-context", "reasoning"],
        "flagship",
      ),
      model(
        "gemini-2.5-flash",
        "Gemini 2.5 Flash",
        "gemini",
        process.env.GEMINI_MODEL_FLASH ?? "gemini-2.5-flash",
        1_000_000,
        0.000075,
        0.0003,
        ["chat", "vision", "tools", "long-context"],
        "fast",
      ),
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    baseUrl: "https://api.openai.com/v1",
    models: [
      model(
        "gpt-5",
        "GPT-5",
        "openai",
        process.env.OPENAI_MODEL_GPT5 ?? "gpt-5",
        400_000,
        0.005,
        0.015,
        ["chat", "vision", "tools", "reasoning", "json"],
        "flagship",
      ),
      model(
        "gpt-5-mini",
        "GPT-5 mini",
        "openai",
        process.env.OPENAI_MODEL_GPT5_MINI ?? "gpt-5-mini",
        400_000,
        0.0004,
        0.0016,
        ["chat", "vision", "tools", "json"],
        "fast",
      ),
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    envKey: "ANTHROPIC_API_KEY",
    baseUrl: "https://api.anthropic.com/v1",
    models: [
      model(
        "claude-sonnet",
        "Claude Sonnet",
        "anthropic",
        process.env.ANTHROPIC_MODEL_SONNET ?? "claude-sonnet-4-5-20250929",
        1_000_000,
        0.003,
        0.015,
        ["chat", "vision", "tools", "long-context", "reasoning"],
        "flagship",
      ),
      model(
        "claude-opus",
        "Claude Opus",
        "anthropic",
        process.env.ANTHROPIC_MODEL_OPUS ?? "claude-opus-4-1-20250805",
        1_000_000,
        0.015,
        0.075,
        ["chat", "vision", "tools", "long-context", "reasoning"],
        "flagship",
      ),
    ],
  },
  {
    id: "grok",
    name: "Grok",
    envKey: "XAI_API_KEY",
    baseUrl: "https://api.x.ai/v1",
    models: [
      model(
        "grok",
        "Grok",
        "grok",
        process.env.XAI_MODEL_GROK ?? "grok-4",
        256_000,
        0.005,
        0.015,
        ["chat", "vision", "tools", "web", "realtime"],
        "flagship",
      ),
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    envKey: "DEEPSEEK_API_KEY",
    baseUrl: "https://api.deepseek.com/v1",
    models: [
      model(
        "deepseek-chat",
        "DeepSeek Chat",
        "deepseek",
        process.env.DEEPSEEK_MODEL_CHAT ?? "deepseek-chat",
        128_000,
        0.00014,
        0.00028,
        ["chat", "tools"],
        "fast",
      ),
      model(
        "deepseek-reasoner",
        "DeepSeek Reasoner",
        "deepseek",
        process.env.DEEPSEEK_MODEL_REASONER ?? "deepseek-reasoner",
        128_000,
        0.00014,
        0.00028,
        ["chat", "reasoning"],
        "reasoning",
      ),
    ],
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getProviders(): ProviderInfo[] {
  return PROVIDER_CONFIGS.map((p) => ({
    id: p.id,
    name: p.name,
    envKey: p.envKey,
    baseUrl: p.baseUrl,
    available: !!process.env[p.envKey],
    models: p.models,
  }));
}

export function getAllModels(): ModelDef[] {
  return PROVIDER_CONFIGS.flatMap((p) => p.models);
}

export function getModel(id: string): ModelDef | undefined {
  return getAllModels().find((m) => m.id === id);
}

export function getProviderConfig(id: ProviderId): ProviderConfig | undefined {
  return PROVIDER_CONFIGS.find((p) => p.id === id);
}

export function getProviderForModel(modelId: string): ProviderConfig | undefined {
  const m = getModel(modelId);
  return m ? getProviderConfig(m.provider) : undefined;
}

export function getApiKey(provider: ProviderId): string | undefined {
  const p = getProviderConfig(provider);
  return p ? process.env[p.envKey] : undefined;
}

/** Models whose provider has an API key configured. */
export function getAvailableModels(): ModelDef[] {
  return getAllModels().filter((m) => {
    const p = getProviderConfig(m.provider);
    return p ? !!process.env[p.envKey] : false;
  });
}
