'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { GitFork, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const analyticsSubnav = [
  { label: 'Cluster Overview', href: '/analytics' },
  { label: 'AI & Models', href: '/analytics/ai' },
  { label: 'Workflows', href: '/analytics/workflows' },
  { label: 'Projects', href: '/analytics/projects' },
  { label: 'User Activity', href: '/analytics/users' },
  { label: 'Storage & Vectors', href: '/analytics/storage' },
  { label: 'Search Queries', href: '/analytics/search' },
  { label: 'Export Telemetry', href: '/analytics/export' },
];

export default function AnalyticsWorkflowsPage() {
  return (
    <ModuleLayout
      title="Workflow DAG Execution Analytics"
      subtitle="Execution volume, pipeline success rate, latency by node, and error recovery metrics"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Pipeline Dispatches</div>
            <div className="text-2xl font-bold text-white">1,429 Runs</div>
            <div className="text-xs text-emerald-400 mt-1">99.8% completion rate</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Mean DAG Duration</div>
            <div className="text-2xl font-bold text-white font-mono">31.4s</div>
            <div className="text-xs text-emerald-400 mt-1">Parallel node execution</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Autonomous Retry Success</div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-indigo-400 mt-1">4 network retries recovered</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
