'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { CheckCircle2, Circle, Clock, Bot, User, Calendar as CalendarIcon } from 'lucide-react';

const calendarSubnav = [
  { label: 'Calendar Overview', href: '/calendar' },
  { label: 'Upcoming Events', href: '/calendar/events' },
  { label: 'Scheduled Tasks', href: '/calendar/tasks' },
  { label: 'Sprint Planner', href: '/calendar/planner' },
  { label: 'Agent Schedule', href: '/calendar/schedule' },
];

const scheduledTasks = [
  {
    id: 'cal-tsk-1',
    time: '09:00 AM',
    title: 'Cluster Health & Microservice Heartbeat Ingest',
    assignee: 'FastAPI AI Service Monitor',
    isAgent: true,
    completed: true
  },
  {
    id: 'cal-tsk-2',
    time: '11:30 AM',
    title: 'Food Delivery System DAG Schema Synthesis',
    assignee: 'NEXUS Master Orchestrator (GPT-4o)',
    isAgent: true,
    completed: true
  },
  {
    id: 'cal-tsk-3',
    time: '02:00 PM',
    title: 'OpenAI Consensus Critic (Agent 3) Discrepancy Review',
    assignee: 'Jaswant Karun',
    isAgent: false,
    completed: false
  },
  {
    id: 'cal-tsk-4',
    time: '04:30 PM',
    title: 'Automated pgvector IVFFlat Index Vacuum',
    assignee: 'PostgreSQL Database Engine',
    isAgent: true,
    completed: false
  }
];

export default function CalendarTasksPage() {
  const [tasks, setTasks] = useState(scheduledTasks);

  const toggle = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <ModuleLayout
      title="Daily Scheduled Tasks & Queue"
      subtitle="Chronological timeline of automated jobs and scheduled agent tasks for today"
      subnav={calendarSubnav}
      actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Today: September 6, 2026</span>
        </div>
      }
    >
      <div className="space-y-4">
        {tasks.map(t => (
          <div
            key={t.id}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-indigo-400 font-semibold w-16 flex-shrink-0">
                {t.time}
              </span>
              <button onClick={() => toggle(t.id)} className="text-slate-500 hover:text-emerald-400">
                {t.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
              </button>
              <div>
                <h4 className={`text-sm font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {t.title}
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  {t.isAgent ? <Bot className="w-3.5 h-3.5 text-indigo-400" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{t.assignee}</span>
                </div>
              </div>
            </div>

            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              t.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {t.completed ? 'Executed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
