'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Download, FileSpreadsheet, CheckCircle2, ArrowLeft } from 'lucide-react';

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

export default function AnalyticsExportPage() {
  const [downloading, setDownloading] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      const csv = `Timestamp,Model,Tokens,LatencyMs,Cost,Status\n2026-09-06T12:00:00Z,gpt-4o,842,284,0.012,200\n2026-09-06T12:05:00Z,claude-3-5,910,312,0.015,200`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_analytics_telemetry.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 700);
  };

  return (
    <ModuleLayout
      title="Export Analytics Telemetry Data"
      subtitle="Export raw token usage records, agent execution logs, and latency time-series into CSV"
      subnav={analyticsSubnav}
      actions={
        <Link
          href="/analytics"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Analytics
        </Link>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Download Incurred Usage & Latency Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate a full CSV export containing time-series data for model inference tokens, TTFT latency, workflow execution durations, and cost breakdowns.
          </p>
          <button
            onClick={handleExport}
            disabled={downloading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> {downloading ? 'Preparing CSV Dataset...' : 'Download Telemetry CSV'}
          </button>
        </div>
      </div>
    </ModuleLayout>
  );
}
