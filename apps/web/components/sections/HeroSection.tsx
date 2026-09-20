import Link from "next/link";
import { ArrowRightIcon, ZapIcon } from "@/components/ui/Icons";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 bg-hero-gradient">
      {/* ambient glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-400 mb-8 animate-fade-in">
          <ZapIcon size={12} /> Enterprise Adaptive Intelligence Platform
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight leading-tight md:text-7xl animate-fade-in-up">
          <span className="text-white">Orchestrate AI Agents,</span>{" "}
          <span className="text-gradient">Memory & Workflows</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-dark-300 leading-relaxed animate-fade-in-up animation-delay-200">
          NEXUS AI unites multi-model LLM orchestration, hybrid vector search, and visual
          node workflow automation into one unified platform built for the enterprise.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-300">
          <Link href="/dashboard" className="btn-primary text-sm">
            Launch Platform Dashboard <ArrowRightIcon size={14} />
          </Link>
          <Link href="/chat" className="btn-secondary text-sm">
            Explore AI Agent Studio
          </Link>
        </div>

        {/* social proof */}
        <p className="mt-8 text-xs text-dark-400 animate-fade-in animation-delay-500">
          Trusted by 500+ enterprise teams · 4.9★ on G2
        </p>
      </div>
    </section>
  );
}
