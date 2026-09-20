"use client";

import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Status } from "@/types";

interface Agent {
  id: string;
  name: string;
  status: Status;
  model: string;
  queries: string;
  accuracy: string;
  lastRun: string;
}

const defaultAgents: Agent[] = [
  { id: "1", name: "Data Analyst Agent",      status: "active",   model: "GPT-4o",           queries: "1,240",  accuracy: "99.4%", lastRun: "2 min ago" },
  { id: "2", name: "Customer Support Bot",    status: "active",   model: "Claude 3.5 Sonnet",queries: "8,920",  accuracy: "98.1%", lastRun: "Just now"  },
  { id: "3", name: "Code Review Assistant",   status: "paused",   model: "GPT-4o",           queries: "450",    accuracy: "97.5%", lastRun: "1 hr ago"  },
  { id: "4", name: "RAG Document Synthesizer",status: "active",   model: "Gemini 1.5 Pro",   queries: "3,110",  accuracy: "99.0%", lastRun: "5 min ago" },
  { id: "5", name: "Fraud Detection Agent",   status: "error",    model: "Mistral Large",    queries: "220",    accuracy: "91.2%", lastRun: "3 hr ago"  },
];

type AgentRow = Record<string, unknown> & Agent;

const columns = [
  { key: "name",     header: "Agent Name",  sortable: true },
  { key: "model",    header: "Model",       sortable: true },
  {
    key: "status",
    header: "Status",
    render: (a: AgentRow) => <StatusBadge status={a.status as Status} />,
  },
  { key: "queries",  header: "Executions",  sortable: true },
  { key: "accuracy", header: "Accuracy",    sortable: true },
  { key: "lastRun",  header: "Last Run" },
];

interface AgentTableProps {
  agents?: Agent[];
}

export function AgentTable({ agents = defaultAgents }: AgentTableProps) {
  return (
    <DataTable
      columns={columns}
      data={agents as AgentRow[]}
      keyExtractor={(a) => (a as Agent).id}
      pageSize={8}
    />
  );
}
