"use client";

/**
 * NEXUS AI — AI Usage Dashboard
 *
 * Shows per-provider usage statistics:
 *   AI Usage → Cost → Provider → Model → Tokens → Requests
 *
 * Auto-refreshes every 10s while visible.
 */

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Chat",          href: "/chat",      icon: "🤖" },
  { id: "usage",     label: "AI Usage",         href: "/usage",     icon: "📈", active: true },
  { id: "workflow",  label: "Workflow Builder", href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
  { id: "storage",   label: "Storage",          href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings",href: "/settings",  icon: "⚙️" },
];

interface ModelStat {
  model: string;
  requests: number;
  totalTokens: number;
}

interface UsageSummary {
  provider: string;
  requests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  successCount: number;
  failureCount: number;
  models: ModelStat[];
}

interface UsageRecord {
  timestamp: string;
  provider: string;
  model: string;
  totalTokens: number;
  costUsd: number;
  success: boolean;
  latencyMs: number;
  category?: string;
}

interface UsageData {
  summary: UsageSummary[];
  recent: UsageRecord[];
  totals: {
    requests: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd: number;
    successCount: number;
    failureCount: number;
  };
}

const PROVIDER_ICONS: Record<string, string> = {
  gemini: "✦",
  openai: "◎",
  anthropic: "✶",
  grok: "✕",
  deepseek: "◆",
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(() => {
    fetch("/api/ai/usage")
      .then((r) => r.json())
      .then((d: UsageData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 10_000);
    return () => clearInterval(interval);
  }, [fetchUsage]);

  const totals = data?.totals;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          items={sidebarItems}
          currentPath="/usage"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  AI Usage Dashboard
                </h1>
                <p className="text-xs text-dark-400 mt-0.5">
                  Provider · Model · Tokens · Requests · Cost
                </p>
              </div>
              <button
                type="button"
                onClick={fetchUsage}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-medium text-dark-300 hover:text-white transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
              </div>
            ) : !data || (!totals?.requests) ? (
              <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 px-6 py-16 text-center">
                <p className="text-2xl mb-2">📊</p>
                <p className="text-sm text-dark-300">No usage data yet</p>
                <p className="text-xs text-dark-500 mt-1">
                  Send a message in AI Chat to start tracking usage
                </p>
              </div>
            ) : (
              <>
                {/* Totals */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
                  {[
                    { label: "Total Requests", value: String(totals!.requests), icon: "📨" },
                    { label: "Total Tokens",   value: formatTokens(totals!.totalTokens), icon: "🎯" },
                    { label: "Est. Cost",      value: formatCost(totals!.costUsd), icon: "💰" },
                    {
                      label: "Success Rate",
                      value: `${totals!.requests ? ((totals!.successCount / totals!.requests) * 100).toFixed(1) : 0}%`,
                      icon: "✅",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/[0.06] bg-dark-800/40 px-4 py-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dark-500">
                        {stat.icon} {stat.label}
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Per-provider table */}
                <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 overflow-hidden mb-6">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <h2 className="text-sm font-bold text-white">By Provider</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-dark-500 border-b border-white/[0.06]">
                          <th className="px-4 py-2.5 text-left font-semibold">Provider</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Requests</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Prompt Tok</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Completion Tok</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Total Tok</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Cost</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Success / Fail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data!.summary.map((s) => (
                          <tr
                            key={s.provider}
                            className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-3 text-white font-medium">
                              <span className="mr-1.5">
                                {PROVIDER_ICONS[s.provider] ?? "●"}
                              </span>
                              {s.provider}
                            </td>
                            <td className="px-4 py-3 text-right text-dark-200">{s.requests}</td>
                            <td className="px-4 py-3 text-right text-dark-300">{formatTokens(s.promptTokens)}</td>
                            <td className="px-4 py-3 text-right text-dark-300">{formatTokens(s.completionTokens)}</td>
                            <td className="px-4 py-3 text-right text-white font-medium">{formatTokens(s.totalTokens)}</td>
                            <td className="px-4 py-3 text-right text-emerald-400">{formatCost(s.costUsd)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-emerald-400">{s.successCount}</span>
                              <span className="text-dark-600"> / </span>
                              <span className={cn(s.failureCount > 0 && "text-red-400")}>{s.failureCount}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <h2 className="text-sm font-bold text-white">Recent Requests</h2>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {data!.recent.slice(0, 20).map((r, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            r.success ? "bg-emerald-400" : "bg-red-400",
                          )}
                        />
                        <span className="text-dark-500 w-20 shrink-0">
                          {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="text-white font-medium w-20 shrink-0">
                          {PROVIDER_ICONS[r.provider] ?? "●"} {r.provider}
                        </span>
                        <span className="text-dark-300 flex-1 truncate">{r.model}</span>
                        {r.category && (
                          <span className="text-brand-400/70 text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 shrink-0">
                            {r.category}
                          </span>
                        )}
                        <span className="text-dark-400 w-16 text-right shrink-0">
                          {formatTokens(r.totalTokens)} tok
                        </span>
                        <span className="text-dark-500 w-14 text-right shrink-0">
                          {r.latencyMs}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
