'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Download, FileText, FileCode, CheckCircle2, ArrowLeft } from 'lucide-react';

const reportsSubnav = [
  { label: 'All Reports', href: '/reports' },
  { label: 'Create Report', href: '/reports/create' },
  { label: 'Export Engine', href: '/reports/export' },
  { label: 'Archive History', href: '/reports/history' },
];

export default function ReportsExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = (fmt: string) => {
    setDownloading(fmt);
    setTimeout(() => {
      const content = `NEXUS AI Enterprise Report Export\nGenerated: ${new Date().toISOString()}\nSLA Availability: 99.98%\nTotal Runs: 1,429\nConsensus Score: 99.4%`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_report_export.${fmt.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 800);
  };

  return (
    <ModuleLayout
      title="Bulk Report Export Engine"
      subtitle="Export aggregated reports, audit logs, and compliance filings into industry-standard formats"
      subnav={reportsSubnav}
      actions={
        <Link
          href="/reports"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Reports
        </Link>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Select Export Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <FileText className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold text-white">PDF Document Bundle</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Formatted for executive stakeholders and compliance auditors.</p>
              </div>
              <button
                onClick={() => handleExport('PDF')}
                disabled={downloading !== null}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> {downloading === 'PDF' ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <FileCode className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">CSV / JSON Raw Telemetry</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Structured machine-readable data for external analytics tools.</p>
              </div>
              <button
                onClick={() => handleExport('JSON')}
                disabled={downloading !== null}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> {downloading === 'JSON' ? 'Exporting...' : 'Export JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
