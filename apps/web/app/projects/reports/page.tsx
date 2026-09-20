'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FileText, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus 
} from 'lucide-react';

const projectsSubnav = [
  { label: 'All Projects', href: '/projects' },
  { label: 'New Project', href: '/projects/create' },
  { label: 'Tasks', href: '/projects/tasks' },
  { label: 'Kanban Board', href: '/projects/kanban' },
  { label: 'Timeline', href: '/projects/timeline' },
  { label: 'Team Members', href: '/projects/team' },
  { label: 'Project Files', href: '/projects/files' },
  { label: 'Project Reports', href: '/projects/reports' },
  { label: 'Settings', href: '/projects/settings' },
];

const reports = [
  {
    id: 'rep-1',
    title: 'Multi-Agent Consensus Verification Audit Report',
    date: 'Sep 6, 2026',
    author: 'OpenAI Consensus Critic (Agent 3)',
    summary: 'Detailed formal verification of Node 1 to Node 4 data contracts and schema migrations.',
    format: 'PDF / Markdown',
    status: 'Verified'
  },
  {
    id: 'rep-2',
    title: 'Food Delivery System Architecture Specification',
    date: 'Sep 5, 2026',
    author: 'NEXUS Master Orchestrator',
    summary: 'Executive blueprint for asynchronous event bus, spatial driver matching, and fault tolerance.',
    format: 'Markdown',
    status: 'Published'
  },
  {
    id: 'rep-3',
    title: 'pgvector IVFFlat vs HNSW Performance Benchmark',
    date: 'Sep 4, 2026',
    author: 'Claude 3.5 Sonnet',
    summary: 'Latency and recall analysis across 50,000 vector embeddings under 1,000 req/sec load.',
    format: 'JSON / PDF',
    status: 'Published'
  }
];

export default function ProjectReportsPage() {
  return (
    <ModuleLayout
      title="Project Reports & Artifact Audits"
      subtitle="Synthesized intelligence deliverables, architectural specifications, and security audits"
      subnav={projectsSubnav}
      actions={
        <button
          onClick={() => alert("Generate automated project status report via GPT-4o.")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Generate Project Summary
        </button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {rep.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>By <strong className="text-slate-300 font-medium">{rep.author}</strong></span>
                      <span>•</span>
                      <span>{rep.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-10">
                  {rep.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {rep.status}
                </span>
                <button
                  onClick={() => alert(`Downloading report ${rep.title}`)}
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
