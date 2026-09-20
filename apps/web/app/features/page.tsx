"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";

const FEATURES = [
  {
    icon: "⚡",
    title: "Multi-Agent Orchestration",
    desc: "Chain heterogeneous AI agents (GPT-4o, Claude 3.5, Gemini, Groq) into visual DAG execution pipelines.",
    badge: "Core Engine",
  },
  {
    icon: "🧠",
    title: "Autonomous Knowledge Graph",
    desc: "Graph-structured memory that automatically links documents, entities, decisions, and temporal updates.",
    badge: "Memory",
  },
  {
    icon: "☁️",
    title: "NexusStorage & Vector DB",
    desc: "Unified hybrid storage indexing PDFs, datasets, multimedia, and raw PgVector embeddings with 2.0 GB quota.",
    badge: "Storage",
  },
  {
    icon: "🛡️",
    title: "Enterprise Security & RBAC",
    desc: "Cryptographic SHA-256 tamper verification, audit logging, zero-trust token isolation, and data governance.",
    badge: "Security",
  },
  {
    icon: "📈",
    title: "Real-time Telemetry & Analytics",
    desc: "Fine-grained token counting, latency metrics, execution benchmarks, and cost projection dashboards.",
    badge: "Analytics",
  },
  {
    icon: "🔌",
    title: "n8n & Webhook Integrations",
    desc: "Bidirectional automation webhooks connecting Slack, GitHub, Jira, PostgreSQL, and CRM pipelines.",
    badge: "Integrations",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-brand-500/15 text-brand-400 text-xs font-bold border border-brand-500/30 uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Next-Gen Autonomous AI Systems
          </h1>
          <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
            Explore the comprehensive suite of multi-agent engines, knowledge reasoning, and enterprise storage built into NEXUS AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 space-y-4 hover:border-brand-500/40 hover:bg-dark-800/60 transition-all shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 px-2 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20">
                  {f.badge}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-dark-300 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-900/30 via-dark-900 to-purple-900/30 p-8 sm:p-12 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to deploy autonomous AI agents?
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 max-w-xl mx-auto">
            Get started with NEXUS AI in seconds. Model multi-agent pipelines with visual diagrams and distributed intelligence.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="rounded-xl bg-brand-600 hover:bg-brand-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-all"
            >
              Launch Dashboard →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
