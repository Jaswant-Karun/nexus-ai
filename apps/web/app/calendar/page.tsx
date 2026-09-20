'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Bot, 
  User, 
  CheckCircle2 
} from 'lucide-react';

const calendarSubnav = [
  { label: 'Calendar Overview', href: '/calendar' },
  { label: 'Upcoming Events', href: '/calendar/events' },
  { label: 'Scheduled Tasks', href: '/calendar/tasks' },
  { label: 'Sprint Planner', href: '/calendar/planner' },
  { label: 'Agent Schedule', href: '/calendar/schedule' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarHubPage() {
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  const sampleCalendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const hasEvent = day === 6 || day === 8 || day === 12 || day === 15;
    return {
      day,
      hasEvent,
      events: day === 6 ? ['Agent Consensus Check', 'Food Delivery DAG Run'] :
              day === 8 ? ['Sprint 14 Retrospective'] :
              day === 12 ? ['pgvector Re-indexing'] :
              day === 15 ? ['SOC2 Audit Milestone'] : []
    };
  });

  return (
    <ModuleLayout
      title="Unified Calendar & Schedule"
      subtitle="Synchronize human milestones, automated workflow cron runs, and agent sync meetings"
      subnav={calendarSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("New Event Dialog: Schedule a meeting, recurring DAG cron, or deadline.")}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Event
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white text-sm">{currentMonth}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-0.5">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-2xl">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/80 text-center py-2.5 text-xs font-semibold text-slate-400">
            {daysOfWeek.map(d => <span key={d}>{d}</span>)}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/80">
            {sampleCalendarDays.map((d) => (
              <div
                key={d.day}
                className={`min-h-[100px] p-2 hover:bg-slate-800/20 transition-colors ${
                  d.day === 6 ? 'bg-indigo-950/20 ring-1 ring-inset ring-indigo-500/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className={`font-mono font-semibold ${
                    d.day === 6 ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}>
                    {d.day}
                  </span>
                  {d.day === 6 && (
                    <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">Today</span>
                  )}
                </div>

                <div className="space-y-1">
                  {d.events.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-1 rounded bg-slate-950 border border-slate-800/90 text-[10px] text-slate-300 font-medium truncate"
                      title={ev}
                    >
                      {ev}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
