'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { FileBarChart2, Sparkles, ArrowLeft, Bot, Save } from 'lucide-react';

const reportsSubnav = [
  { label: 'All Reports', href: '/reports' },
  { label: 'Create Report', href: '/reports/create' },
  { label: 'Export Engine', href: '/reports/export' },
  { label: 'Archive History', href: '/reports/history' },
];

export default function CreateReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('performance');
  const [timeRange, setTimeRange] = useState('30d');
  const [prompt, setPrompt] = useState('Summarize system performance, agent consensus reliability, and pgvector latency.');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      router.push('/reports');
    }, 1000);
  };

  return (
    <ModuleLayout
      title="Generate Intelligence Report"
      subtitle="Synthesize telemetry, agent consensus metrics, and project status with GPT-4o"
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
      <form onSubmit={handleGenerate} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileBarChart2 className="w-4 h-4 text-indigo-400" /> Report Specification
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Report Title
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Multi-Agent Consensus & Token Audit"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Report Focus Domain
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="performance">System Performance & Cluster SLA</option>
                <option value="agent">Autonomous Agent Reliability & Consensus</option>
                <option value="token">Token Billing & Compute Spend</option>
                <option value="security">Security Audit & Vulnerability Assessment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Telemetry Window
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days (Recommended)</option>
                <option value="quarter">Current Quarter (Q3 2026)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Synthesis Instructions / Focus Questions
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Synthesizing Report with GPT-4o...' : 'Generate Intelligence Report'}
        </button>
      </form>
    </ModuleLayout>
  );
}
