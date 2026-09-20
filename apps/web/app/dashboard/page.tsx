"use client";

import { NavBar, Sidebar, StatCard, InsightCard, DataTable } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";

export default function DashboardPage() {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊", active: true },
    { id: "chat", label: "AI Agent Studio", href: "/chat", icon: "🤖" },
    { id: "workflow", label: "Workflow Builder", href: "/workflow", icon: "⚡" },
    { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
    { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️" },
  ];

  const recentAgents = [
    { id: "agent_1", name: "Data Analyst Agent", status: "ACTIVE", queries: "1,240", accuracy: "99.4%" },
    { id: "agent_2", name: "Customer Support Bot", status: "ACTIVE", queries: "8,920", accuracy: "98.1%" },
    { id: "agent_3", name: "Code Review Assistant", status: "PAUSED", queries: "450", accuracy: "97.5%" },
    { id: "agent_4", name: "RAG Document Synthesizer", status: "ACTIVE", queries: "3,110", accuracy: "99.0%" },
  ];

  const columns = [
    { key: "name", header: "Agent Name" },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof recentAgents)[0]) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            item.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: "queries", header: "Total Executions" },
    { key: "accuracy", header: "Accuracy Score" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/dashboard"
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Adaptive Intelligence Overview</h1>
            <p className="text-gray-400 mt-1">Real-time telemetry and agent orchestration status across your enterprise cluster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Active Autonomous Agents" value="14" trend="+3 this week" />
            <StatCard title="Workflow Executions" value="142.8k" trend="+12% throughput" />
            <StatCard title="Vector Search Latency" value="12.4ms" trend="-4.1ms optimized" />
            <StatCard title="Total Knowledge Embeddings" value="4.8M" trend="540 GB indexed" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard title="High Accuracy Threshold" metric="99.4%" description="Agents are delivering optimal response fidelity using hybrid search & reranking." />
            <InsightCard title="Memory Engine Health" metric="99.9%" description="Qdrant vector cluster is fully synchronized with zero query drops." />
            <InsightCard title="Orchestrator Cost" metric="$0.002/req" description="Model routing optimized token distribution across local and cloud LLMs." />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Active Autonomous Agents</h2>
            <DataTable columns={columns} data={recentAgents} keyExtractor={(item) => item.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
