'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Bot, 
  User, 
  ArrowRight, 
  Layers 
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

const milestones = [
  {
    phase: 'Phase 1: Architecture & Data Modeling',
    dates: 'Sep 1 - Sep 3',
    status: 'Completed',
    progress: 100,
    deliverables: ['System specification document', 'Prisma schema with pgvector', 'Consensus verification test suite'],
    lead: 'Jaswant Karun & Orchestrator'
  },
  {
    phase: 'Phase 2: Autonomous Agent DAG Assembly',
    dates: 'Sep 4 - Sep 6',
    status: 'In Progress',
    progress: 75,
    deliverables: ['Food Delivery System DAG', 'OpenAI Consensus Critic (Agent 3) configuration', 'FastAPI backend 8001 integration'],
    lead: 'Agent 3 Critic'
  },
  {
    phase: 'Phase 3: Production Hardening & Sandbox Verification',
    dates: 'Sep 7 - Sep 12',
    status: 'Upcoming',
    progress: 0,
    deliverables: ['gVisor Docker micro-VM isolation', 'Multi-tenant organization invite flow', 'Load testing at 1,000 req/sec'],
    lead: 'Security & DevOps Fleet'
  }
];

export default function ProjectTimelinePage() {
  return (
    <ModuleLayout
      title="Milestone Roadmap & Delivery Timeline"
      subtitle="Gantt and phase roadmap aligning multi-agent deliverables with project deadlines"
      subnav={projectsSubnav}
      actions={
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Sprint 14: Sep 1 - Sep 14, 2026</span>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="relative pl-6 border-l border-slate-800 space-y-8 my-4">
          {milestones.map((m, i) => (
            <div key={i} className="relative group">
              {/* Dot marker */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 ${
                m.status === 'Completed' ? 'bg-emerald-500' :
                m.status === 'In Progress' ? 'bg-indigo-500 ring-4 ring-indigo-500/20' :
                'bg-slate-700'
              }`} />

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{m.phase}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      m.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{m.dates}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${m.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${m.progress}%` }} 
                  />
                </div>

                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phase Deliverables
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {m.deliverables.map(d => (
                      <div key={d} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${m.status === 'Completed' ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-1">
                  Responsible Lead: <strong className="text-slate-400 font-medium">{m.lead}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
