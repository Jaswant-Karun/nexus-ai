'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Database, HardDrive, Cpu, TrendingUp } from 'lucide-react';

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

export default function AnalyticsStoragePage() {
  return (
    <ModuleLayout
      title="Storage & Vector Database Metrics"
      subtitle="Capacity allocation, vector indexing latency, and file storage footprint"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">PostgreSQL Database Size</div>
            <div className="text-2xl font-bold text-white font-mono">1.2 / 10 GB</div>
            <div className="text-xs text-emerald-400 mt-1">12% capacity utilized</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Indexed Vectors</div>
            <div className="text-2xl font-bold text-white font-mono">14,820</div>
            <div className="text-xs text-indigo-400 mt-1">1536-dim text-embedding-3</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Vector Query Recall Time</div>
            <div className="text-2xl font-bold text-white font-mono">14.2 ms</div>
            <div className="text-xs text-emerald-400 mt-1">HNSW index acceleration</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
