'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { GitFork, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

const adminSubnav = [
  { label: 'Admin Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Organizations', href: '/admin/organizations' },
  { label: 'Fleet Agents', href: '/admin/agents' },
  { label: 'Model Providers', href: '/admin/models' },
  { label: 'Workflows', href: '/admin/workflows' },
  { label: 'Storage & DB', href: '/admin/storage' },
  { label: 'Cluster Logs', href: '/admin/logs' },
  { label: 'Security & SSO', href: '/admin/security' },
  { label: 'System Health', href: '/admin/system' },
  { label: 'Backups', href: '/admin/backups' },
  { label: 'Admin Settings', href: '/admin/settings' },
];

export default function AdminWorkflowsPage() {
  return (
    <ModuleLayout
      title="Cluster-Wide Workflow Pipelines"
      subtitle="Super-admin oversight of all active DAG pipelines, cron schedules, and n8n engine bridges"
      subnav={adminSubnav}
      actions={
        <Link
          href="/workflows"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <GitFork className="w-3.5 h-3.5" /> Workflows Hub
        </Link>
      }
    >
      <div className="space-y-4">
        {[
          { name: 'Food Delivery System Architecture', owner: 'Jaswant Karun', executions: 842, status: 'Active', latency: '38.4s' },
          { name: 'Nexus Multi-Agent Collaboration', owner: 'System Core (n8n)', executions: 410, status: 'Active', latency: '44.1s' },
          { name: 'PostgreSQL pgvector Continuous Sync', owner: 'Data Engine', executions: 177, status: 'Scheduled', latency: '8.2s' },
        ].map(wf => (
          <div
            key={wf.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GitFork className="w-4 h-4 text-violet-400" />
                <h4 className="text-sm font-bold text-white">{wf.name}</h4>
              </div>
              <div className="text-xs text-slate-400">
                Owner: <strong className="text-slate-200">{wf.owner}</strong> • {wf.executions} Runs • Mean Latency: {wf.latency}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> {wf.status}
              </span>
              <Link
                href="/workflows"
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Inspect
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
