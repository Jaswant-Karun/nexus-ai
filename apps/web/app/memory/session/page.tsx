'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Clock, Trash2, RotateCcw, Bot, Database } from 'lucide-react';

const memorySubnav = [
  { label: 'Memory Hub', href: '/memory' },
  { label: 'Session Memory', href: '/memory/session' },
  { label: 'Long-Term Storage', href: '/memory/long-term' },
  { label: 'Context Windows', href: '/memory/context' },
  { label: 'Memory Settings', href: '/memory/settings' },
];

const mockSessions = [
  {
    id: 'sess-active-copilot',
    channel: 'AI Chat Copilot (/chat)',
    activeAgent: 'NEXUS Auto (GPT-4o)',
    tokensInContext: '4,280 / 128,000',
    turns: 12,
    ttl: '18 hours remaining'
  },
  {
    id: 'sess-food-wf',
    channel: 'Workflow Runner (Food Delivery System)',
    activeAgent: 'OpenAI Consensus Critic (Agent 3)',
    tokensInContext: '8,910 / 128,000',
    turns: 4,
    ttl: '23 hours remaining'
  }
];

export default function SessionMemoryPage() {
  const [sessions, setSessions] = useState(mockSessions);

  return (
    <ModuleLayout
      title="Short-Term Working Session Memory"
      subtitle="Inspect ephemeral multi-turn context caches, tool buffers, and scratchpad states"
      subnav={memorySubnav}
      actions={
        <button
          onClick={() => alert("Session memory cache purged.")}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Purge Inactive Sessions
        </button>
      }
    >
      <div className="space-y-4">
        {sessions.map(s => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">{s.channel}</h3>
                <span className="font-mono text-xs text-slate-500">({s.id})</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Agent: <strong className="text-slate-200">{s.activeAgent}</strong></span>
                <span>•</span>
                <span>Turns: {s.turns}</span>
                <span>•</span>
                <span className="font-mono text-indigo-400">{s.tokensInContext} tokens</span>
                <span>•</span>
                <span className="text-slate-500">{s.ttl}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setSessions(sessions.filter(x => x.id !== s.id))}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Evict Session Cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
