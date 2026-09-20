'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  GitFork, 
  Download, 
  RefreshCw 
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

const runs = [
  {
    id: 'run-1094',
    workflow: 'Food Delivery System Architecture',
    trigger: 'Manual (Jaswant Karun)',
    status: 'Completed',
    duration: '38.4s',
    tokens: 2140,
    cost: '$0.021',
    timestamp: '18 minutes ago'
  },
  {
    id: 'run-1093',
    workflow: 'Nexus Multi-Agent Collaboration',
    trigger: 'n8n Webhook',
    status: 'Completed',
    duration: '44.1s',
    tokens: 3100,
    cost: '$0.029',
    timestamp: '2 hours ago'
  },
  {
    id: 'run-1092',
    workflow: 'PostgreSQL pgvector Continuous Sync',
    trigger: 'Storage File Event',
    status: 'Completed',
    duration: '8.2s',
    tokens: 680,
    cost: '$0.005',
    timestamp: '4 hours ago'
  },
  {
    id: 'run-1091',
    workflow: 'Multi-Agent Security Audit',
    trigger: 'Scheduled Cron',
    status: 'Failed',
    duration: '14.6s',
    tokens: 920,
    cost: '$0.008',
    timestamp: 'Yesterday'
  }
];

export default function WorkflowHistoryPage() {
  const [search, setSearch] = useState('');

  const filtered = runs.filter(r =>
    r.workflow.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Workflow Execution History & Logs"
      subtitle="Complete chronological audit trail of all DAG runs, token consumption, and outputs"
      subnav={workflowsSubnav}
      actions={
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh History
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search runs by ID or workflow name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Historical Executions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Run ID</th>
                  <th className="px-6 py-3">Workflow Name</th>
                  <th className="px-6 py-3">Trigger Source</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Tokens</th>
                  <th className="px-6 py-3">Cost</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-400">{r.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{r.workflow}</td>
                    <td className="px-6 py-4 text-slate-400">{r.trigger}</td>
                    <td className="px-6 py-4 font-mono">{r.duration}</td>
                    <td className="px-6 py-4 font-mono">{r.tokens}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">{r.cost}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {r.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{r.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
