'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Search, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

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

export default function AdminSearchPage() {
  return (
    <ModuleLayout
      title="Cluster Search Index Administration"
      subtitle="Monitor lexical inverted indexes, semantic embedding spaces, and re-indexing tasks"
      subnav={adminSubnav}
      actions={
        <button
          onClick={() => alert("Rebuilding global vector search index.")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Rebuild Search Index
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Index Health</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Synchronized
            </div>
            <div className="text-xs text-slate-500 mt-1">14,820 vectors up-to-date</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Mean Vector Recall</div>
            <div className="text-xl font-bold text-white font-mono">18.4 ms</div>
            <div className="text-xs text-emerald-400 mt-1">HNSW cosine distance</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Embedding Engine</div>
            <div className="text-xl font-bold text-white font-mono">text-embedding-3</div>
            <div className="text-xs text-indigo-400 mt-1">1536 float dimensions</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
