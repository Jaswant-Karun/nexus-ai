'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';
import { 
  Code2, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Server, 
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/agents/execute',
    desc: 'Trigger autonomous multi-agent task execution pipeline',
    tag: 'Agents'
  },
  {
    method: 'GET',
    path: '/api/v1/workflows/status/:id',
    desc: 'Retrieve real-time DAG execution state and agent intermediate outputs',
    tag: 'Workflows'
  },
  {
    method: 'POST',
    path: '/api/v1/ai/generate',
    desc: 'Invoke high-throughput neural models with RAG grounding',
    tag: 'Inference'
  },
  {
    method: 'GET',
    path: '/api/storage/files',
    desc: 'Query synced workspace storage assets and metadata',
    tag: 'Storage'
  },
  {
    method: 'POST',
    path: '/api/v1/memory/context',
    desc: 'Store or retrieve persistent semantic associative memory embeddings',
    tag: 'Memory'
  }
];

export default function ApiDocumentationPage() {
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState<'bash' | 'python' | 'typescript'>('bash');

  const codeSnippets = {
    bash: `curl -X POST https://api.nexusai.io/v1/agents/execute \\
  -H "Authorization: Bearer nx_live_948a7b6f2e..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "market-analyzer-agent",
    "prompt": "Evaluate competitor pricing trends in Q3 enterprise SaaS",
    "temperature": 0.2
  }'`,
    python: `import nexusai

client = nexusai.Client(api_key="nx_live_948a7b6f2e...")

response = client.agents.execute(
    agent_id="market-analyzer-agent",
    prompt="Evaluate competitor pricing trends in Q3 enterprise SaaS",
    stream=True
)

for event in response:
    print(event.delta, end="")`,
    typescript: `import { NexusAI } from '@nexus-ai/sdk';

const nexus = new NexusAI({ apiKey: process.env.NEXUS_API_KEY });

const result = await nexus.agents.execute({
  agentId: 'market-analyzer-agent',
  prompt: 'Evaluate competitor pricing trends in Q3 enterprise SaaS'
});

console.log(result.data.output);`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>NEXUS REST & Streaming API v1.4</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
            Developer API & Gateway
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Programmatic access to autonomous multi-agent pipelines, generative neural models, and real-time semantic memory vectors.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link 
              href="/developer/api-keys" 
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Key className="w-4 h-4" /> Get Production API Keys
            </Link>
            <Link 
              href="/developer/sdk" 
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" /> Download SDKs
            </Link>
          </div>
        </div>

        {/* Quick Start & Interactive Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" /> Quickstart Integration
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every endpoint is protected with high-frequency rate limiters, token-level billing, and granular RBAC permissions. Authenticate using Bearer tokens generated from your organization settings.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">Zero-Retention Enterprise Option</div>
                  <div className="text-xs text-slate-400">Strictly encrypted in-flight; inferences never persist without explicit consent.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <Server className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">99.99% Global Uptime SLA</div>
                  <div className="text-xs text-slate-400">Multi-region active-active cluster failover across AWS & GCP edge zones.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">POST /v1/agents/execute</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-slate-800/80 p-0.5 text-xs font-mono">
                    {(['bash', 'python', 'typescript'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-2.5 py-1 rounded capitalize transition-colors ${
                          activeLang === lang ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy snippet"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/60">
                <pre>{codeSnippets[activeLang]}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Core Endpoints List */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-900/40 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Popular Endpoints</h3>
              <p className="text-xs sm:text-sm text-slate-400">Explore key interfaces exposed by the NEXUS AI Core Engine.</p>
            </div>
            <Link 
              href="/developer/api-docs" 
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Open Swagger / OpenAPI <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div 
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/60 border border-slate-800 transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                    ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-slate-200">{ep.path}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs text-slate-400">{ep.desc}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {ep.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
