'use client';

import React, { useState, useEffect } from 'react';
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
  Sliders,
  Workflow,
  Cpu,
  RefreshCw,
  Terminal,
  ShieldCheck
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
    name: 'Nexus Multi-Agent Collaboration (n8n Engine)',
    description: 'n8n integrated pipeline: Ingest -> Researcher -> Agent 3 Critic -> Code Synthesizer.',
    nodesCount: 5,
    status: 'Active',
    trigger: 'Webhook (/nexus-multi-agent)',
    lastRun: 'Just now',
    successRate: '99.4%',
    author: 'n8n Orchestrator'
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
  
  // n8n Live Integration State
  const [n8nStatus, setN8nStatus] = useState<'CHECKING' | 'ONLINE' | 'STANDBY'>('CHECKING');
  const [n8nRunning, setN8nRunning] = useState(false);
  const [n8nResult, setN8nResult] = useState<any>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/workflows/n8n');
      const data = await res.json();
      setN8nStatus(data.status === 'ONLINE' ? 'ONLINE' : 'STANDBY');
    } catch {
      setN8nStatus('STANDBY');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const triggerN8nWorkflow = async (type: 'single' | 'multi-agent') => {
    setN8nRunning(true);
    setN8nResult(null);
    try {
      const payload = type === 'multi-agent'
        ? { type: 'multi-agent', goal: 'Autonomous cloud backend deployment and verification' }
        : { type: 'single', prompt: 'Coordinate multi-agent task execution and verify security compliance', model: 'gemini-2.5-flash' };

      const res = await fetch('/api/workflows/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setN8nResult(data);
    } catch (err: any) {
      setN8nResult({ success: false, error: err.message || 'Execution failed' });
    } finally {
      setN8nRunning(false);
    }
  };

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

        {/* ─── n8n Automation Engine Control Center ─────────────────── */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-500/20 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">n8n Automation & Webhook Orchestrator</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    n8nStatus === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${n8nStatus === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    {n8nStatus === 'ONLINE' ? 'n8n ONLINE (Port 5678)' : 'STANDBY / AUTONOMOUS FALLBACK'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Headless visual orchestrator wiring multi-agent council webhooks directly into NEXUS web and mobile runtimes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerN8nWorkflow('single')}
                disabled={n8nRunning}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 shadow"
              >
                <Cpu className={`w-3.5 h-3.5 ${n8nRunning ? 'animate-spin' : 'text-indigo-400'}`} />
                Run Master Agent
              </button>
              <button
                onClick={() => triggerN8nWorkflow('multi-agent')}
                disabled={n8nRunning}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {n8nRunning ? 'Executing n8n Pipeline...' : 'Run Multi-Agent Collab'}
              </button>
            </div>
          </div>

          {/* n8n Live Result Display */}
          {n8nResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Execution Result ({n8nResult.workflow || 'Pipeline Run'})
                </span>
                <span className="text-[11px] text-slate-400">
                  Engine: <strong className="text-indigo-300">{n8nResult.engine || 'n8n/nexus'}</strong> • Time: {n8nResult.executionDurationMs || 340}ms
                </span>
              </div>
              <div className="whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed text-slate-300">
                {typeof n8nResult.output === 'string' ? n8nResult.output : JSON.stringify(n8nResult, null, 2)}
              </div>
            </div>
          )}
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
                  href="/workflows/execution"
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
