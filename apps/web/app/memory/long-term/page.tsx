'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Database, Search, Trash2, Sparkles, RefreshCw, Layers } from 'lucide-react';

const memorySubnav = [
  { label: 'Memory Hub', href: '/memory' },
  { label: 'Session Memory', href: '/memory/session' },
  { label: 'Long-Term Storage', href: '/memory/long-term' },
  { label: 'Context Windows', href: '/memory/context' },
  { label: 'Memory Settings', href: '/memory/settings' },
];

const mockLongTerm = [
  {
    id: 'lt-1',
    concept: 'Food Delivery System Core Architecture Blueprint',
    embeddingDimensions: 1536,
    indexedFrom: 'Nexus_AI_Architecture.md',
    tokens: 1240,
    created: 'Sep 4, 2026',
    vectorSnippet: '[-0.0124, 0.0892, -0.0412, ...]'
  },
  {
    id: 'lt-2',
    concept: 'OpenAI Consensus Critic Consensus Protocol',
    embeddingDimensions: 1536,
    indexedFrom: 'System Multi-Agent Specification',
    tokens: 890,
    created: 'Sep 5, 2026',
    vectorSnippet: '[0.0481, -0.0118, 0.0715, ...]'
  },
  {
    id: 'lt-3',
    concept: 'PostgreSQL pgvector IVFFlat vs HNSW Recall Benchmarks',
    embeddingDimensions: 1536,
    indexedFrom: 'Performance Benchmark Log',
    tokens: 640,
    created: 'Sep 6, 2026',
    vectorSnippet: '[-0.0381, 0.0219, -0.0094, ...]'
  }
];

export default function LongTermMemoryPage() {
  const [items, setItems] = useState(mockLongTerm);
  const [search, setSearch] = useState('');

  const filtered = items.filter(i =>
    i.concept.toLowerCase().includes(search.toLowerCase()) ||
    i.indexedFrom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Long-Term Vector Memory (pgvector)"
      subtitle="Persistent semantic vector database enabling cross-session knowledge recall and RAG grounding"
      subnav={memorySubnav}
      actions={
        <button
          onClick={() => alert("Vacuuming and optimizing pgvector HNSW index.")}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Optimize Vector Index
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vector memories by concept or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Vectors Indexed
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">{item.concept}</h4>
                </div>
                <div className="font-mono text-xs text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                  {item.vectorSnippet}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Source: <strong className="text-slate-200">{item.indexedFrom}</strong></span>
                  <span>•</span>
                  <span>{item.tokens} tokens</span>
                  <span>•</span>
                  <span>{item.embeddingDimensions} dimensions</span>
                  <span>•</span>
                  <span>{item.created}</span>
                </div>
              </div>

              <button
                onClick={() => setItems(items.filter(x => x.id !== item.id))}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors self-end sm:self-center"
                title="Delete Vector"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
