"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";

const DOCS_SECTIONS = [
  {
    category: "Getting Started",
    items: [
      { title: "Platform Architecture Overview", desc: "Understanding multi-agent DAG loops, state managers, and workers." },
      { title: "Quickstart Guide", desc: "Deploy your first autonomous pipeline in under 3 minutes." },
      { title: "Authentication & API Keys", desc: "Issuing JWT bearer tokens and service account secrets." },
    ],
  },
  {
    category: "AI Agent Studio",
    items: [
      { title: "Agent Roles & System Prompts", desc: "Configuring specialist personas, tools, and temperature bounds." },
      { title: "Tool Calling & Interop", desc: "Binding Python code interpreters, vector lookups, and web search." },
      { title: "Multi-Model Fallbacks", desc: "Automatic failover between OpenAI, Anthropic, Gemini, and Groq." },
    ],
  },
  {
    category: "Workflow Engine & n8n",
    items: [
      { title: "Visual DAG Designer", desc: "Constructing dependency graphs, conditions, and trigger nodes." },
      { title: "n8n Webhook Integration", desc: "Triggering external n8n workflows and processing async webhooks." },
      { title: "Scheduled Cron Pipelines", desc: "Configuring automated recurring executions and heartbeat monitors." },
    ],
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md">
            Docs & Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            NEXUS AI Developer Documentation
          </h1>
          <p className="text-dark-300 text-xs sm:text-sm mt-1">
            Complete technical references, SDK guides, and architectural blueprints for NEXUS AI platform.
          </p>
        </div>

        <div className="space-y-8">
          {DOCS_SECTIONS.map((sec) => (
            <div key={sec.category} className="space-y-3">
              <h2 className="text-sm font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                {sec.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sec.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-5 space-y-2 hover:border-brand-500/30 hover:bg-dark-800/60 transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-dark-300 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="text-[10px] text-brand-400 pt-2 flex items-center gap-1 font-mono">
                      <span>Read Guide →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
