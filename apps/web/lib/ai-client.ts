/**
 * NEXUS AI — Client for the FastAPI AI service.
 * Routes through /api/ai/... (Next.js proxy) so calls are server-side.
 * No CORS issues, no direct browser-to-port-8001 connection needed.
 */

// In the browser we always call our own Next.js proxy at /api/ai/...
// On the server (SSR) we call the AI service directly.
const AI_BASE =
  typeof window === "undefined"
    ? (process.env.AI_SERVICE_URL ?? "http://localhost:8001")
    : "/api/ai";

// ── Generic fetch helpers ─────────────────────────────────────────────────────
async function aiPost<T>(path: string, body: unknown): Promise<T> {
  // Strip leading /api/v1 when going through proxy (proxy re-adds it)
  const url = `${AI_BASE}${path}`;
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText })) as {
      detail?: string; error?: string;
    };
    throw new Error(err.detail ?? err.error ?? `AI service error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function aiGet<T>(path: string): Promise<T> {
  const url = `${AI_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? `AI service error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Health ────────────────────────────────────────────────────────────────────
export interface AIHealth {
  status:    string;
  service:   string;
  version:   string;
  providers: Record<string, boolean | string>;
  modules:   string[];
}
export const checkAIHealth = () => aiGet<AIHealth>("/health");

// ── Chat / Agents ─────────────────────────────────────────────────────────────
export interface AgentMessage { role: string; content: string; }

export interface AgentRunRequest {
  task:    string;
  agent: {
    name:        string;
    role:        string;
    model:       string;
    temperature: number;
    system_prompt?: string;
    tools:       string[];
  };
  history:      AgentMessage[];
  context_docs: string[];
}

export interface AgentRunResponse {
  agent_id:    string;
  task:        string;
  answer:      string;
  steps:       { step: number; thought: string; action: string; observation: string }[];
  tokens_used: number;
  model:       string;
  success:     boolean;
}

export const runAgent = (req: AgentRunRequest) =>
  aiPost<AgentRunResponse>("/api/v1/agents/run", req);

// ── Summarizer ────────────────────────────────────────────────────────────────
export interface SummarizeRequest {
  text:        string;
  strategy?:   "abstractive" | "map_reduce" | "refine" | "stuff";
  max_length?: number;
  bullet_points?: boolean;
  model?:      string;
}
export interface SummarizeResponse {
  summary:      string;
  bullet_points: string[];
  keywords:     string[];
  word_count:   number;
  compression_ratio: number;
  strategy:     string;
  model:        string;
  tokens_used:  number;
}
export const summarizeText = (req: SummarizeRequest) =>
  aiPost<SummarizeResponse>("/api/v1/summarizer/summarize", req);

// ── Reasoning ─────────────────────────────────────────────────────────────────
export interface ReasoningRequest {
  question:    string;
  context?:    string[];
  strategy?:   "chain_of_thought" | "react" | "self_consistency";
  model?:      string;
}
export interface ReasoningResponse {
  question:     string;
  strategy:     string;
  steps:        { step_number: number; type: string; content: string }[];
  final_answer: string;
  confidence:   number;
  tokens_used:  number;
  model:        string;
}
export const applyReasoning = (req: ReasoningRequest) =>
  aiPost<ReasoningResponse>("/api/v1/reasoning/reason", req);

// ── Planner ───────────────────────────────────────────────────────────────────
export interface PlanRequest {
  goal:        string;
  context?:    string;
  constraints?: string[];
  model?:      string;
}
export interface PlanResponse {
  plan: {
    plan_id:         string;
    goal:            string;
    subtasks:        { id: string; title: string; description: string; priority: string; agent_role: string }[];
    execution_order: string[];
    strategy:        string;
    reasoning:       string;
  };
  model:       string;
  tokens_used: number;
}
export const createPlan = (req: PlanRequest) =>
  aiPost<PlanResponse>("/api/v1/planner/plan", req);

// ── Workflow Generator ─────────────────────────────────────────────────────────
export interface WorkflowGenRequest {
  goal:               string;
  context?:           string;
  available_agents?:  string[];
  available_tools?:   string[];
  max_nodes?:         number;
  model?:             string;
}
export interface WorkflowGenResponse {
  workflow: {
    name:        string;
    description: string;
    nodes:       { id: string; kind: string; label: string; description: string; config: Record<string, unknown>; position: { x: number; y: number } }[];
    edges:       { id: string; source: string; target: string; label: string }[];
    reasoning:   string;
    estimated_duration: string;
  };
  model:       string;
  tokens_used: number;
}
export const generateWorkflow = (req: WorkflowGenRequest) =>
  aiPost<WorkflowGenResponse>("/api/v1/workflow-generator/generate", req);

// ── Embeddings ────────────────────────────────────────────────────────────────
export interface EmbedRequest {
  texts:  string[];
  model?: string;
}
export interface EmbedResponse {
  model:      string;
  embeddings: number[][];
  dimensions: number;
  token_count: number;
}
export const createEmbeddings = (req: EmbedRequest) =>
  aiPost<EmbedResponse>("/api/v1/embeddings/embed", req);

// ── Vector search ─────────────────────────────────────────────────────────────
export interface VectorSearchRequest {
  collection: string;
  query:      string;
  top_k?:     number;
}
export interface VectorSearchResponse {
  query:      string;
  collection: string;
  hits:       { id: string; score: number; text: string; metadata: Record<string, unknown> }[];
  total:      number;
}
export const vectorSearch = (req: VectorSearchRequest) =>
  aiPost<VectorSearchResponse>("/api/v1/vector-search/search", req);

// ── Report ────────────────────────────────────────────────────────────────────
export interface ReportRequest {
  title:        string;
  data:         Record<string, unknown>;
  instructions?: string;
  model?:       string;
}
export interface ReportResponse {
  title:       string;
  content:     string;
  sections:    { title: string; content: string }[];
  format:      string;
  word_count:  number;
  model:       string;
  tokens_used: number;
}
export const generateReport = (req: ReportRequest) =>
  aiPost<ReportResponse>("/api/v1/report-generator/generate", req);
