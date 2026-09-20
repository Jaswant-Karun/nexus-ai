"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CyberLayout } from "@/components/cyber/CyberLayout";
import { UserCard }    from "@/components/cyber/UserCard";
import { useAuth }     from "@/hooks/useAuth";
import { cn }          from "@/lib/utils";

interface DashboardStats {
  activeAgents: number;
  totalAgents: number;
  activeWorkflows: number;
  totalConversations: number;
  knowledgeDocs: number;
  storageFiles: number;
  storageSizeGB: number;
  aiJobsDone: number;
  recentAgents: { id: string; name: string; status: string; model: string; conversations: number }[];
}

/* ── Stat card ─────────────────────────────────────────────── */
function StatTile({ label, value, sub, color = "#e91e8c" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="cyber-card cyber-corners p-5 flex flex-col gap-1">
      <p className="font-cyber text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#666" }}>{label}</p>
      <p className="font-cyber text-3xl font-black text-white" style={{ textShadow: `0 0 20px ${color}66` }}>
        {value}
      </p>
      {sub && <p className="font-mono text-[10px]" style={{ color: "#555" }}>{sub}</p>}
    </div>
  );
}

/* ── Quick action link ─────────────────────────────────────── */
function QuickLink({ icon, label, href, color }: { icon: string; label: string; href: string; color: string }) {
  return (
    <Link href={href}
      className="cyber-card p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 cursor-pointer"
      style={{ "--hover-border": color } as React.CSSProperties}>
      <span className="text-2xl">{icon}</span>
      <span className="font-cyber text-[9px] font-bold tracking-widest uppercase" style={{ color }}>{label}</span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"PROFILE" | "AGENTS" | "ACTIVITY">("PROFILE");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: DashboardStats }) => {
        if (d.success && d.data) setStats(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const userName = user?.name ?? "NEXUS USER";
  const userId   = user?.id?.slice(-8).toUpperCase() ?? "NEXUS001";
  const userPlan = user?.organization?.plan ?? "FREE";

  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "#39ff14",
    PAUSED: "#f5e642",
    DRAFT:  "#555",
  };

  return (
    <CyberLayout>
      {/* ── 3-column layout exactly like INFINITUM ── */}
      <div className="flex gap-5 items-start">

        {/* LEFT — User profile card */}
        <UserCard
          name={userName}
          userId={userId}
          plan={userPlan}
          email={user?.email}
          level="LEVEL 2"
          rank="PRISM"
        />

        {/* CENTRE — Main content panel */}
        <div className="flex-1 min-w-0">
          {/* Tabs (PROFILE / AGENTS / ACTIVITY) */}
          <div className="flex items-center border-b border-neon-pink/15 mb-5">
            {(["PROFILE", "AGENTS", "ACTIVITY"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={cn("cyber-tab", tab === t && "active")}>
                {t}
              </button>
            ))}
          </div>

          {/* ── PROFILE tab ──────────────────────────────── */}
          {tab === "PROFILE" && (
            <div className="space-y-5">
              {/* PROFILE DETAILS heading */}
              <div className="flex items-center justify-between">
                <h2 className="cyber-heading text-sm">Profile Details</h2>
                <Link href="/profile">
                  <button type="button" className="cyber-btn text-[9px]">Edit Profile</button>
                </Link>
              </div>

              {/* Details grid */}
              {authLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-2 w-16 bg-cyber-gray/40 rounded animate-pulse" />
                      <div className="h-4 w-28 bg-cyber-gray/30 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : user ? (
                <div className="cyber-card p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: "Full Name",     value: user.name  },
                      { label: "Email",         value: user.email },
                      { label: "Role",          value: user.role  },
                      { label: "Organization",  value: user.organization?.name ?? "—" },
                      { label: "Plan",          value: user.organization?.plan ?? "—" },
                      { label: "User ID",       value: user.id?.slice(0, 16) + "…" },
                    ].map((f) => (
                      <div key={f.label} className="cyber-field">
                        <label>{f.label}</label>
                        <p>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="cyber-card p-5">
                  <p className="font-cyber text-xs text-cyber-text-dim tracking-widest">
                    — Not authenticated —
                  </p>
                </div>
              )}

              {/* KPI Stats */}
              <h2 className="cyber-heading text-sm">Platform Stats</h2>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="cyber-card p-5 animate-pulse h-24" />
                  ))}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatTile label="Active Agents"     value={stats.activeAgents}     sub={`${stats.totalAgents} total`}      color="#e91e8c" />
                  <StatTile label="Workflows"         value={stats.activeWorkflows}   sub="pipelines"                         color="#f5e642" />
                  <StatTile label="Conversations"     value={stats.totalConversations} sub="chat sessions"                    color="#00ffff" />
                  <StatTile label="AI Jobs Done"      value={stats.aiJobsDone}        sub="OCR + embed + summary"             color="#39ff14" />
                </div>
              ) : (
                <div className="cyber-card p-4 font-cyber text-[10px] text-neon-pink tracking-widest uppercase">
                  ⚠ Database unreachable — check PostgreSQL on localhost:5432
                </div>
              )}

              {/* Quick links */}
              <h2 className="cyber-heading text-sm">Quick Access</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <QuickLink icon="🤖" label="Agents"    href="/chat"           color="#e91e8c" />
                <QuickLink icon="⚡" label="Workflows" href="/workflow"       color="#f5e642" />
                <QuickLink icon="🧠" label="Knowledge" href="/workspace"     color="#00ffff" />
                <QuickLink icon="☁️" label="Storage"   href="/storage"       color="#39ff14" />
                <QuickLink icon="📊" label="Analytics" href="/analytics"     color="#9d00ff" />
                <QuickLink icon="⚙️" label="Settings"  href="/settings"      color="#888" />
              </div>
            </div>
          )}

          {/* ── AGENTS tab ───────────────────────────────── */}
          {tab === "AGENTS" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="cyber-heading text-sm">Deployed AI Agents</h2>
                <Link href="/chat">
                  <button type="button" className="cyber-btn text-[9px]">+ New Agent</button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="cyber-card p-4 h-14 animate-pulse" />
                  ))}
                </div>
              ) : stats?.recentAgents.length ? (
                <div className="cyber-card overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_120px_80px_80px] gap-4 px-5 py-3 border-b border-neon-pink/10">
                    {["Agent Name","Model","Status","Sessions"].map((h) => (
                      <span key={h} className="font-cyber text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "#666" }}>
                        {h}
                      </span>
                    ))}
                  </div>
                  {stats.recentAgents.map((agent) => (
                    <div key={agent.id}
                      className="grid grid-cols-[1fr_120px_80px_80px] items-center gap-4 px-5 py-3.5 border-b border-neon-pink/5 last:border-0 hover:bg-neon-pink/[0.03] transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full text-xs"
                          style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.3)" }}>
                          🤖
                        </div>
                        <span className="font-mono text-xs text-white truncate">{agent.name}</span>
                      </div>
                      <span className="font-mono text-[10px] truncate"
                        style={{ color: "#666", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 6px" }}>
                        {agent.model}
                      </span>
                      <span className="font-cyber text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: STATUS_COLOR[agent.status] ?? "#555", textShadow: `0 0 6px ${STATUS_COLOR[agent.status] ?? "#555"}66` }}>
                        {agent.status}
                      </span>
                      <span className="font-mono text-xs" style={{ color: "#888" }}>{agent.conversations}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cyber-card p-6 text-center">
                  <p className="font-cyber text-xs tracking-widest uppercase text-cyber-text-dim">
                    No agents deployed yet
                  </p>
                  <Link href="/chat">
                    <button type="button" className="cyber-btn-filled text-[9px] mt-4 px-5 py-2">
                      Deploy First Agent
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVITY tab ─────────────────────────────── */}
          {tab === "ACTIVITY" && (
            <div className="space-y-5">
              <h2 className="cyber-heading text-sm">Recent Activity</h2>
              <div className="cyber-card divide-y divide-neon-pink/5">
                {[
                  { icon: "🤖", text: "Data Analyst Agent processed 1,240 records", time: "2 min ago",  color: "#e91e8c" },
                  { icon: "⚡", text: "Document Intelligence Pipeline executed",     time: "15 min ago", color: "#f5e642" },
                  { icon: "☁️", text: "8 files uploaded and AI-processed",           time: "1 hr ago",  color: "#39ff14" },
                  { icon: "🧠", text: "6 knowledge documents indexed (1,420 chunks)", time: "2 hr ago", color: "#00ffff" },
                  { icon: "🔐", text: "Login from admin@nexus.ai",                   time: "3 hr ago",  color: "#888" },
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-neon-pink/[0.02] transition-colors">
                    <div className="h-8 w-8 shrink-0 flex items-center justify-center text-base rounded-full"
                      style={{ background: `${ev.color}12`, border: `1px solid ${ev.color}25` }}>
                      {ev.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-white leading-relaxed">{ev.text}</p>
                    </div>
                    <span className="font-cyber text-[9px] tracking-widest shrink-0" style={{ color: "#444" }}>
                      {ev.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — small info panel */}
        <div className="w-56 shrink-0 space-y-4">
          {/* DB Status */}
          <div className="cyber-card cyber-corners p-4">
            <p className="font-cyber text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#666" }}>
              Database
            </p>
            <div className="space-y-2">
              {loading ? (
                <div className="h-3 w-full bg-cyber-gray/30 rounded animate-pulse" />
              ) : stats ? (
                <>
                  {[
                    { label: "Agents",      val: stats.totalAgents },
                    { label: "Workflows",   val: stats.activeWorkflows },
                    { label: "Docs",        val: stats.knowledgeDocs },
                    { label: "Files",       val: stats.storageFiles },
                    { label: "Storage",     val: `${stats.storageSizeGB} GB` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="font-cyber text-[9px] tracking-widest uppercase" style={{ color: "#555" }}>
                        {row.label}
                      </span>
                      <span className="font-mono text-xs text-white">{row.val}</span>
                    </div>
                  ))}
                  <div className="neon-line mt-2" />
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-green" style={{ boxShadow: "0 0 4px rgba(57,255,20,0.8)" }} />
                    <span className="font-cyber text-[8px] tracking-widest uppercase" style={{ color: "#39ff14" }}>
                      PostgreSQL Live
                    </span>
                  </div>
                </>
              ) : (
                <p className="font-cyber text-[9px] tracking-widest uppercase" style={{ color: "#e91e8c" }}>
                  ⚠ Offline
                </p>
              )}
            </div>
          </div>

          {/* Platform links */}
          <div className="cyber-card p-4 space-y-2">
            <p className="font-cyber text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#666" }}>
              Platform
            </p>
            {[
              { label: "AI Agent Studio",  href: "/chat",      color: "#e91e8c" },
              { label: "Workflow Builder", href: "/workflow",  color: "#f5e642" },
              { label: "Smart Storage",    href: "/storage",   color: "#39ff14" },
              { label: "Knowledge Base",   href: "/workspace", color: "#00ffff" },
              { label: "Settings",         href: "/settings",  color: "#888" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 py-1.5 hover:translate-x-0.5 transition-transform group">
                <svg width={5} height={5} viewBox="0 0 10 10">
                  <polygon points="0,0 10,5 0,10" fill={link.color}/>
                </svg>
                <span className="font-cyber text-[9px] font-bold tracking-widest uppercase"
                  style={{ color: "#666" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = link.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CyberLayout>
  );
}
