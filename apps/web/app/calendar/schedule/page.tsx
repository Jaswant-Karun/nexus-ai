'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bot, Clock, ShieldCheck, CheckCircle2, Sliders, Calendar } from 'lucide-react';

const calendarSubnav = [
  { label: 'Calendar Overview', href: '/calendar' },
  { label: 'Upcoming Events', href: '/calendar/events' },
  { label: 'Scheduled Tasks', href: '/calendar/tasks' },
  { label: 'Sprint Planner', href: '/calendar/planner' },
  { label: 'Agent Schedule', href: '/calendar/schedule' },
];

const agentSchedules = [
  {
    agent: 'NEXUS Master Orchestrator (GPT-4o)',
    shift: '24/7 Continuous Duty',
    status: 'Active Duty',
    nextMaintenance: 'Sep 20, 2026 (Rolling upgrade)',
    responsibilities: 'Task decomposition, worker routing, and top-level response synthesis'
  },
  {
    agent: 'OpenAI Consensus Critic (Agent 3)',
    shift: '24/7 Real-time Verification',
    status: 'Active Duty',
    nextMaintenance: 'Zero downtime continuous hot-reload',
    responsibilities: 'Syntax critique, AST evaluation, and security policy enforcement'
  },
  {
    agent: 'Deep Research Agent (Claude 3.5)',
    shift: 'On-Demand Triggered',
    status: 'Standby Pool',
    nextMaintenance: 'Sep 25, 2026',
    responsibilities: 'Live web indexing, academic paper parsing, and RAG injection'
  },
  {
    agent: 'Full-Stack Code Synthesizer (Gemini 1.5 Pro)',
    shift: 'Nightly Batch Execution (00:00 - 04:00 UTC)',
    status: 'Scheduled',
    nextMaintenance: 'Oct 1, 2026',
    responsibilities: 'Repository-wide refactoring, database migrations, and typecheck passes'
  }
];

export default function CalendarSchedulePage() {
  return (
    <ModuleLayout
      title="Autonomous Agent Duty & Shifts"
      subtitle="Cluster worker uptime schedule, maintenance windows, and standby allocations"
      subnav={calendarSubnav}
      actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            4 of 4 Agents On Schedule
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {agentSchedules.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.agent}</h4>
                  <div className="text-xs text-indigo-400 font-medium">{item.shift}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 pl-10 leading-relaxed">
                {item.responsibilities}
              </p>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1">
                <CheckCircle2 className="w-3 h-3" /> {item.status}
              </span>
              <span className="text-[11px] text-slate-500">Maint: {item.nextMaintenance}</span>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
