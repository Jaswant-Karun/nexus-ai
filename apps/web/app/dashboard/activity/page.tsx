'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  RefreshCw, 
  Bot, 
  GitFork, 
  Database,
  ArrowUpRight,
  Search
} from 'lucide-react';

const dashboardSubnav = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Home View', href: '/dashboard/home' },
  { label: 'Live Activity', href: '/dashboard/activity' },
  { label: 'Favorites', href: '/dashboard/favorites' },
  { label: 'Recent Runs', href: '/dashboard/recent' },
];

const mockActivities = [
  {
    id: 'act-1',
    type: 'workflow',
    event: 'Multi-Agent Collaboration DAG Finished',
    detail: 'Pipeline: Ingest -> Research -> Critique -> Synthesize',
    target: 'Food Delivery System Workflow',
    user: 'Jaswant Karun',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: 'act-2',
    type: 'agent',
    event: 'Agent Consensus Check Passed',
    detail: 'OpenAI Chat Model Agent 3 resolved discrepancy with Agent 2 critique',
    target: 'Market Strategy Agent',
    user: 'Nexus Orchestrator',
    timestamp: '14 minutes ago',
    status: 'success'
  },
  {
    id: 'act-3',
    type: 'storage',
    event: 'Semantic File Indexing Complete',
    detail: 'Uploaded: Nexus_AI_Architecture.md chunked into 48 semantic vectors',
    target: 'Vector Store (pgvector)',
    user: 'Jaswant Karun',
    timestamp: '42 minutes ago',
    status: 'success'
  },
  {
    id: 'act-4',
    type: 'model',
    event: 'FastAPI AI Service Health Check',
    detail: 'HTTP 200 OK — model worker cluster latency 42ms on port 8001',
    target: 'Backend AI Service',
    user: 'System Monitor',
    timestamp: '1 hour ago',
    status: 'success'
  },
  {
    id: 'act-5',
    type: 'workflow',
    event: 'n8n Workflow Execution Dispatched',
    detail: 'Execution #10492 completed with 0 errors',
    target: 'nexus_multi_agent_collaboration.json',
    user: 'n8n Trigger',
    timestamp: '2 hours ago',
    status: 'success'
  }
];

export default function DashboardActivityPage() {
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockActivities.filter(a => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesSearch = a.event.toLowerCase().includes(search.toLowerCase()) || 
                          a.detail.toLowerCase().includes(search.toLowerCase()) ||
                          a.target.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <ModuleLayout
      title="Platform Activity & Audit Stream"
      subtitle="Real-time telemetry and event logs across agents, workflows, and workspace storage"
      subnav={dashboardSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Stream
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'workflow', 'agent', 'storage', 'model'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  filterType === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Activity List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800/80 overflow-hidden">
          {filtered.map(act => (
            <div key={act.id} className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${
                  act.type === 'workflow' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                  act.type === 'agent' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  act.type === 'storage' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {act.type === 'workflow' && <GitFork className="w-4 h-4" />}
                  {act.type === 'agent' && <Bot className="w-4 h-4" />}
                  {act.type === 'storage' && <Database className="w-4 h-4" />}
                  {act.type === 'model' && <Activity className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{act.event}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {act.target}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{act.detail}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Triggered by <strong className="text-slate-400 font-medium">{act.user}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Success
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
