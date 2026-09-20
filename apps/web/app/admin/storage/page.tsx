'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Database, HardDrive, CheckCircle2, RefreshCw } from 'lucide-react';

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

export default function AdminStoragePage() {
  return (
    <ModuleLayout
      title="Cluster Storage & Database Shards"
      subtitle="Super-admin volume management, pgvector table status, and file storage limits"
      subnav={adminSubnav}
      actions={
        <button
          onClick={() => alert("Vacuum and analyze database.")}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Vacuum pgvector Tables
        </button>
      }
    >
      <div className="space-y-4">
        {[
          { name: 'PostgreSQL 16 Primary DB', type: 'Relational + pgvector', size: '1.2 GB / 10 GB', status: 'Healthy' },
          { name: 'Workspace File Volume', type: 'Local NVMe Storage', size: '340 MB / 50 GB', status: 'Healthy' },
          { name: 'Ephemeral Memory Cache', type: 'Redis In-Memory', size: '14.2 MB / 2 GB', status: 'Healthy' },
        ].map(s => (
          <div
            key={s.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">{s.name}</h4>
                <span className="text-xs text-slate-400">({s.type})</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Storage Allocation: {s.size}
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full self-end sm:self-center">
              <CheckCircle2 className="w-3 h-3" /> {s.status}
            </span>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
