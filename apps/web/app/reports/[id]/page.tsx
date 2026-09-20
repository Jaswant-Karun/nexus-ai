'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FileBarChart2, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Sparkles 
} from 'lucide-react';

const reportsSubnav = [
  { label: 'All Reports', href: '/reports' },
  { label: 'Create Report', href: '/reports/create' },
  { label: 'Export Engine', href: '/reports/export' },
  { label: 'Archive History', href: '/reports/history' },
];

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params?.id as string || 'rep-cluster-perf-aug';

  return (
    <ModuleLayout
      title={`Report: ${reportId}`}
      subtitle="Synthesized analytical deliverable with verified telemetry and executive summary"
      subnav={reportsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <button
            onClick={() => alert("Downloading PDF document...")}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Verified Executive Intelligence
            </span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-1">
              Enterprise Cluster Performance & SLA Audit (August 2026)
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span>Author: <strong className="text-slate-200">NEXUS Telemetry Core</strong></span>
              <span>•</span>
              <span>Published: Sep 1, 2026</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Signed
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white">1. Executive Summary</h3>
            <p>
              During the August 2026 evaluation window, the NEXUS AI Enterprise cluster maintained 99.98% SLA availability across 1,429 automated workflow DAG executions. Multi-agent consensus verification led by OpenAI Chat Model (Agent 3) prevented 14 schema deviations and caught 2 potential hallucinated database keys before code synthesis.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. Token & Latency Profiling</h3>
            <p>
              Average end-to-end multi-agent execution completed in 312ms per node hop. Token ingestion was optimized through semantic caching in PostgreSQL pgvector, reducing redundant API round-trips by 28.4%.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-emerald-400">• Total Tokens Processed: 48,210,940</div>
              <div className="text-indigo-400">• Consensus Agreement Index: 99.4%</div>
              <div className="text-amber-400">• Mean Response Latency: 284 ms</div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
