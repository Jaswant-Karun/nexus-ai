export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;  // tokens
  costPer1kIn: number;    // USD
  costPer1kOut: number;   // USD
  latencyMs: number;
  hosted: "cloud" | "local";
  capabilities: string[];
}

export const AI_MODELS: ModelInfo[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    costPer1kIn: 0.005,
    costPer1kOut: 0.015,
    latencyMs: 310,
    hosted: "cloud",
    capabilities: ["chat", "vision", "function-calling", "json-mode"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    costPer1kIn: 0.003,
    costPer1kOut: 0.015,
    latencyMs: 420,
    hosted: "cloud",
    capabilities: ["chat", "vision", "function-calling", "long-context"],
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 1000000,
    costPer1kIn: 0.00125,
    costPer1kOut: 0.005,
    latencyMs: 280,
    hosted: "cloud",
    capabilities: ["chat", "vision", "function-calling", "long-context"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    contextWindow: 128000,
    costPer1kIn: 0.002,
    costPer1kOut: 0.006,
    latencyMs: 190,
    hosted: "cloud",
    capabilities: ["chat", "function-calling"],
  },
  {
    id: "llama-3-1-70b",
    name: "LLaMA 3.1 70B",
    provider: "Local / Ollama",
    contextWindow: 128000,
    costPer1kIn: 0,
    costPer1kOut: 0,
    latencyMs: 85,
    hosted: "local",
    capabilities: ["chat"],
  },
];

export const DEFAULT_MODEL_ID = "gpt-4o";
export const FALLBACK_MODEL_ID = "claude-3-5-sonnet";
