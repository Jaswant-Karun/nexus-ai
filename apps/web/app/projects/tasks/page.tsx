'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Search, 
  Bot, 
  User, 
  Clock, 
  Calendar, 
  Filter 
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

const mockTasks = [
  {
    id: 'tsk-1',
    title: 'Synthesize Food Delivery Dispatch DAG Topology',
    assignee: 'NEXUS Master Orchestrator',
    isAgent: true,
    status: 'Completed',
    priority: 'High',
    due: 'Today'
  },
  {
    id: 'tsk-2',
    title: 'Review OpenAI Consensus Critic Verification Delta',
    assignee: 'Jaswant Karun',
    isAgent: false,
    status: 'In Progress',
    priority: 'Critical',
    due: 'Today'
  },
  {
    id: 'tsk-3',
    title: 'Implement pgvector IVFFlat index migration',
    assignee: 'Full-Stack Code Synthesizer',
    isAgent: true,
    status: 'In Progress',
    priority: 'Medium',
    due: 'Tomorrow'
  },
  {
    id: 'tsk-4',
    title: 'Benchmark NATS JetStream versus Redis Streams',
    assignee: 'Deep Research Agent',
    isAgent: true,
    status: 'Todo',
    priority: 'Low',
    due: 'Sep 9, 2026'
  }
];

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [search, setSearch] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Completed' ? 'In Progress' : 'Completed' };
      }
      return t;
    }));
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Project Tasks & Deliverables"
      subtitle="Coordinated task backlog distributed across human engineers and autonomous agents"
      subnav={projectsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/projects/kanban"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            Switch to Kanban Board
          </Link>
          <button
            onClick={() => alert("Quick Task Dialog: Enter task title and assign to agent or team member.")}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Tasks
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(t.id)}
                  className="text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {t.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <h4 className={`text-sm font-semibold ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      {t.isAgent ? <Bot className="w-3.5 h-3.5 text-indigo-400" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                      {t.assignee}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> Due {t.due}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  t.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {t.priority}
                </span>
                <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
