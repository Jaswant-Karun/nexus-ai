export type NexusId = string;

export type UserRole = "ADMIN" | "MEMBER" | "GUEST" | "SYSTEM";

export interface User {
  id: NexusId;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId: NexusId;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: NexusId;
  name: string;
  slug: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  createdAt: string;
}

export type ModelProvider = "openai" | "anthropic" | "google" | "local" | "custom";

export interface AgentConfig {
  model: string;
  provider: ModelProvider;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
}

export interface Agent {
  id: NexusId;
  name: string;
  description: string;
  avatar?: string;
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  config: AgentConfig;
  organizationId: NexusId;
  createdBy: NexusId;
  createdAt: string;
  updatedAt: string;
}

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Attachment {
  id: NexusId;
  name: string;
  url: string;
  type: string;
  sizeBytes: number;
}

export interface Message {
  id: NexusId;
  conversationId: NexusId;
  role: MessageRole;
  content: string;
  attachments?: Attachment[];
  toolCalls?: Array<{
    id: string;
    name: string;
    arguments: Record<string, unknown>;
  }>;
  createdAt: string;
}

export interface Conversation {
  id: NexusId;
  title: string;
  agentId?: NexusId;
  userId: NexusId;
  pinned: boolean;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export type WorkflowNodeKind = "trigger" | "agent" | "condition" | "action" | "code" | "webhook";

export interface WorkflowNode {
  id: NexusId;
  kind: WorkflowNodeKind;
  label: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: NexusId;
  source: NexusId;
  target: NexusId;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: NexusId;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  organizationId: NexusId;
  createdBy: NexusId;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: NexusId;
  title: string;
  sourceUrl?: string;
  mimeType: string;
  status: "INDEXED" | "PROCESSING" | "FAILED";
  chunkCount: number;
  sizeBytes: number;
  createdAt: string;
}

export interface AnalyticsMetric {
  id: NexusId;
  name: string;
  value: number;
  unit: string;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
