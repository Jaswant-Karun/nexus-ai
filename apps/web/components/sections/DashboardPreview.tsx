"use client";

import {
  LayoutDashboardIcon,
  FolderOpenIcon,
  MessageSquareIcon,
  GitBranchIcon,
  BarChart3Icon,
  BrainIcon,
  SettingsIcon,
  ZapIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  PlayIcon,
} from "@/components/ui/Icons";

const sidebarItems = [
  { Icon: LayoutDashboardIcon, label: "Dashboard", active: true },
  { Icon: FolderOpenIcon, label: "Projects" },
  { Icon: MessageSquareIcon, label: "AI Chat" },
  { Icon: GitBranchIcon, label: "Workflows" },
  { Icon: BarChart3Icon, label: "Analytics" },
  { Icon: BrainIcon, label: "Memory" },
  { Icon: SettingsIcon, label: "Settings" },
];

const recentProjects = [
  { name: "Customer Support Bot", status: "Running", statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400", agents: 3 },
  { name: "Research Assistant", status: "Idle", statusColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400", agents: 2 },
  { name: "Data Analyzer Pipeline", status: "Running", statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400", agents: 5 },
  { name: "Report Generator", status: "Draft", statusColor: "text-dark-400 bg-white/5 border-white/10", dot: "bg-dark-500", agents: 1 },
];

const quickActions = [
  { Icon: PlayIcon, label: "New Agent", color: "text-brand-400 bg-brand-500/10 border-brand-500/20" },
  { Icon: GitBranchIcon, label: "New Workflow", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { Icon: MessageSquareIcon, label: "Open Chat", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { Icon: BarChart3Icon, label: "Analytics", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
];

const aiUsage = [
  { model: "GPT-4o", pct: 45, color: "bg-brand-500" },
  { model: "Claude 3.5", pct: 30, color: "bg-purple-500" },
  { model: "Gemini", pct: 15, color: "bg-emerald-500" },
  { model: "Others", pct: 10, color: "bg-orange-500" },
];

const chartBars = [60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88, 72];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative bg-dark-900 section-padding overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 rounded-full bg-brand-600/5 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
            Platform Preview
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Your AI command{" "}
            <span className="text-gradient">center</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-dark-400 md:text-lg">
            A unified workspace to manage agents, monitor performance, and build workflows — all in one place.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative rounded-2xl border border-white/10 bg-dark-950/80 shadow-2xl shadow-black/60 overflow-hidden glow">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-dark-800/80 px-5 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <div className="ml-4 flex-1 max-w-xs rounded-md bg-dark-700/60 px-3 py-1 text-[11px] text-dark-400">
              app.nexus-ai.com/dashboard
            </div>
          </div>

          {/* App layout */}
          <div className="flex h-[580px] md:h-[620px]">
            {/* Sidebar */}
            <aside className="flex flex-col w-52 shrink-0 border-r border-white/[0.06] bg-dark-900/60 p-4">
              <div className="mb-6 flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-600/40">
                  <ZapIcon size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">Nexus AI</span>
              </div>

              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => {
                  const { Icon } = item;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                        item.active
                          ? "bg-brand-600/20 text-brand-300 border border-brand-600/20"
                          : "text-dark-400 hover:text-dark-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon size={14} />
                      {item.label}
                      {item.active && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="mt-auto flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-500" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-white truncate">Jaswant K.</p>
                  <p className="text-[10px] text-dark-500 truncate">Pro Plan</p>
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Dashboard</h3>
                  <p className="text-xs text-dark-500">Good morning — 4 agents active</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                    <CheckCircle2Icon size={12} className="text-emerald-400" />
                    <span className="text-[11px] text-dark-400">All systems operational</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "AI Requests", value: "48.2K", change: "+12%", up: true },
                  { label: "Active Agents", value: "4", change: "3 running", up: true },
                  { label: "Memory Stored", value: "2.4GB", change: "+340MB", up: true },
                  { label: "Cost Today", value: "$4.20", change: "-8%", up: false },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-dark-800/40 px-3 py-2.5">
                    <p className="text-[10px] text-dark-500 mb-1">{s.label}</p>
                    <p className="text-base font-bold text-white">{s.value}</p>
                    <p className={`text-[10px] ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Charts + quick actions */}
              <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
                {/* Chart */}
                <div className="col-span-2 rounded-xl border border-white/[0.06] bg-dark-800/40 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-medium text-white">AI Requests — Last 12h</p>
                    <ArrowUpRightIcon size={14} className="text-brand-400" />
                  </div>
                  <div className="flex-1 flex items-end gap-1.5 pb-1">
                    {chartBars.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-brand-600/60 to-brand-400/40"
                        style={{ height: `${v}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["12h", "9h", "6h", "3h", "now"].map((t) => (
                      <span key={t} className="text-[9px] text-dark-600">{t}</span>
                    ))}
                  </div>
                </div>

                {/* AI Usage */}
                <div className="rounded-xl border border-white/[0.06] bg-dark-800/40 p-4 flex flex-col gap-3">
                  <p className="text-xs font-medium text-white">AI Usage</p>
                  {aiUsage.map((m) => (
                    <div key={m.model}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-dark-400">{m.model}</span>
                        <span className="text-white">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Recent projects */}
                <div className="col-span-2 rounded-xl border border-white/[0.06] bg-dark-800/40 p-3">
                  <p className="text-xs font-medium text-white mb-2">Recent Projects</p>
                  <div className="space-y-1.5">
                    {recentProjects.map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                          <span className="text-[11px] text-dark-300">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-dark-500">{p.agents} agents</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${p.statusColor}`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border border-white/[0.06] bg-dark-800/40 p-3">
                  <p className="text-xs font-medium text-white mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActions.map((a) => {
                      const { Icon } = a;
                      return (
                        <div key={a.label} className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 cursor-pointer ${a.color}`}>
                          <Icon size={14} />
                          <span className="text-[9px] font-medium text-center leading-tight">{a.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-dark-500">
          A live interactive demo — no signup required.{" "}
          <span className="text-brand-400 cursor-pointer hover:underline">Try it now →</span>
        </p>
      </div>
    </section>
  );
}
