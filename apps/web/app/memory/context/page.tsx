'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Layers, Sliders, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';

const memorySubnav = [
  { label: 'Memory Hub', href: '/memory' },
  { label: 'Session Memory', href: '/memory/session' },
  { label: 'Long-Term Storage', href: '/memory/long-term' },
  { label: 'Context Windows', href: '/memory/context' },
  { label: 'Memory Settings', href: '/memory/settings' },
];

export default function ContextMemoryPage() {
  const [compactionStrategy, setCompactionStrategy] = useState('semantic_summarization');
  const [maxContextBudget, setMaxContextBudget] = useState(32000);

  return (
    <ModuleLayout
      title="Dynamic Context Window Management"
      subtitle="Configure runtime context budgeting, automated compaction, and token window preservation"
      subnav={memorySubnav}
    >
      <div className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Context Budget Allocation
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Active Agent Context Window Token Limit</span>
              <span className="text-indigo-400 font-mono font-bold">{maxContextBudget.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="8000"
              max="128000"
              step="8000"
              value={maxContextBudget}
              onChange={(e) => setMaxContextBudget(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              When working memory exceeds this budget, the automatic compaction worker triggers.
            </p>
          </div>

          <div className="pt-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Context Compaction Algorithm
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'semantic_summarization', label: 'Semantic Summarization (GPT-4o)', desc: 'Compresses earlier turns into high-density declarative key-value facts.' },
                { id: 'sliding_window', label: 'FIFO Sliding Window', desc: 'Evicts oldest turns strictly by turn index when budget exceeds.' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setCompactionStrategy(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    compactionStrategy === opt.id
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">{opt.label}</div>
                  <p className="text-[11px] text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
