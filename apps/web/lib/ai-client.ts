/**
 * NEXUS AI — Client for the FastAPI AI service at localhost:8001
 * All frontend pages import from here to call the backend AI service.
 */

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? "http://localhost:8001";

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function aiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AI_BASE}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail ?? "AI service error");
  }
  return res.json() as Promise<T>;
}

async function aiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${AI_BASE}${path}`);
  if (!res.ok) throw new Error(`AI service error: ${res.statusText}`);
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
