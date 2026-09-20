'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Sparkles, 
  GitFork, 
  Search, 
  Play, 
  ArrowUpRight, 
  Layers, 
  Bot, 
  Database 
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Templates', href: '/workflows/templates' },
  { label: 'Live Execution', href: '/workflows/execution' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
  { label: 'Analytics', href: '/workflows/analytics' },
];

const templates = [
  {
    id: 'tpl-multi-agent-consensus',
    title: '4-Agent Architectural Consensus Pipeline',
    category: 'Engineering',
    nodes: 4,
    description: 'Ingests specifications, triggers parallel research & security audit, reconciles conflicts via Critic Agent 3, and outputs clean artifacts.',
    agents: ['Orchestrator', 'Researcher', 'Critic', 'Synthesizer']
  },
  {
    id: 'tpl-continuous-rag-sync',
    title: 'Vector Knowledge Base Auto-Sync & Re-indexing',
    category: 'Data & RAG',
    nodes: 3,
    description: 'Watches storage volumes for markdown/PDF changes, chunks documents, generates text-embedding-3 vectors, and upserts into pgvector.',
    agents: ['Chunker', 'Embedding Worker', 'Index Validator']
  },
  {
    id: 'tpl-automated-incident-triage',
    title: 'SRE Log Parser & Incident Mitigation',
    category: 'DevOps',
    nodes: 5,
    description: 'Parses Datadog / Prometheus webhooks, queries Vector knowledge base for past runbooks, isolates pods, and prepares Slack post-mortem.',
    agents: ['Webhook Ingestion', 'Runbook Matcher', 'Remediation Worker']
  }
];

export default function WorkflowTemplatesPage() {
  const [search, setSearch] = useState('');

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Workflow DAG Templates"
      subtitle="Production blueprints with verified node topology, consensus logic, and tool bindings"
      subnav={workflowsSubnav}
      actions={
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{tpl.nodes} Nodes</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {tpl.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Agents Involved</div>
                  <div className="flex flex-wrap gap-1">
                    {tpl.agents.map(a => (
                      <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/workflows/editor?template=${tpl.id}`}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow text-center flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Instantiate Blueprint
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
