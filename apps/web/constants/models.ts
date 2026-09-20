/**
 * NEXUS AI — Model catalog (legacy display definitions).
 *
 * The authoritative catalog now lives in lib/ai/config.ts and reads
 * configurable apiModel strings from environment variables. This file is kept
 * for reference and any legacy imports that need display metadata.
 *
 * The 5 supported providers are:
 *   Gemini (Google) · OpenAI · Anthropic · Grok (xAI) · DeepSeek
 */

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  costPer1kIn: number;
  costPer1kOut: number;
  latencyMs: number;
  hosted: "cloud";
  capabilities: string[];
}

export const AI_MODELS: ModelInfo[] = [
  // ── Gemini ──
  { id: "gemini-2.5-pro",   name: "Gemini 2.5 Pro",   provider: "Gemini",     contextWindow: 1_000_000, costPer1kIn: 0.00125,  costPer1kOut: 0.005,   latencyMs: 280, hosted: "cloud", capabilities: ["chat","vision","tools","long-context","reasoning"] },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Gemini",     contextWindow: 1_000_000, costPer1kIn: 0.000075, costPer1kOut: 0.0003,  latencyMs: 120, hosted: "cloud", capabilities: ["chat","vision","tools","long-context"] },

  // ── OpenAI ──
  { id: "gpt-5",      name: "GPT-5",      provider: "OpenAI",    contextWindow: 400_000, costPer1kIn: 0.005,  costPer1kOut: 0.015, latencyMs: 310, hosted: "cloud", capabilities: ["chat","vision","tools","reasoning","json"] },
  { id: "gpt-5-mini", name: "GPT-5 mini", provider: "OpenAI",    contextWindow: 400_000, costPer1kIn: 0.0004, costPer1kOut: 0.0016, latencyMs: 150, hosted: "cloud", capabilities: ["chat","vision","tools","json"] },

  // ── Anthropic ──
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic", contextWindow: 1_000_000, costPer1kIn: 0.003,  costPer1kOut: 0.015, latencyMs: 420, hosted: "cloud", capabilities: ["chat","vision","tools","long-context","reasoning"] },
  { id: "claude-opus",   name: "Claude Opus",   provider: "Anthropic", contextWindow: 1_000_000, costPer1kIn: 0.015,  costPer1kOut: 0.075, latencyMs: 500, hosted: "cloud", capabilities: ["chat","vision","tools","long-context","reasoning"] },

  // ── Grok (xAI) ──
  { id: "grok", name: "Grok", provider: "Grok", contextWindow: 256_000, costPer1kIn: 0.005, costPer1kOut: 0.015, latencyMs: 350, hosted: "cloud", capabilities: ["chat","vision","tools","web","realtime"] },

  // ── DeepSeek ──
  { id: "deepseek-chat",     name: "DeepSeek Chat",     provider: "DeepSeek", contextWindow: 128_000, costPer1kIn: 0.00014, costPer1kOut: 0.00028, latencyMs: 200, hosted: "cloud", capabilities: ["chat","tools"] },
  { id: "deepseek-reasoner", name: "DeepSeek Reasoner", provider: "DeepSeek", contextWindow: 128_000, costPer1kIn: 0.00014, costPer1kOut: 0.00028, latencyMs: 300, hosted: "cloud", capabilities: ["chat","reasoning"] },
];

/** Nexus Auto — the router picks the best model. */
export const DEFAULT_MODEL_ID = "auto";
export const FALLBACK_MODEL_ID = "claude-sonnet";
