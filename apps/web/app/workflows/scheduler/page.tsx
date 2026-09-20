'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Play, 
  CheckCircle2, 
  Pause, 
  Trash2, 
  GitFork 
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Templates', href: '/workflows/templates' },
  { label: 'Live Execution', href: '/workflows/execution' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
  { label: 'Analytics', href: '/workflows/analytics' },
];

const schedules = [
  {
    id: 'sch-1',
    workflow: 'PostgreSQL pgvector Continuous Sync',
    cron: '0 */3 * * *',
    humanReadable: 'Every 3 hours',
    status: 'Active',
    nextRun: 'In 1 hour 24 min',
    timezone: 'UTC'
  },
  {
    id: 'sch-2',
    workflow: 'Multi-Agent Security Audit & Dependency Check',
    cron: '0 2 * * *',
    humanReadable: 'Daily at 02:00 UTC',
    status: 'Active',
    nextRun: 'Tonight at 02:00 UTC',
    timezone: 'UTC'
  },
  {
    id: 'sch-3',
    workflow: 'Nexus Multi-Agent Collaboration Benchmark',
    cron: '0 0 * * 0',
    humanReadable: 'Every Sunday at midnight',
    status: 'Paused',
    nextRun: 'Paused by Jaswant Karun',
    timezone: 'UTC'
  }
];

export default function WorkflowSchedulerPage() {
  const [list, setList] = useState(schedules);

  const toggleStatus = (id: string) => {
    setList(list.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' };
      }
      return s;
    }));
  };

  return (
    <ModuleLayout
      title="Workflow Cron & Job Scheduler"
      subtitle="Configure autonomous recurring execution cadences, temporal queues, and timezones"
      subnav={workflowsSubnav}
      actions={
        <button
          onClick={() => alert("New scheduler dialog: Enter Cron expression and choose workflow DAG.")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule New DAG
        </button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {list.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-mono text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.workflow}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {item.cron}
                      </span>
                      <span className="text-xs text-slate-400">({item.humanReadable})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Next Run: <strong className="text-slate-300 font-normal">{item.nextRun}</strong>
                  </span>
                  <span>•</span>
                  <span>Timezone: {item.timezone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    item.status === 'Active'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {item.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {item.status === 'Active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
