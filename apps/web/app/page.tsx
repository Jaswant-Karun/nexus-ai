"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ZapIcon, BotIcon, BrainIcon, ZapIcon as WorkflowIcon, ShieldIcon, BarChart3Icon } from "@/components/ui/Icons";

/* ── Animated counter ─────────────────────────────────────────── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 24);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

/* ── Floating particle ─────────────────────────────────────────── */
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div className="pointer-events-none absolute h-1 w-1 rounded-full bg-brand-500/40 animate-particle" style={style} />
  );
}

/* ── Navbar ────────────────────────────────────────────────────── */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/30" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <ZapIcon size={16} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">NEXUS</span>
            <span className="text-brand-400"> AI</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Platform", "Pricing", "Docs"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-dark-300 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="hidden sm:block text-sm font-medium text-dark-300 hover:text-white transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/login"
            className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
            Get Started
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(98,114,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(98,114,245,0.04) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-brand-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 h-96 w-96 rounded-full bg-cyan-600/8 blur-3xl" />

      {/* Floating particles */}
      {[
        { left: "10%", top: "20%", animationDelay: "0s" },
        { left: "20%", top: "60%", animationDelay: "2s" },
        { left: "80%", top: "15%", animationDelay: "4s" },
        { left: "85%", top: "65%", animationDelay: "1s" },
        { left: "50%", top: "80%", animationDelay: "3s" },
      ].map((p, i) => <Particle key={i} style={p} />)}

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
          Enterprise AI Platform · v1.0
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
          <span className="text-white">The Future of</span>
          <br />
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Intelligent Work
          </span>
        </h1>

        <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed mb-12">
          NEXUS AI brings autonomous agents, memory-powered knowledge search,
          visual workflow automation, and intelligent file management into one
          unified enterprise platform.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/login"
            className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand-600/35 transition-all hover:-translate-y-1 active:translate-y-0">
            Get Started Free
            <svg className="transition-transform group-hover:translate-x-1" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/login"
            className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 active:translate-y-0">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
            Watch Demo
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-dark-400">
          {["No credit card required", "14-day free trial", "SOC 2 certified", "99.99% uptime SLA"].map((item, i) => (
            <span key={item} className="flex items-center gap-1.5">
              {i > 0 && <span className="hidden sm:block h-1 w-1 rounded-full bg-dark-600" />}
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="text-brand-500">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  );
}

/* ── Stats ─────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section className="py-16 border-y border-white/[0.05]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 500, suffix: "+",  label: "Enterprise Teams",       color: "text-brand-400" },
            { value: 4800000, suffix: "", label: "Vector Embeddings",    color: "text-purple-400" },
            { value: 99.99, suffix: "%", label: "Platform Uptime",       color: "text-emerald-400" },
            { value: 142000, suffix: "+", label: "Workflow Executions",  color: "text-cyan-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-4xl font-extrabold tracking-tight ${s.color}`}>
                <Counter end={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-sm text-dark-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ──────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <BotIcon size={24} />,
    title: "Autonomous AI Agents",
    description: "Deploy specialised agents with tool execution, adaptive memory recall, and dynamic prompt tuning across GPT-4o, Claude, Gemini, and local LLMs.",
    badge: "Core",
    color: "from-brand-500/15 to-brand-700/5 border-brand-500/20 hover:border-brand-500/40",
    iconBg: "bg-brand-500/15 text-brand-400",
  },
  {
    icon: <WorkflowIcon size={24} />,
    title: "Visual Workflow Builder",
    description: "Build drag-and-drop multi-node pipelines to automate webhooks, data ingestion, and multi-agent collaboration — zero code needed.",
    badge: "No-code",
    color: "from-purple-500/15 to-purple-700/5 border-purple-500/20 hover:border-purple-500/40",
    iconBg: "bg-purple-500/15 text-purple-400",
  },
  {
    icon: <BrainIcon size={24} />,
    title: "Adaptive Memory Engine",
    description: "Sub-millisecond hybrid vector retrieval combining BM25 + Qdrant dense embeddings for context-grounded, always-accurate AI responses.",
    badge: "RAG",
    color: "from-cyan-500/15 to-cyan-700/5 border-cyan-500/20 hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/15 text-cyan-400",
  },
  {
    icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
    title: "Intelligent Storage",
    description: "Every uploaded file is automatically scanned, encrypted, text-extracted, summarised by AI, embedded, and made searchable — all in one pipeline.",
    badge: "AI-powered",
    color: "from-emerald-500/15 to-emerald-700/5 border-emerald-500/20 hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: <ShieldIcon size={24} />,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. AES-256 encryption at rest, TLS 1.3 in transit, RBAC, SSO/SAML 2.0, audit trails, and GDPR compliance mode.",
    color: "from-rose-500/15 to-rose-700/5 border-rose-500/20 hover:border-rose-500/40",
    iconBg: "bg-rose-500/15 text-rose-400",
  },
  {
    icon: <BarChart3Icon size={24} />,
    title: "Real-time Analytics",
    description: "Live dashboards for agent performance, workflow throughput, cost per request, storage growth, and knowledge retrieval accuracy.",
    color: "from-amber-500/15 to-amber-700/5 border-amber-500/20 hover:border-amber-500/40",
    iconBg: "bg-amber-500/15 text-amber-400",
  },
];

function Features() {
  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Everything in one platform</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Built for intelligent enterprises
          </h2>
          <p className="mt-4 text-dark-300 max-w-xl mx-auto leading-relaxed">
            From autonomous agents to workflow orchestration and knowledge retrieval —
            NEXUS AI provides every layer of the modern AI stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title}
              className={`group relative rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${f.color}`}>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg} transition-transform group-hover:scale-110`}>
                {f.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                {f.badge && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {f.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-dark-300 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Platform preview ──────────────────────────────────────────── */
function PlatformPreview() {
  const pages = [
    { label: "AI Agents",        icon: "🤖", color: "bg-brand-600",   href: "/chat" },
    { label: "Workflows",        icon: "⚡", color: "bg-purple-600",  href: "/workflow" },
    { label: "Knowledge Base",   icon: "🧠", color: "bg-cyan-600",    href: "/workspace" },
    { label: "Smart Storage",    icon: "☁️", color: "bg-emerald-600", href: "/storage" },
    { label: "Analytics",        icon: "📊", color: "bg-amber-600",   href: "/analytics" },
    { label: "Settings",         icon: "⚙️", color: "bg-dark-600",    href: "/settings" },
  ];

  return (
    <section id="platform" className="py-28 bg-dark-900/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">Full platform tour</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            One platform. Every use case.
          </h2>
        </div>

        {/* Mock browser window */}
        <div className="rounded-2xl border border-white/[0.08] bg-dark-900/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-dark-800/60">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 max-w-sm mx-auto">
              <div className="flex items-center gap-2 rounded-lg bg-dark-700/80 px-3 py-1.5">
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-dark-400">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                <span className="text-xs text-dark-400 font-mono">nexus.ai/dashboard</span>
              </div>
            </div>
          </div>

          {/* App layout preview */}
          <div className="flex h-96">
            {/* Sidebar */}
            <div className="w-52 shrink-0 border-r border-white/[0.06] bg-dark-900/90 p-3 space-y-1">
              <div className="flex items-center gap-2.5 px-3 py-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <ZapIcon size={13} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">NEXUS AI</span>
              </div>
              {pages.map((p) => (
                <div key={p.label} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-dark-300 hover:bg-white/5 transition-colors cursor-default">
                  <span className="text-base">{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </div>

            {/* Main area */}
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-48 rounded-lg bg-white/10 mb-2" />
                  <div className="h-3 w-64 rounded-lg bg-white/5" />
                </div>
                <div className="h-8 w-28 rounded-xl bg-brand-600/40" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["brand", "purple", "cyan", "emerald"].map((c) => (
                  <div key={c} className={`h-20 rounded-xl bg-${c}-500/10 border border-${c}-500/20`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
                ))}
              </div>
              <div className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ─────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-600/20 via-dark-800/80 to-purple-600/15 px-8 py-20 text-center">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-brand-600/5 to-transparent" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4">Start building today</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ready to transform<br />your enterprise with AI?
          </h2>
          <p className="text-dark-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Join 500+ teams using NEXUS AI to automate workflows, deploy agents,
            and unlock the full power of their knowledge base.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login"
              className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/35 transition-all hover:-translate-y-1 active:translate-y-0">
              Get Started Free
              <svg className="transition-transform group-hover:translate-x-1" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/25 transition-all hover:-translate-y-1 active:translate-y-0">
              Sign in to your account
            </Link>
          </div>

          <p className="mt-8 text-xs text-dark-500">
            No credit card required · Free 14-day trial · Cancel any time
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
              <ZapIcon size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">NEXUS AI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-dark-500">
            {["Privacy", "Terms", "Security", "Status", "Docs"].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <p className="text-xs text-dark-600">© 2026 Nexus AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <LandingNav />
      <Hero />
      <Stats />
      <Features />
      <PlatformPreview />
      <CTABanner />
      <Footer />
    </div>
  );
}
