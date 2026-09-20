'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FileBarChart2, 
  Plus, 
  Search, 
  Download, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Calendar 
} from 'lucide-react';

const reportsSubnav = [
  { label: 'All Reports', href: '/reports' },
  { label: 'Create Report', href: '/reports/create' },
  { label: 'Export Engine', href: '/reports/export' },
  { label: 'Archive History', href: '/reports/history' },
];

const mockReports = [
  {
    id: 'rep-cluster-perf-aug',
    title: 'Enterprise Cluster Performance & SLA Audit (August 2026)',
    type: 'Infrastructure & SLA',
    author: 'Nexus Telemetry Engine',
    date: 'Sep 1, 2026',
    status: 'Published',
    summary: '99.98% cluster availability, 312ms average latency, and zero data breaches recorded across 4 active microservices.'
  },
  {
    id: 'rep-food-delivery-spec',
    title: 'Food Delivery Multi-Agent Architecture Specification',
    type: 'System Architecture',
    author: 'Jaswant Karun & Orchestrator',
    date: 'Sep 5, 2026',
    status: 'Verified',
    summary: 'Complete technical breakdown of asynchronous event queues, driver geo-dispatch, and consensus verification.'
  },
  {
    id: 'rep-token-spend-q3',
    title: 'Q3 Enterprise Token Spend & Cost Attribution',
    type: 'Financial & Billing',
    author: 'Billing Service',
    date: 'Sep 3, 2026',
    status: 'Published',
    summary: 'Detailed model spend across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro with cost optimization suggestions.'
  }
];

export default function ReportsHubPage() {
  const [search, setSearch] = useState('');

  const filtered = mockReports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Intelligence Reports & Enterprise Audits"
      subtitle="Synthesized analytical reports, security audits, and architectural whitepapers"
      subnav={reportsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/reports/export"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            Export All
          </Link>
          <Link
            href="/reports/create"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Generate Report
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by topic, type, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Reports
          </span>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filtered.map(rep => (
            <div
              key={rep.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <FileBarChart2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {rep.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {rep.summary}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>Type: <strong className="text-slate-300 font-normal">{rep.type}</strong></span>
                  <span>•</span>
                  <span>Author: {rep.author}</span>
                  <span>•</span>
                  <span>{rep.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href={`/reports/${rep.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  View Details <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => alert(`Downloading ${rep.title}`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
