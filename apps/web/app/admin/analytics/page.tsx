'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { BarChart3, TrendingUp, Cpu, Bot, DollarSign, Download } from 'lucide-react';

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

export default function AdminAnalyticsPage() {
  return (
    <ModuleLayout
      title="Cluster-Wide Resource & Financial Analytics"
      subtitle="Super-admin billing ledger, model cost allocation, and multi-tenant token consumption"
      subnav={adminSubnav}
      actions={
        <Link
          href="/analytics/export"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export Billing Ledger
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Global Monthly Spend</div>
            <div className="text-2xl font-bold text-white font-mono">$184.20</div>
            <div className="text-xs text-emerald-400 mt-1">26% below ceiling</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Cluster Inferences</div>
            <div className="text-2xl font-bold text-white font-mono">10,180 Runs</div>
            <div className="text-xs text-indigo-400 mt-1">Across 4 active agents</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Hardware Saturation</div>
            <div className="text-2xl font-bold text-white font-mono">18% CPU / 24% RAM</div>
            <div className="text-xs text-emerald-400 mt-1">Healthy compute overhead</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
