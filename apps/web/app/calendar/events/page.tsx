'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Calendar, Clock, Plus, Bot, User, MapPin, Tag } from 'lucide-react';

const calendarSubnav = [
  { label: 'Calendar Overview', href: '/calendar' },
  { label: 'Upcoming Events', href: '/calendar/events' },
  { label: 'Scheduled Tasks', href: '/calendar/tasks' },
  { label: 'Sprint Planner', href: '/calendar/planner' },
  { label: 'Agent Schedule', href: '/calendar/schedule' },
];

const mockEvents = [
  {
    id: 'ev-1',
    title: 'Multi-Agent Consensus & Schema Verification Checkpoint',
    date: 'Today, 4:00 PM UTC',
    duration: '45 mins',
    attendees: ['Jaswant Karun', 'OpenAI Consensus Critic', 'NEXUS Master Orchestrator'],
    type: 'Agent Sync',
    location: 'NEXUS Audio Space & Workspace Canvas'
  },
  {
    id: 'ev-2',
    title: 'Sprint 14 Retrospective & DAG Optimization Review',
    date: 'Sep 8, 2026, 2:00 PM UTC',
    duration: '1 hr',
    attendees: ['Engineering Team', 'DevOps Lead'],
    type: 'Team Meeting',
    location: 'Google Meet'
  },
  {
    id: 'ev-3',
    title: 'Continuous pgvector Embedding Sync & Benchmark',
    date: 'Sep 12, 2026, 12:00 AM UTC',
    duration: '30 mins',
    attendees: ['Data Pipeline Worker (Gemini 1.5 Pro)'],
    type: 'Automated Job',
    location: 'Cluster Worker Node #4'
  }
];

export default function CalendarEventsPage() {
  return (
    <ModuleLayout
      title="Upcoming Events & Agent Syncs"
      subtitle="Scheduled sync meetings, consensus review milestones, and automated calendar triggers"
      subnav={calendarSubnav}
      actions={
        <button
          onClick={() => alert("Schedule new event modal")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Event
        </button>
      }
    >
      <div className="space-y-4">
        {mockEvents.map(ev => (
          <div
            key={ev.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                  ev.type === 'Agent Sync' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                  ev.type === 'Team Meeting' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                }`}>
                  {ev.type}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {ev.date} ({ev.duration})
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{ev.title}</h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {ev.location}
                </span>
                <span>•</span>
                <span>{ev.attendees.length} Attendees ({ev.attendees.join(', ')})</span>
              </div>
            </div>

            <div className="self-end sm:self-center">
              <button
                onClick={() => alert(`Opening event room for ${ev.title}`)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                Join Event Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
