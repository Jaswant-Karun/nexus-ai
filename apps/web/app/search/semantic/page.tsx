'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Database, Sparkles, Search, Sliders, ArrowUpRight, Cpu } from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

export default function SearchSemanticPage() {
  const [prompt, setPrompt] = useState('How does the food delivery workflow handle consensus verification when an agent fails?');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.8);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([
    {
      concept: 'OpenAI Consensus Critic (Agent 3) Discrepancy Protocol',
      source: 'Nexus_AI_Architecture.md (Line 42)',
      score: 0.942,
      text: 'If Node 2 and Node 1 produce discordant schemas, Agent 3 recalculates the consensus vector and schedules a secondary synthesis pass.'
    },
    {
      concept: 'Temporal State Machine Compensation',
      source: 'Workflow: Food Delivery System',
      score: 0.887,
      text: 'In event of driver non-acceptance within 15 seconds, compensation logic dispatches order to secondary proximity radius.'
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  return (
    <ModuleLayout
      title="Semantic Vector & Cosine Search"
      subtitle="Query conceptual embedding space directly via PostgreSQL pgvector 1536-dimension index"
      subnav={searchSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/knowledge-graph"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Graph View
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Natural Language Meaning Query
          </h3>

          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none resize-none"
            placeholder="Type any conceptual inquiry..."
          />

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Minimum Cosine Similarity Threshold</span>
              <span className="text-emerald-400 font-mono font-bold">{(similarityThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" /> {searching ? 'Querying Vector Index...' : 'Compute Semantic Vectors'}
          </button>
        </form>

        {/* Results */}
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{r.concept}</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  {(r.score * 100).toFixed(1)}% Cosine Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                &quot;{r.text}&quot;
              </p>
              <div className="text-[11px] text-slate-500">Source: {r.source}</div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
