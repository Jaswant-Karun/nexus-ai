"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
            About NEXUS AI
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Pioneering Distributed Autonomous Intelligence
          </h1>
          <p className="text-dark-300 text-sm sm:text-base">
            We build the foundational multi-agent operating system for the next century of software.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-8 space-y-6 text-sm text-dark-200 leading-relaxed shadow-xl">
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p>
            NEXUS AI was engineered to bridge the gap between single-prompt LLMs and production-grade autonomous operations. By combining event-driven DAG orchestration, multi-modal storage, knowledge graph retrieval, and continuous agent feedback loops, we empower engineering and business teams to deploy collaborative digital workforces.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-2xl font-extrabold text-white block">10M+</span>
              <span className="text-xs text-dark-400">Tokens Processed Daily</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-2xl font-extrabold text-brand-400 block">99.98%</span>
              <span className="text-xs text-dark-400">Pipeline Execution Reliability</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-2xl font-extrabold text-emerald-400 block">50+</span>
              <span className="text-xs text-dark-400">Native Integrations & Tools</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
