"use client";

import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  kpis: {
    agents: number;
    workflows: number;
    conversations: number;
    messages: number;
    storageFiles: number;
    storageSizeGB: number;
    aiJobs: number;
    knowledgeDocs: number;
  };
  recentAgents:    { id: string; name: string; status: string }[];
  recentWorkflows: { id: string; name: string; status: string; updatedAt: string }[];
}

function StatCard({ title, value, icon, sub, color = "brand" }: { title: string; value: string | number; icon: string; sub: string; color?: string }) {
  const colors: Record<string, string> = {
    brand:  "from-brand-500/10 to-brand-700/5 border-brand-500/20",
    purple: "from-purple-500/10 to-purple-700/5 border-purple-500/20",
    cyan:   "from-cyan-500/10 to-cyan-700/5 border-cyan-500/20",
    amber:  "from-amber-500/10 to-amber-700/5 border-amber-500/20",
    green:  "from-emerald-500/10 to-emerald-700/5 border-emerald-500/20",
    rose:   "from-rose-500/10 to-rose-700/5 border-rose-500/20",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colors[color] ?? colors.brand}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-dark-300">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-dark-400">{sub}</p>
    </div>
  );
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  PAUSED:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  DRAFT:    "bg-gray-700/60 text-gray-400 border border-gray-600/40",
  INACTIVE: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: AnalyticsData; error?: string }) => {
        if (d.success && d.data) setData(d.data);
        else setError(d.error ?? "Failed to load analytics");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, []);

  const k = data?.kpis;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <AppSidebar activeNav="analytics" />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Analytics</h1>
              <p className="text-gray-400 mt-1">Live metrics from your PostgreSQL database.</p>
            </div>
            <div className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium border",
              loading ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              error   ? "bg-red-500/10 text-red-400 border-red-500/20" :
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
              <span className={cn("h-2 w-2 rounded-full",
                loading ? "bg-amber-400 animate-pulse" : error ? "bg-red-400" : "bg-emerald-400"
              )} />
              {loading ? "Loading…" : error ? "Error" : "Live from PostgreSQL"}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* KPI grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 h-24 animate-pulse" />
              ))}
            </div>
          ) : k && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="AI Agents"        value={k.agents}        icon="🤖" sub="Deployed agents"                 color="brand"  />
              <StatCard title="Workflows"         value={k.workflows}     icon="⚡" sub="Automation pipelines"            color="purple" />
              <StatCard title="Conversations"     value={k.conversations} icon="💬" sub={`${k.messages} total messages`}  color="cyan"   />
              <StatCard title="Knowledge Docs"    value={k.knowledgeDocs} icon="📚" sub="RAG-indexed documents"           color="amber"  />
              <StatCard title="Storage Files"     value={k.storageFiles}  icon="☁️" sub={`${k.storageSizeGB} GB stored`}  color="green"  />
              <StatCard title="AI Jobs Done"      value={k.aiJobs}        icon="🧠" sub="OCR + embed + summarise"         color="rose"   />
              <StatCard title="Total Messages"    value={k.messages}      icon="📨" sub="Chat history"                    color="brand"  />
              <StatCard title="Storage (GB)"      value={`${k.storageSizeGB}`} icon="💾" sub="Total uploaded data"        color="purple" />
            </div>
          )}

          {!loading && data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Agents */}
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Active Agents</h2>
                {data.recentAgents.length === 0 ? (
                  <p className="text-xs text-dark-400">No agents deployed yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.recentAgents.map((a) => (
                      <div key={a.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-dark-800/50 border border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-brand-600/20 flex items-center justify-center text-sm">🤖</div>
                          <span className="text-sm font-medium text-white truncate max-w-[200px]">{a.name}</span>
                        </div>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", STATUS_BADGE[a.status] ?? STATUS_BADGE.DRAFT)}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Workflows */}
              <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Recent Workflows</h2>
                {data.recentWorkflows.length === 0 ? (
                  <p className="text-xs text-dark-400">No workflows created yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.recentWorkflows.map((w) => (
                      <div key={w.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-dark-800/50 border border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-purple-600/20 flex items-center justify-center text-sm">⚡</div>
                          <div>
                            <span className="text-sm font-medium text-white truncate max-w-[180px] block">{w.name}</span>
                            <span className="text-[10px] text-dark-400">
                              {new Date(w.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", STATUS_BADGE[w.status] ?? STATUS_BADGE.DRAFT)}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
