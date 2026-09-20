'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Layers, Sparkles, Plus, Calendar, Clock, Bot } from 'lucide-react';

const calendarSubnav = [
  { label: 'Calendar Overview', href: '/calendar' },
  { label: 'Upcoming Events', href: '/calendar/events' },
  { label: 'Scheduled Tasks', href: '/calendar/tasks' },
  { label: 'Sprint Planner', href: '/calendar/planner' },
  { label: 'Agent Schedule', href: '/calendar/schedule' },
];

const sprintWeeks = [
  {
    week: 'Week 1: Sep 1 - Sep 7',
    focus: 'Consensus verification & multi-agent pipeline stability',
    capacity: '85% allocated',
    agentHours: '320 Autonomous Agent Compute Hours',
    items: [
      'Food Delivery System DAG compilation (Done)',
      'Critic Agent 3 consensus verification (In Progress)',
      'pgvector HNSW index benchmarks (Done)'
    ]
  },
  {
    week: 'Week 2: Sep 8 - Sep 14',
    focus: 'gVisor Docker sandbox & enterprise tenant management',
    capacity: '40% allocated',
    agentHours: '240 Scheduled Agent Compute Hours',
    items: [
      'Implement multi-tenant organization invite flow',
      'Container micro-VM isolation test runs',
      'Production cluster load test'
    ]
  }
];

export default function CalendarPlannerPage() {
  return (
    <ModuleLayout
      title="Sprint & Capacity Planner"
      subtitle="Plan sprint goals, allocate agent inference compute budgets, and forecast delivery timelines"
      subnav={calendarSubnav}
      actions={
        <button
          onClick={() => alert("Generate sprint plan from backlog using AI Copilot.")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Sprint Forecasting
        </button>
      }
    >
      <div className="space-y-6">
        {sprintWeeks.map((s, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{s.week}</h3>
                <p className="text-xs text-indigo-400 font-medium">{s.focus}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <span className="font-mono text-emerald-400 font-semibold">{s.capacity}</span>
                <div className="text-[11px] text-slate-500">{s.agentHours}</div>
              </div>
            </div>

            <div className="space-y-2">
              {s.items.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>{item}</span>
                  <span className="text-[10px] font-mono text-slate-500">Planned</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
