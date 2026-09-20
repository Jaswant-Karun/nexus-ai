'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FolderKanban, 
  Plus, 
  Bot, 
  User, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Sparkles 
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

export default function ProjectKanbanPage() {
  const [columns, setColumns] = useState({
    todo: [
      { id: 'k-1', title: 'Benchmark NATS JetStream versus Redis', assignee: 'Research Agent', isAgent: true, priority: 'Low' },
      { id: 'k-2', title: 'Export OpenAPI v3 documentation', assignee: 'Jaswant Karun', isAgent: false, priority: 'Medium' }
    ],
    inProgress: [
      { id: 'k-3', title: 'Implement pgvector IVFFlat index migration', assignee: 'Full-Stack Synthesizer', isAgent: true, priority: 'Medium' }
    ],
    review: [
      { id: 'k-4', title: 'Review OpenAI Consensus Critic Verification Delta', assignee: 'Jaswant Karun', isAgent: false, priority: 'Critical' }
    ],
    done: [
      { id: 'k-5', title: 'Synthesize Food Delivery Dispatch DAG Topology', assignee: 'Master Orchestrator', isAgent: true, priority: 'High' }
    ]
  });

  return (
    <ModuleLayout
      title="Project Kanban Board"
      subtitle="Visual workflow board mapping human tasks and autonomous agent executions"
      subnav={projectsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/projects/tasks"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            Switch to List View
          </Link>
          <button
            onClick={() => alert("Add Task Card to Kanban column.")}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        {/* Column 1: Todo */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Backlog</span>
            <span className="font-mono text-slate-500">{columns.todo.length}</span>
          </div>
          <div className="space-y-3">
            {columns.todo.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow">
                <div className="text-xs font-semibold text-white mb-2">{c.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {c.isAgent ? <Bot className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3 text-emerald-400" />}
                    {c.assignee}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{c.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              In Progress
            </span>
            <span className="font-mono text-slate-500">{columns.inProgress.length}</span>
          </div>
          <div className="space-y-3">
            {columns.inProgress.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow">
                <div className="text-xs font-semibold text-white mb-2">{c.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {c.isAgent ? <Bot className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3 text-emerald-400" />}
                    {c.assignee}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{c.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Consensus Review */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider">Consensus Review</span>
            <span className="font-mono text-slate-500">{columns.review.length}</span>
          </div>
          <div className="space-y-3">
            {columns.review.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow">
                <div className="text-xs font-semibold text-white mb-2">{c.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {c.isAgent ? <Bot className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3 text-emerald-400" />}
                    {c.assignee}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{c.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Done */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
            <span className="font-mono text-slate-500">{columns.done.length}</span>
          </div>
          <div className="space-y-3">
            {columns.done.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 shadow">
                <div className="text-xs font-semibold text-slate-300 line-through mb-2">{c.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{c.assignee}</span>
                  <span className="text-[10px] text-emerald-400">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
