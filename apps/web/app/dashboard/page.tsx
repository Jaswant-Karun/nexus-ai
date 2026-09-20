"use client";

import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { APP_NAV } from "@/constants/navigation";

/* ── Types ─────────────────────────────────────────────────────── */
interface DashboardStats {
  activeAgents: number;
  totalAgents: number;
  activeWorkflows: number;
  totalConversations: number;
  totalMessages: number;
  knowledgeDocs: number;
  storageFiles: number;
  storageSizeGB: number;
  aiJobsDone: number;
  recentAgents: {
    id: string;
    name: string;
    status: string;
    model: string;
    conversations: number;
    createdAt: string;
  }[];
}

/* ── Animated KPI Card with Framer Motion ───────────────────────── */
function KpiCard({
  title,
  value,
  sub,
  icon,
  accent,
  index = 0,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: string;
  accent: string;
  index?: number;
}) {
  const accents: Record<string, string> = {
    brand: "from-brand-500/10 to-brand-700/5 border-brand-500/20 text-brand-600 dark:text-brand-400",
    purple: "from-purple-500/10 to-purple-700/5 border-purple-500/20 text-purple-600 dark:text-purple-400",
    cyan: "from-cyan-500/10 to-cyan-700/5 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    amber: "from-amber-500/10 to-amber-700/5 border-amber-500/20 text-amber-600 dark:text-amber-400",
    green: "from-emerald-500/10 to-emerald-700/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rose: "from-rose-500/10 to-rose-700/5 border-rose-500/20 text-rose-600 dark:text-rose-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg backdrop-blur-md",
        "bg-white/90 border-slate-200 dark:bg-dark-900/60 dark:border-white/[0.08]",
        accents[accent] ?? accents.brand
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-dark-300">
          {title}
        </p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-dark-400">{sub}</p>
    </motion.div>
  );
}

