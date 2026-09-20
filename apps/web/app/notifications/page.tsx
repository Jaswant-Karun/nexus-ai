"use client";

import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { cn } from "@/lib/utils";

type NKind = "agent" | "workflow" | "system" | "billing";
interface Notif {
  id: string; kind: NKind; title: string; body: string; read: boolean; createdAt: string;
}

const kindEmoji: Record<NKind, string> = {
  agent: "🤖", workflow: "⚡", system: "🖥️", billing: "💳",
};

function relativeTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"all" | "unread">("all");

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: Notif[] }) => {
        if (d.success && d.data) setNotifs(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible     = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAll = async () => {
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read-all" }),
    }).catch(() => {});
  };

  const markOne = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Notifications</h1>
              <p className="text-gray-400 mt-1">
                {loading ? "Loading…" : unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-gray-900 border border-white/[0.06] p-1 gap-1">
                {(["all", "unread"] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      filter === f ? "bg-brand-600 text-white" : "text-gray-400 hover:text-white"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button type="button" onClick={markAll}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.04] bg-gray-900/30 px-5 py-4 animate-pulse h-20" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gray-900/40 py-16 text-center">
              <p className="text-4xl mb-4">🔔</p>
              <p className="text-white font-semibold">No {filter === "unread" ? "unread " : ""}notifications</p>
              <p className="text-gray-400 text-sm mt-1">You&apos;re all up to date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((n) => (
                <div key={n.id} onClick={() => markOne(n.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${
                    n.read
                      ? "border-white/[0.04] bg-gray-900/30 hover:bg-gray-900/50"
                      : "border-brand-500/20 bg-brand-500/5 hover:bg-brand-500/10"
                  }`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl">
                    {kindEmoji[n.kind] ?? "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{n.body}</p>
                    <p className="mt-1.5 text-[10px] text-gray-500">{relativeTime(n.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                    n.kind === "agent"    ? "bg-brand-500/10 text-brand-400 border-brand-500/20" :
                    n.kind === "workflow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    n.kind === "billing"  ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {n.kind}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
