/**
 * NEXUS AI — Multi-Model Layer: Core Type Definitions
 *
 * These types are shared across all providers, the router, the fallback
 * engine, and the usage tracker so the entire system speaks one language.
 */

// ─── Messages ─────────────────────────────────────────────────────────────────

export type Role = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: Role;
  content: string;
  /** Used for tool-result messages (role: "tool"). */
  name?: string;
  toolCallId?: string;
}

// ─── Tools / Function Calling ─────────────────────────────────────────────────

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>; // JSON Schema
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

// ─── Token Usage & Cost ───────────────────────────────────────────────────────

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// ─── Request / Response ───────────────────────────────────────────────────────

export interface ChatRequest {
  /** Model id from the catalog, or "auto" for Nexus Auto routing. */
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  stream?: boolean;
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
  /** The actual model id that produced the response. */
  model: string;
  provider: ProviderId;
  usage: TokenUsage;
  toolCalls?: ToolCall[];
  finishReason?: string;
  /** Set when Nexus Auto routing was used. */
  routedCategory?: TaskCategory;
  routedReason?: string;
  /** Whether a fallback model was used (primary failed). */
  fellBack?: boolean;
  latencyMs: number;
}

// ─── Providers & Models ────────────────────────────────────────────────────────

export type ProviderId = "openai" | "anthropic" | "gemini" | "grok" | "deepseek";

export type ModelTier = "flagship" | "fast" | "reasoning";

export interface ModelDef {
  /** Stable id used in the UI and API, e.g. "gpt-5". */
  id: string;
  /** Display name, e.g. "GPT-5". */
  name: string;
  provider: ProviderId;
  /** The exact model string sent to the provider API (configurable via env). */
  apiModel: string;
  contextWindow: number; // tokens
  costPer1kIn: number; // USD
  costPer1kOut: number; // USD
  capabilities: string[];
  tier: ModelTier;
}

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  envKey: string;
  baseUrl: string;
  /** true when an API key is present in the environment. */
  available: boolean;
  models: ModelDef[];
}

// ─── Nexus Auto Router ────────────────────────────────────────────────────────

export type TaskCategory =
  | "coding"
  | "realtime"
  | "longcontext"
  | "reasoning"
  | "creative"
  | "general";

export interface RouteDecision {
  category: TaskCategory;
  reason: string;
  /** Ordered list of model ids to try (primary first, then fallbacks). */
  modelChain: string[];
}

// ─── Usage Tracking ───────────────────────────────────────────────────────────

export interface UsageRecord {
  timestamp: string;
  provider: ProviderId;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  success: boolean;
  latencyMs: number;
  category?: TaskCategory;
}

export interface UsageSummary {
  provider: ProviderId;
  requests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  successCount: number;
  failureCount: number;
  models: { model: string; requests: number; totalTokens: number }[];
}

// ─── Streaming ─────────────────────────────────────────────────────────────────

export type StreamChunk =
  | { type: "delta"; content: string }
  | { type: "toolCall"; toolCall: ToolCall }
  | { type: "done"; usage?: TokenUsage; finishReason?: string; model?: string; provider?: ProviderId; fellBack?: boolean }
  | { type: "error"; error: string };