/* ── Main Dashboard Page ────────────────────────────────────────── */
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    PAUSED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    DRAFT: "bg-slate-200 text-slate-600 border-slate-300 dark:bg-dark-700/60 dark:text-dark-300 dark:border-dark-600/40",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-dark-950 dark:text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <div className="flex flex-1">
        <AppSidebar activeNav="dashboard" className="hidden xl:flex" />

        <div className="flex min-w-0 flex-1 flex-col">
          <nav
            aria-label="Platform modules"
            className="flex xl:hidden gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 dark:border-white/[0.06] dark:bg-dark-950/90"
          >
            {APP_NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  item.id === "dashboard"
                    ? "bg-brand-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-dark-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                )}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Adaptive Intelligence Overview
              </h1>
              <p className="text-slate-500 dark:text-dark-300 text-sm mt-1">
                Real-time multi-agent telemetry and pipeline status powered by PostgreSQL & Prisma.
              </p>
            </div>

            {/* DB health badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border shadow-sm backdrop-blur-md self-start sm:self-auto",
                loading
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                  : error
                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              )}
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  loading
                    ? "bg-amber-500 animate-ping"
                    : error
                    ? "bg-red-500"
                    : "bg-emerald-500 animate-pulse"
                )}
              />
              {loading ? "Connecting Prisma…" : error ? "DB Error" : "PostgreSQL Engine · Connected"}
            </div>
          </div>

          {/* Error State if DB down */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-3"
            >
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">Database connection notice</p>
                <p className="text-xs mt-0.5 text-red-600 dark:text-red-400/80">
                  {error} — ensure PostgreSQL is listening on localhost:5432.
                </p>
              </div>
            </motion.div>
          )}

          {/* KPI Cards Grid with Framer Motion */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse shadow-sm dark:border-white/[0.06] dark:bg-dark-900/60"
                >
                  <div className="h-3 w-24 bg-slate-200 dark:bg-dark-700 rounded mb-4" />
                  <div className="h-8 w-16 bg-slate-200 dark:bg-dark-700 rounded mb-2" />
                  <div className="h-3 w-32 bg-slate-200 dark:bg-dark-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            stats && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <KpiCard
                    title="Active AI Agents"
                    value={stats.activeAgents}
                    sub={`${stats.totalAgents} total agents deployed`}
                    icon="🤖"
                    accent="brand"
                    index={0}
                  />
                  <KpiCard
                    title="Active Workflows"
                    value={stats.activeWorkflows}
                    sub="Automated pipelines"
                    icon="⚡"
                    accent="purple"
                    index={1}
                  />
                  <KpiCard
                    title="Conversations"
                    value={stats.totalConversations}
                    sub={`${stats.totalMessages} messages stored`}
                    icon="💬"
                    accent="cyan"
                    index={2}
                  />
                  <KpiCard
                    title="Knowledge Documents"
                    value={stats.knowledgeDocs}
                    sub="Indexed for semantic RAG"
                    icon="📚"
                    accent="amber"
                    index={3}
                  />
                  <KpiCard
                    title="Storage Files"
                    value={stats.storageFiles}
                    sub={`${stats.storageSizeGB} GB verified`}
                    icon="☁️"
                    accent="green"
                    index={4}
                  />
                  <KpiCard
                    title="AI Jobs Completed"
                    value={stats.aiJobsDone}
                    sub="OCR, summaries, embeddings"
                    icon="🧠"
                    accent="rose"
                    index={5}
                  />
                  <KpiCard
                    title="Total Messages"
                    value={stats.totalMessages}
                    sub="Chat history in PostgreSQL"
                    icon="📨"
                    accent="brand"
                    index={6}
                  />
                  <KpiCard
                    title="Storage Size"
                    value={`${stats.storageSizeGB} GB`}
                    sub="Secure local storage volume"
                    icon="💾"
                    accent="purple"
                    index={7}
                  />
                </div>

                {/* Active Agents Table Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Connected Multi-Model Agents
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                        Active agent instances ready for interactive sessions.
                      </p>
                    </div>
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                    >
                      Open Agent Studio →
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-white/[0.08] dark:bg-dark-900/60 backdrop-blur-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider dark:border-white/[0.06] dark:bg-dark-950/40 dark:text-dark-400">
                            <th className="px-5 py-3.5">Agent Name</th>
                            <th className="px-5 py-3.5">Model ID</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5">Conversations</th>
                            <th className="px-5 py-3.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                          {stats.recentAgents.map((agent) => (
                            <tr
                              key={agent.id}
                              className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-xl bg-brand-50 border border-brand-200 dark:bg-brand-600/20 dark:border-brand-500/30 flex items-center justify-center text-sm shadow-sm">
                                    🤖
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {agent.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="font-mono text-xs text-slate-700 dark:text-dark-200 bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-white/[0.06] rounded-lg px-2.5 py-1">
                                  {agent.model}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={cn(
                                    "rounded-full px-3 py-0.5 text-xs font-semibold",
                                    STATUS_BADGE[agent.status] ?? STATUS_BADGE.DRAFT
                                  )}
                                >
                                  {agent.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-slate-600 dark:text-dark-200 font-medium">
                                {agent.conversations} sessions
                              </td>
                              <td className="px-5 py-3.5">
                                <Link
                                  href={`/chat?agent=${agent.id}`}
                                  className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 transition-all"
                                >
                                  Chat →
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Platform Launchpad */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {[
                    {
                      label: "AI Agent Studio",
                      icon: "🤖",
                      href: "/chat",
                      sub: "Interactive Prompting",
                      color: "hover:border-brand-500/40 hover:bg-brand-50/50 dark:hover:bg-brand-500/10",
                    },
                    {
                      label: "Workflow Canvas",
                      icon: "⚡",
                      href: "/workflow",
                      sub: "Visual Orchestration",
                      color: "hover:border-purple-500/40 hover:bg-purple-50/50 dark:hover:bg-purple-500/10",
                    },
                    {
                      label: "Knowledge Engine",
                      icon: "🧠",
                      href: "/workspace",
                      sub: "Semantic Search",
                      color: "hover:border-cyan-500/40 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/10",
                    },
                    {
                      label: "Storage Explorer",
                      icon: "☁️",
                      href: "/storage",
                      sub: "Verified File Vault",
                      color: "hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10",
                    },
                  ].map((a, idx) => (
                    <motion.div
                      key={a.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                    >
                      <Link
                        href={a.href}
                        className={cn(
                          "flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/[0.08] dark:bg-dark-900/60 backdrop-blur-md",
                          a.color
                        )}
                      >
                        <span className="text-2xl mb-1">{a.icon}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {a.label}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-dark-400">{a.sub}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )
          )}
          </main>
        </div>
      </div>
    </div>
  );
}
