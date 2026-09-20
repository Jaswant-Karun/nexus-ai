// ─── Status ───────────────────────────────────────────────────────────────────
export type Status = "active" | "paused" | "error" | "pending" | "success" | "inactive";

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
}

// ─── Agent ────────────────────────────────────────────────────────────────────
export type AgentKind = "analyst" | "support" | "coder" | "researcher" | "orchestrator";

export interface Agent {
  id: string;
  name: string;
  kind: AgentKind;
  status: Status;
  model: string;
  queries: number;
  accuracy: number; // 0–100
  lastRunAt?: string;
  createdAt: string;
  config?: Record<string, unknown>;
}

// ─── Workflow ─────────────────────────────────────────────────────────────────
export type NodeKind = "trigger" | "agent" | "action" | "condition" | "output";

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;
  description?: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ─── Knowledge / Document ────────────────────────────────────────────────────
export interface KnowledgeDocument {
  id: string;
  title: string;
  mimeType: string;
  size: number; // bytes
  chunks: number;
  status: "indexing" | "indexed" | "error";
  createdAt: string;
}

// ─── Message / Conversation ───────────────────────────────────────────────────
export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  agentId?: string;
  title?: string;
  messages: Message[];
  createdAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface DataPoint {
  label: string;
  value: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
  error?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}
