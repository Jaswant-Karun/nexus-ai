'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Search as SearchIcon, 
  FileText, 
  GitFork, 
  Bot, 
  ArrowUpRight, 
  Database, 
  Sparkles 
} from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

const mockResults = [
  {
    id: 'res-1',
    title: 'Food Delivery System Architecture',
    category: 'Workflow DAG',
    icon: GitFork,
    url: '/workflow',
    snippet: 'Autonomous 4-agent pipeline generating complete backend, database schemas, and API contracts.',
    matchScore: '99.4%'
  },
  {
    id: 'res-2',
    title: 'Nexus_AI_Architecture.md',
    category: 'Storage Document',
    icon: FileText,
    url: '/storage',
    snippet: 'System specifications, multi-agent protocol details, and pgvector schema architecture.',
    matchScore: '98.1%'
  },
  {
    id: 'res-3',
    title: 'OpenAI Consensus Critic (Agent 3)',
    category: 'Agent Persona',
    icon: Bot,
    url: '/agents',
    snippet: 'Cross-verifies code, detects logic bugs, and prevents hallucinated statements.',
    matchScore: '96.5%'
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Food Delivery';
  const [term, setTerm] = useState(query);

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="text-xs text-slate-400">
        Showing 3 results for &quot;<strong className="text-slate-200">{query}</strong>&quot; (0.042s)
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {mockResults.map(r => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  <Icon className="w-3.5 h-3.5" /> {r.category}
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">{r.matchScore} match</span>
              </div>

              <Link href={r.url} className="block">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  {r.title} <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300" />
                </h3>
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed">
                {r.snippet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <ModuleLayout
      title="Search Results"
      subtitle="Ranked semantic and lexical matches across the unified platform workspace"
      subnav={searchSubnav}
    >
      <Suspense fallback={<div className="text-slate-400 text-xs">Loading search results...</div>}>
        <SearchResultsContent />
      </Suspense>
    </ModuleLayout>
  );
}
