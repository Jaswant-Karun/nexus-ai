"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────── */
interface DashboardStats {
  activeAgents:       number;
  totalAgents:        number;
  activeWorkflows:    number;
  totalConversations: number;
  totalMessages:      number;
  knowledgeDocs:      number;
  storageFiles:       number;
  storageSizeGB:      number;
  aiJobsDone:         number;
  recentAgents: {
    id:            string;
    name:          string;
    status:        string;
    model:         string;
    conversations: number;
    createdAt:     string;
  }[];
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊", active: true },
  { id: "chat",      label: "AI Agent Studio",   href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder",  href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine",  href: "/workspace", icon: "🧠" },
  { id: "storage",   label: "Storage",           href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings", href: "/settings",  icon: "⚙️" },
];

/* ── Stat Card ─────────────────────────────────────────────────── */
function KpiCard({
  title, value, sub, icon, accent,
}: { title: string; value: string | number; sub: string; icon: string; accent: string }) {
  const accents: Record<string, string> = {
    brand:  "from-brand-500/10 to-brand-700/5 border-brand-500/20",
    purple: "from-purple-500/10 to-purple-700/5 border-purple-500/20",
    cyan:   "from-cyan-500/10 to-cyan-700/5 border-cyan-500/20",
    amber:  "from-amber-500/10 to-amber-700/5 border-amber-500/20",
    green:  "from-emerald-500/10 to-emerald-700/5 border-emerald-500/20",
    rose:   "from-rose-500/10 to-rose-700/5 border-rose-500/20",
  };
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg", accents[accent] ?? accents.brand)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-dark-300">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-dark-400">{sub}</p>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: DashboardStats; error?: string }) => {
        if (d.success && d.data) setStats(d.data);
        else setError(d.error ?? "Failed to load stats");
      })
      .catch(() => setError("Network error — could not reach the server"))
      .finally(() => setLoading(false));
  }, []);

  const STATUS_BADGE: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    PAUSED: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    DRAFT:  "bg-dark-700/60 text-dark-300 border border-dark-600/40",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/dashboard"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Adaptive Intelligence Overview
              </h1>
              <p className="text-gray-400 mt-1">
                Real-time telemetry and agent orchestration status from your PostgreSQL database.
              </p>
            </div>
            {/* DB health indicator */}
            <div className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium border",
              loading ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              error   ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
              <span className={cn("h-2 w-2 rounded-full", loading ? "bg-amber-400 animate-pulse" : error ? "bg-red-400" : "bg-emerald-400")} />
              {loading ? "Connecting to DB…" : error ? "DB Error" : "PostgreSQL · Live"}
            </div>
          </div>

          {/* Error state */}
          {error && !loading && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-400 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Database connection error</p>
                <p className="text-xs mt-0.5 text-red-400/70">{error} — make sure PostgreSQL is running on localhost:5432</p>
              </div>
            </div>
          )}

          {/* KPI cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 animate-pulse">
                  <div className="h-3 w-24 bg-dark-700 rounded mb-4" />
                  <div className="h-8 w-16 bg-dark-700 rounded mb-2" />
                  <div className="h-3 w-32 bg-dark-700 rounded" />
                </div>
              ))}
            </div>
          ) : stats && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard title="Active AI Agents"      value={stats.activeAgents}        sub={`${stats.totalAgents} total agents deployed`}   icon="🤖" accent="brand"  />
                <KpiCard title="Active Workflows"      value={stats.activeWorkflows}      sub="Automated pipelines"                             icon="⚡" accent="purple" />
                <KpiCard title="Conversations"         value={stats.totalConversations}   sub={`${stats.totalMessages} messages stored`}        icon="💬" accent="cyan"   />
                <KpiCard title="Knowledge Documents"   value={stats.knowledgeDocs}        sub="RAG-indexed for semantic search"                 icon="📚" accent="amber"  />
                <KpiCard title="Storage Files"         value={stats.storageFiles}         sub={`${stats.storageSizeGB} GB stored`}              icon="☁️" accent="green"  />
                <KpiCard title="AI Jobs Completed"     value={stats.aiJobsDone}           sub="OCR, summaries, embeddings"                     icon="🧠" accent="rose"   />
                <KpiCard title="Total Messages"        value={stats.totalMessages}        sub="Chat history across all agents"                  icon="📨" accent="brand"  />
                <KpiCard title="Storage Size"          value={`${stats.storageSizeGB} GB`} sub="Across all uploaded files"                    icon="💾" accent="purple" />
              </div>

              {/* Recent Agents table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Active AI Agents</h2>
                  <Link href="/chat" className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
                    View all agents →
                  </Link>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-left text-xs text-dark-400 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Agent Name</th>
                        <th className="px-5 py-3.5">Model</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Conversations</th>
                        <th className="px-5 py-3.5">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {stats.recentAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-lg bg-brand-600/20 flex items-center justify-center text-sm">🤖</div>
                              <span className="font-medium text-white">{agent.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs text-dark-200 bg-dark-800/80 border border-white/[0.06] rounded-lg px-2 py-1">
                              {agent.model}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_BADGE[agent.status] ?? STATUS_BADGE.DRAFT)}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-dark-200">{agent.conversations}</td>
                          <td className="px-5 py-3.5 text-dark-400 text-xs">
                            {new Date(agent.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "New Agent",    icon: "🤖", href: "/chat",      color: "hover:bg-brand-500/10  hover:border-brand-500/20  text-dark-300" },
                  { label: "New Workflow", icon: "⚡", href: "/workflow",  color: "hover:bg-purple-500/10 hover:border-purple-500/20 text-dark-300" },
                  { label: "Upload Doc",   icon: "📄", href: "/workspace", color: "hover:bg-cyan-500/10   hover:border-cyan-500/20   text-dark-300" },
                  { label: "Upload File",  icon: "☁️", href: "/storage/upload", color: "hover:bg-emerald-500/10 hover:border-emerald-500/20 text-dark-300" },
                ].map((a) => (
                  <Link key={a.label} href={a.href}
                    className={cn("flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 transition-all hover:-translate-y-0.5", a.color)}>
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-sm font-medium text-white">{a.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
