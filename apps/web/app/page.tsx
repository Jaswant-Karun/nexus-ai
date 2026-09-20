import Link from "next/link";
import { NavBar } from "@nexus/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <NavBar brandName="NEXUS AI" />

      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-8 animate-pulse">
          ⚡ Enterprise Adaptive Intelligence Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent max-w-4xl leading-tight">
          Orchestrate AI Agents, Memory & Automated Workflows
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          NEXUS AI unites multi-model LLM orchestration, hybrid vector search, and visual node workflow automation into one unified platform.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base rounded-xl transition-all shadow-xl shadow-cyan-500/25"
          >
            Launch Platform Dashboard →
          </Link>
          <Link
            href="/chat"
            className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 font-semibold text-base rounded-xl transition-all"
          >
            Explore AI Agent Studio
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl mb-4">
              🤖
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Autonomous AI Agents</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Deploy specialized agents with tool execution, memory recall, and dynamic prompt tuning across multiple LLM providers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Visual Workflow Engine</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Build drag-and-drop multi-node execution DAGs to automate data pipelines, webhooks, and agent collaboration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl mb-4">
              🧠
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Adaptive Memory Engine</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sub-millisecond hybrid vector retrieval (BM25 + Qdrant dense embeddings) for context-grounded AI intelligence.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
