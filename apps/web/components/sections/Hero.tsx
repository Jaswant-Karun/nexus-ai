"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  BrainIcon,
  ZapIcon,
  BarChart3Icon,
  GitBranchIcon,
} from "@/components/ui/Icons";

/* ── Particle ── */
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute h-1 w-1 rounded-full bg-brand-400/60 animate-particle"
      style={style}
    />
  );
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 15}s`,
  animationDuration: `${12 + Math.random() * 8}s`,
  opacity: Math.random() * 0.6 + 0.2,
  scale: Math.random() * 0.8 + 0.4,
  id: i,
}));

/* ── Floating cards ── */
const floatingCards = [
  {
    Icon: BrainIcon,
    label: "Memory Engine",
    sub: "Long-term context",
    color: "from-purple-500/20 to-brand-600/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    animation: "animate-float-slow",
    position: "top-[15%] -left-4 md:left-8",
  },
  {
    Icon: ZapIcon,
    label: "AI Agent Active",
    sub: "3 tasks running",
    color: "from-brand-500/20 to-cyan-500/20",
    border: "border-brand-500/30",
    iconColor: "text-brand-400",
    animation: "animate-float-medium animation-delay-1000",
    position: "top-[20%] -right-4 md:right-8",
  },
  {
    Icon: BarChart3Icon,
    label: "Analytics",
    sub: "↑ 24% this week",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    animation: "animate-float-fast animation-delay-2000",
    position: "bottom-[20%] -left-4 md:left-12",
  },
  {
    Icon: GitBranchIcon,
    label: "Workflow Built",
    sub: "12 nodes connected",
    color: "from-orange-500/20 to-yellow-500/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    animation: "animate-float-slow animation-delay-3000",
    position: "bottom-[25%] -right-4 md:right-12",
  },
];

const cyclingWords = ["Agents", "Automation", "Knowledge"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            bottom: "-10px",
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            opacity: p.opacity,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl w-full section-padding pt-32">
        <div className="relative flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300 animate-fade-in">
            <SparklesIcon size={12} />
            Universal Adaptive Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
            <span className="text-white">NEXUS </span>
            <span className="text-gradient">AI</span>
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mt-4 text-xl font-light text-dark-300 md:text-2xl">
            Build intelligent workflows,
          </p>

          {/* Cycling words */}
          <div className="animate-fade-in-up animation-delay-300 mt-1 flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-semibold">
            {cyclingWords.map((word, i) => (
              <span
                key={word}
                className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-0.5 text-brand-300"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {word}
              </span>
            ))}
          </div>

          <p className="animate-fade-in-up animation-delay-400 mt-3 max-w-2xl text-base text-dark-400 md:text-lg">
            knowledge systems — all in one platform.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animation-delay-500 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-sm px-7 py-3.5">
              Get Started
              <ArrowRightIcon size={16} />
            </Link>
            <button className="btn-secondary text-sm px-7 py-3.5">
              <PlayIcon size={16} />
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-700 mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { value: "10K+", label: "AI Agents Created" },
              { value: "99.9%", label: "Uptime" },
              { value: "50ms", label: "Avg. Latency" },
              { value: "150+", label: "Integrations" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-dark-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Dashboard mockup with floating cards */}
          <div className="animate-fade-in animation-delay-700 relative mt-20 w-full max-w-5xl">
            {/* Floating cards */}
            {floatingCards.map((card) => {
              const { Icon } = card;
              return (
                <div
                  key={card.label}
                  className={`absolute z-20 hidden sm:flex items-center gap-3 glass rounded-2xl px-4 py-3 shadow-xl ${card.animation} ${card.position}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} border ${card.border}`}
                  >
                    <Icon size={16} className={card.iconColor} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">{card.label}</p>
                    <p className="text-[10px] text-dark-400">{card.sub}</p>
                  </div>
                </div>
              );
            })}

            {/* Main preview frame */}
            <div className="relative rounded-2xl border border-white/10 bg-dark-900/80 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl glow">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-dark-800/60 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="ml-4 flex-1 rounded-md bg-dark-700/60 px-3 py-1 text-[11px] text-dark-400">
                  app.nexus-ai.com/dashboard
                </div>
              </div>

              {/* Dashboard layout */}
              <div className="flex h-80 md:h-[420px]">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-48 border-r border-white/[0.06] bg-dark-900/40 p-4 gap-1">
                  <div className="mb-4 flex items-center gap-2 px-2">
                    <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center">
                      <ZapIcon size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white">Nexus AI</span>
                  </div>
                  {["Dashboard", "Projects", "AI Chat", "Workflows", "Analytics", "Memory", "Settings"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                          i === 0
                            ? "bg-brand-600/20 text-brand-300 border border-brand-600/20"
                            : "text-dark-400"
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-brand-400" : "bg-dark-600"}`} />
                        {item}
                      </div>
                    )
                  )}
                </aside>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-32 rounded bg-white/10 mb-1.5" />
                      <div className="h-2.5 w-48 rounded bg-white/5" />
                    </div>
                    <div className="h-8 w-24 rounded-lg bg-brand-600/30 border border-brand-600/30" />
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { h: "h-16", color: "from-brand-600/30 to-brand-400/10", label: "AI Requests" },
                      { h: "h-16", color: "from-purple-600/30 to-purple-400/10", label: "Memory Hits" },
                      { h: "h-16", color: "from-emerald-600/30 to-emerald-400/10", label: "Workflows" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={`rounded-xl border border-white/[0.06] bg-gradient-to-br ${card.color} p-3`}
                      >
                        <div className="h-2 w-16 rounded bg-white/10 mb-2" />
                        <div className="h-5 w-12 rounded bg-white/20" />
                        <div className={`mt-2 ${card.h} rounded-lg bg-white/5 overflow-hidden flex items-end px-1 pb-1 gap-0.5`}>
                          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((v, j) => (
                            <div
                              key={j}
                              className="flex-1 rounded-sm bg-white/20"
                              style={{ height: `${v}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table row */}
                  <div className="rounded-xl border border-white/[0.06] bg-dark-800/40 p-3">
                    <div className="h-2.5 w-28 rounded bg-white/10 mb-3" />
                    <div className="space-y-2">
                      {[
                        { name: "Research Agent", status: "Running", color: "bg-emerald-400" },
                        { name: "Data Analyzer", status: "Idle", color: "bg-yellow-400" },
                        { name: "Report Builder", status: "Running", color: "bg-emerald-400" },
                      ].map((row) => (
                        <div key={row.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
                            <div className="h-2 w-24 rounded bg-white/10" />
                          </div>
                          <div className="h-5 w-14 rounded-full bg-white/5 border border-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow beneath frame */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-24 w-3/4 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
