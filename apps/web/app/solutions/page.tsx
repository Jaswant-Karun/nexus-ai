"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";

const SOLUTIONS = [
  {
    title: "Autonomous Customer Support Operations",
    role: "Support & Success",
    icon: "🎧",
    desc: "Route incoming user tickets, perform sentiment triage, cross-reference knowledge documents, and draft responses.",
    tags: ["Ticket Triage", "Groq Llama-3", "Knowledge Base"],
  },
  {
    title: "Financial Fraud & Compliance Auditing",
    role: "Fintech & Banking",
    icon: "💳",
    desc: "Scan high-volume transactions in milliseconds, analyze risk indicators, and trigger automated quarantine procedures.",
    tags: ["Real-time", "Risk Scoring", "Audit Trail"],
  },
  {
    title: "E-Commerce & Food Fulfillment Logistics",
    role: "Logistics & Delivery",
    icon: "🛵",
    desc: "Multi-agent dispatch pipeline coordinating kitchen orders, real-time driver telemetry routing, and SMS tracking.",
    tags: ["DAG Pipeline", "n8n Webhook", "Live Telemetry"],
  },
  {
    title: "Enterprise Legal & Contract Analysis",
    role: "Legal & Corporate",
    icon: "⚖️",
    desc: "Parse 500+ page contracts, extract risk liability clauses, compare revisions with semantic diffing, and export executive briefs.",
    tags: ["OCR Extraction", "PgVector", "Summary Engine"],
  },
  {
    title: "Software Engineering & Code Review Agents",
    role: "Developer Teams",
    icon: "💻",
    desc: "Analyze pull requests, identify security vulnerabilities, run unit tests, and recommend performance optimizations.",
    tags: ["Code Interpreter", "Linting", "Security Auditing"],
  },
  {
    title: "Healthcare Clinical Research & Trials",
    role: "Biotech & Healthcare",
    icon: "🧬",
    desc: "Synthesize PubMed studies, match clinical trial criteria, and structure patient cohorts with high precision.",
    tags: ["HIPAA Compliant", "Research Agent", "Data Extraction"],
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
            Industry Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tailored Multi-Agent Architectures
          </h1>
          <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
            Discover how global teams deploy NEXUS AI agents across operations, finance, logistics, legal, and software development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 space-y-4 hover:border-brand-500/40 hover:bg-dark-800/60 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <span className="text-[10px] font-mono text-dark-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {s.role}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-dark-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
