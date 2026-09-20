'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Clock, 
  GitFork, 
  Bot, 
  MessageSquare, 
  FileText, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

const dashboardSubnav = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Home View', href: '/dashboard/home' },
  { label: 'Live Activity', href: '/dashboard/activity' },
  { label: 'Favorites', href: '/dashboard/favorites' },
  { label: 'Recent Runs', href: '/dashboard/recent' },
];

const recentRuns = [
  {
    id: 'run-902',
    name: 'Food Delivery System Architecture Synthesis',
    category: 'Workflow Execution',
    icon: GitFork,
    timestamp: '12 minutes ago',
    duration: '48.2s',
    cost: '$0.042',
    status: 'Completed',
    link: '/workflow'
  },
  {
    id: 'run-901',
    name: 'Multi-Agent Critic Consensus Evaluation',
    category: 'Agent Task',
    icon: Bot,
    timestamp: '45 minutes ago',
    duration: '14.1s',
    cost: '$0.018',
    status: 'Completed',
    link: '/agents'
  },
  {
    id: 'run-900',
    name: 'Copilot Chat: pgvector Schema Strategy',
    category: 'Conversation',
    icon: MessageSquare,
    timestamp: '2 hours ago',
    duration: '1m 20s',
    cost: '$0.012',
    status: 'Completed',
    link: '/chat'
  },
  {
    id: 'run-899',
    name: 'Storage Document Ingestion: Nexus_AI_Architecture.md',
    category: 'Vector Ingestion',
    icon: FileText,
    timestamp: '3 hours ago',
    duration: '6.4s',
    cost: '$0.003',
    status: 'Completed',
    link: '/storage'
  }
];

export default function DashboardRecentPage() {
  return (
    <ModuleLayout
      title="Recent Execution History"
      subtitle="Complete chronological timeline of agent inferences, DAG runs, and copilot sessions"
      subnav={dashboardSubnav}
      actions={
        <Link
          href="/workflows/history"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" /> All Execution Runs
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Execution Timeline</h3>
            <span className="text-xs text-slate-400">Showing last 24 hours</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentRuns.map(run => {
              const Icon = run.icon;
              return (
                <div key={run.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{run.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {run.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{run.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {run.timestamp}
                        </span>
                        <span>•</span>
                        <span>Duration: {run.duration}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">{run.cost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> {run.status}
                    </span>
                    <Link
                      href={run.link}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Run"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
