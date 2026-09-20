"use client";

import { useState } from "react";
import { NavBar, Sidebar } from "@nexus/ui";
import { StatusBadge } from "@/components/common/StatusBadge";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",   href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder",  href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine",  href: "/workspace", icon: "🧠" },
  { id: "settings",  label: "Platform Settings", href: "/settings",  icon: "⚙️" },
];

type NKind = "agent" | "workflow" | "system" | "billing";

interface Notif {
  id: string;
  kind: NKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const initial: Notif[] = [
  { id: "1", kind: "agent",    title: "Agent execution completed",     body: "Data Analyst Agent finished processing 1,240 records with 99.4% accuracy.",       read: false, createdAt: "2026-07-29T21:50:00Z" },
  { id: "2", kind: "workflow", title: "Workflow deployment successful", body: "CRM Sync Pipeline v2.3 was deployed to production and is now running.",           read: false, createdAt: "2026-07-29T21:30:00Z" },
  { id: "3", kind: "system",   title: "System health check passed",    body: "All 14 agents and 6 vector index clusters are operating within normal thresholds.", read: true,  createdAt: "2026-07-29T20:00:00Z" },
  { id: "4", kind: "billing",  title: "Invoice generated",             body: "Invoice INV-2026-07 for $1,240.00 has been issued for the current billing cycle.",  read: true,  createdAt: "2026-07-29T09:00:00Z" },
  { id: "5", kind: "agent",    title: "Agent error detected",          body: "Fraud Detection Agent encountered an API timeout. Retrying with fallback model.",   read: false, createdAt: "2026-07-28T18:45:00Z" },
  { id: "6", kind: "workflow", title: "Workflow paused by rule",       body: "Lead Qualification Workflow was paused due to rate-limit threshold being reached.",  read: true,  createdAt: "2026-07-27T14:20:00Z" },
];

const kindEmoji: Record<NKind, string> = {
  agent:    "🤖",
  workflow: "⚡",
  system:   "🖥️",
  billing:  "💳",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAll = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) => setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/notifications"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Notifications</h1>
              <p className="text-gray-400 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-gray-900 border border-white/[0.06] p-1 gap-1">
                {(["all", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      filter === f ? "bg-brand-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gray-900/40 py-16 text-center">
                <p className="text-4xl mb-4">🔔</p>
                <p className="text-white font-semibold">No unread notifications</p>
                <p className="text-gray-400 text-sm mt-1">You're all up to date.</p>
              </div>
            ) : (
              visible.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markOne(n.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${
                    n.read
                      ? "border-white/[0.04] bg-gray-900/30 hover:bg-gray-900/50"
                      : "border-brand-500/20 bg-brand-500/5 hover:bg-brand-500/10"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl">
                    {kindEmoji[n.kind]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{n.body}</p>
                    <p className="mt-1.5 text-[10px] text-gray-500">
                      {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <StatusBadge status="active" label={n.kind} className="shrink-0 capitalize" />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
