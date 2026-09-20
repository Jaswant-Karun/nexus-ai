'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bookmark, Search, Trash2, ArrowUpRight, Star } from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

const savedQueries = [
  { id: '1', title: 'Food Delivery System DAG & Schemas', filter: 'type:workflow,schema', date: 'Sep 4, 2026' },
  { id: '2', title: 'Agent Consensus Critic Audits', filter: 'agent:critic,tag:security', date: 'Sep 2, 2026' },
  { id: '3', title: 'pgvector Latency Benchmarks', filter: 'domain:database,dim:1536', date: 'Aug 29, 2026' },
];

export default function SearchSavedPage() {
  const [list, setList] = useState(savedQueries);

  const handleRemove = (id: string) => {
    setList(list.filter(x => x.id !== id));
  };

  return (
    <ModuleLayout
      title="Saved Search Queries & Filters"
      subtitle="Quick-launch persistent search filters and complex multi-parameter queries"
      subnav={searchSubnav}
    >
      <div className="space-y-4">
        {list.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.filter}
                </span>
                <span>•</span>
                <span>Saved on {item.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRemove(item.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Remove Saved Query"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link
                href={`/search/results?q=${encodeURIComponent(item.title)}`}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow"
              >
                Execute <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
