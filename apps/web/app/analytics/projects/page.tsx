'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { FolderKanban, Users, CheckCircle2, TrendingUp } from 'lucide-react';

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

export default function AnalyticsProjectsPage() {
  return (
    <ModuleLayout
      title="Project Velocity & Workspace Analytics"
      subtitle="Deliverable completion velocity, agent task allocation, and project milestone health"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Active Projects</div>
            <div className="text-2xl font-bold text-white">3 Workspaces</div>
            <div className="text-xs text-emerald-400 mt-1">All on track</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Sprint Tasks Completed</div>
            <div className="text-2xl font-bold text-white">42 / 48</div>
            <div className="text-xs text-indigo-400 mt-1">87.5% completion rate</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Autonomous Agent Efficiency</div>
            <div className="text-2xl font-bold text-white">4.2x Velocity</div>
            <div className="text-xs text-emerald-400 mt-1">Compared to manual baseline</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
