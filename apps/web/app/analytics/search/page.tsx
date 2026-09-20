'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Search, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function AnalyticsSearchPage() {
  return (
    <ModuleLayout
      title="Search Engine Analytics & Query Volume"
      subtitle="Query frequency, mean cosine similarity scores, and zero-result discovery gap metrics"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Search Queries (30d)</div>
            <div className="text-2xl font-bold text-white font-mono">8,920</div>
            <div className="text-xs text-emerald-400 mt-1">98.4% retrieved with &gt;85% match</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Mean Vector Match Latency</div>
            <div className="text-2xl font-bold text-white font-mono">18.4 ms</div>
            <div className="text-xs text-emerald-400 mt-1">Sub-second end-to-end response</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Zero-Result Gap Rate</div>
            <div className="text-2xl font-bold text-white font-mono">0.6%</div>
            <div className="text-xs text-indigo-400 mt-1">Semantic fallback prevented misses</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
