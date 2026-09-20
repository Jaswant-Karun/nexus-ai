'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Clock, Search, Trash2, ArrowUpRight } from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

const mockHistory = [
  { id: '1', query: 'Food Delivery System DAG', timestamp: '25 minutes ago', count: '3 results' },
  { id: '2', query: 'pgvector IVFFlat vs HNSW benchmark', timestamp: '2 hours ago', count: '12 results' },
  { id: '3', query: 'OpenAI Consensus Critic (Agent 3)', timestamp: 'Yesterday', count: '8 results' },
  { id: '4', query: 'gVisor Docker micro-VM sandbox', timestamp: 'Sep 4, 2026', count: '5 results' },
];

export default function SearchHistoryPage() {
  const [history, setHistory] = useState(mockHistory);

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <ModuleLayout
      title="Recent Search History"
      subtitle="Chronological list of your previous searches, semantic lookups, and file queries"
      subnav={searchSubnav}
      actions={
        <button
          onClick={handleClear}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      }
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            Search history is empty.
          </div>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <Link
                    href={`/search/results?q=${encodeURIComponent(item.query)}`}
                    className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                  >
                    {item.query}
                  </Link>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.timestamp} • {item.count}
                  </div>
                </div>
              </div>

              <Link
                href={`/search/results?q=${encodeURIComponent(item.query)}`}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </ModuleLayout>
  );
}
