"use client";

import {
  BotIcon,
  BrainIcon,
  GitBranchIcon,
  BarChart3Icon,
  SearchIcon,
  ShieldIcon,
  CpuIcon,
  NetworkIcon,
} from "@/components/ui/Icons";

const features = [
  {
    Icon: BotIcon,
    title: "AI Agents",
    description:
      "Create intelligent assistants that automate your work. Deploy agents that reason, plan, and execute tasks autonomously.",
    color: "from-brand-500/20 to-blue-500/20",
    border: "border-brand-500/20 hover:border-brand-500/50",
    iconBg: "bg-brand-500/20",
    iconColor: "text-brand-400",
    badge: "Core",
    badgeColor: "bg-brand-500/20 text-brand-300 border-brand-500/30",
  },
  {
    Icon: BrainIcon,
    title: "Memory Engine",
    description:
      "Long-term AI memory across sessions. Store, retrieve, and reason over knowledge that persists and grows over time.",
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/20 hover:border-purple-500/50",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    badge: "Unique",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    Icon: GitBranchIcon,
    title: "Workflow Builder",
    description:
      "Visual drag-and-drop automation. Chain AI models, APIs, and logic without writing a single line of code.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    badge: "Visual",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    Icon: BarChart3Icon,
    title: "Analytics",
    description:
      "Monitor AI performance in real time. Track usage, latency, costs, and agent behavior across your entire platform.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20 hover:border-orange-500/50",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    badge: "Insights",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    Icon: SearchIcon,
    title: "Knowledge Graph",
    description:
      "Connect documents, data, and context into a structured knowledge base. Enable deep semantic search over your data.",
    color: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    badge: "RAG",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    Icon: CpuIcon,
    title: "Model Router",
    description:
      "Automatically select the best AI model for each task. Balance performance, cost, and speed across 20+ providers.",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/20 hover:border-pink-500/50",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-400",
    badge: "Smart",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
  {
    Icon: NetworkIcon,
    title: "Multi-Agent Orchestration",
    description:
      "Coordinate teams of specialized agents working in parallel. Build complex pipelines with critic, planner, and executor agents.",
    color: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    badge: "Advanced",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
  {
    Icon: ShieldIcon,
    title: "Security & Compliance",
    description:
      "Enterprise-grade security with end-to-end encryption, RBAC, audit logs, and data residency controls built in.",
    color: "from-slate-500/20 to-gray-500/20",
    border: "border-slate-500/20 hover:border-slate-500/50",
    iconBg: "bg-slate-500/20",
    iconColor: "text-slate-400",
    badge: "Enterprise",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-dark-950 section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-600/5 blur-[200px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            One platform.{" "}
            <span className="text-gradient">Infinite possibilities.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-dark-400 md:text-lg">
            From a single agent to a full enterprise AI stack — Nexus AI has every primitive you need to build, deploy, and scale.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const { Icon } = feature;
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border bg-gradient-to-br ${feature.color} ${feature.border} p-6 card-hover cursor-default`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg}`}>
                    <Icon size={20} className={feature.iconColor} />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-dark-400">{feature.description}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-dark-500 group-hover:text-brand-400 transition-colors">
                  Learn more
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
