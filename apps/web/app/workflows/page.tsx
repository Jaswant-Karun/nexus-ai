'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  GitFork, 
  Plus, 
  Search, 
  Play, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  Activity, 
  Sliders 
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

const mockWorkflows = [
  {
    id: 'wf-food-delivery',
    name: 'Food Delivery System Architecture',
    description: 'Autonomous 4-agent pipeline for backend, schema, consensus verification, and API contracts.',
    nodesCount: 4,
    status: 'Active',
    trigger: 'Webhook / Manual',
    lastRun: '12 minutes ago',
    successRate: '100%',
    author: 'Jaswant Karun'
  },
  {
    id: 'wf-multi-agent-collab',
    name: 'Nexus Multi-Agent Collaboration',
    description: 'n8n integrated pipeline: Ingest -> Researcher -> Agent 3 Critic -> Code Synthesizer.',
    nodesCount: 5,
    status: 'Active',
    trigger: 'Cron (Every 2h)',
    lastRun: '1 hour ago',
    successRate: '98.8%',
    author: 'System'
  },
  {
    id: 'wf-vector-sync',
    name: 'PostgreSQL pgvector Continuous Sync',
    description: 'Watches storage folder, extracts semantic chunks, and regenerates vector embeddings.',
    nodesCount: 3,
    status: 'Scheduled',
    trigger: 'Storage Event',
    lastRun: '3 hours ago',
    successRate: '100%',
    author: 'Data Engine'
  }
];

export default function WorkflowsHubPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [search, setSearch] = useState('');

  const filtered = workflows.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Workflow DAG Orchestrator"
      subtitle="Assemble, test, and schedule high-resilience multi-agent Directed Acyclic Graphs"
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/workflow"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> GPT-4o AI Generator
          </Link>
          <Link
            href="/workflows/create"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Workflow
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Active DAG Workflows</div>
            <div className="text-2xl font-bold text-white">3 Pipelines</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All systems healthy
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Executions (24h)</div>
            <div className="text-2xl font-bold text-white">1,429 Runs</div>
            <div className="text-xs text-indigo-400 mt-1">Average execution: 34s</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Execution Convergence</div>
            <div className="text-2xl font-bold text-white">99.2%</div>
            <div className="text-xs text-emerald-400 mt-1">Autonomous error recovery</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workflows by title or trigger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Workflows
          </span>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filtered.map(wf => (
            <div
              key={wf.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <GitFork className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {wf.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {wf.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {wf.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Nodes: <strong className="text-white font-mono">{wf.nodesCount}</strong></span>
                  <span>•</span>
                  <span>Trigger: <strong className="text-slate-300">{wf.trigger}</strong></span>
                  <span>•</span>
                  <span>Last run: {wf.lastRun}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{wf.successRate} success</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href={`/workflows/${wf.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Configure
                </Link>
                <Link
                  href="/workflow"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white" /> Run DAG
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
