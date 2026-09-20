'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  ShieldAlert, 
  Users, 
  Building, 
  Bot, 
  Cpu, 
  Database, 
  Activity, 
  HardDrive, 
  Lock, 
  Terminal, 
  ArrowUpRight 
} from 'lucide-react';

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

export default function AdminHubPage() {
  return (
    <ModuleLayout
      title="Platform Cluster Administration"
      subtitle="Super-admin command center for multi-tenant organizations, node clusters, and global security"
      subnav={adminSubnav}
    >
      <div className="space-y-6">
        {/* Admin Alerts & Status */}
        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cluster Security: Hardened</h3>
              <p className="text-xs text-slate-400">All microservices isolated behind mTLS with FIDO2/2FA mandatory authentication.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Node Status: Healthy
          </span>
        </div>

        {/* Global Cluster Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Registered Users</div>
            <div className="text-2xl font-bold text-white">4 Seats</div>
            <div className="text-xs text-emerald-400 mt-1">100% active this week</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Organizations</div>
            <div className="text-2xl font-bold text-white">1 Tenant</div>
            <div className="text-xs text-slate-400 mt-1">Nexus AI Enterprise</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Agent Fleet Pool</div>
            <div className="text-2xl font-bold text-white">4 Dedicated</div>
            <div className="text-xs text-indigo-400 mt-1">GPT-4o, Claude 3.5, Gemini</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Database Shards</div>
            <div className="text-2xl font-bold text-white font-mono">pgvector</div>
            <div className="text-xs text-emerald-400 mt-1">14,820 semantic vectors</div>
          </div>
        </div>

        {/* Admin Navigation Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/admin/users"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Users className="w-5 h-5 text-indigo-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">User Management</h4>
            <p className="text-xs text-slate-400 mt-1">Manage global user roles, impersonation tokens, and suspensions.</p>
          </Link>

          <Link
            href="/admin/system"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Activity className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">System Diagnostics</h4>
            <p className="text-xs text-slate-400 mt-1">FastAPI service on 8001, n8n on 5678, PostgreSQL cluster stats.</p>
          </Link>

          <Link
            href="/admin/backups"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <HardDrive className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Backups & Recovery</h4>
            <p className="text-xs text-slate-400 mt-1">Point-in-time PostgreSQL recovery and vector embedding snapshots.</p>
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}
