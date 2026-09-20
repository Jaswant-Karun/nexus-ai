'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Search as SearchIcon, 
  Sparkles, 
  Database, 
  FileText, 
  Bot, 
  GitFork, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

export default function SearchHubPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <ModuleLayout
      title="Universal Neural Search Engine"
      subtitle="Hybrid search combining dense pgvector embeddings with lexical full-text index across files, agents, and DAGs"
      subnav={searchSubnav}
    >
      <div className="max-w-3xl mx-auto py-12 space-y-10 text-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid pgvector + BM25 Search</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Search Everything Across Your Cluster
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Find documents, prompt templates, agent memory embeddings, and workflow execution nodes with semantic precision.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question or search for agents, workflows, schemas, code..."
            className="w-full pl-12 pr-28 py-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xl transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1"
          >
            Search <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Popular searches suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Popular:</span>
          {[
            'Food Delivery System DAG',
            'pgvector IVFFlat indexes',
            'OpenAI Consensus Critic',
            'Nexus_AI_Architecture.md',
            'gVisor Docker Sandbox'
          ].map(tag => (
            <button
              key={tag}
              onClick={() => router.push(`/search/results?q=${encodeURIComponent(tag)}`)}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Category Launchers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <Link
            href="/search/semantic"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <Database className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Semantic Vector Search
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Search by conceptual meaning rather than exact keyword string matching.
            </p>
          </Link>

          <Link
            href="/search/advanced"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <Layers className="w-5 h-5 text-violet-400 mb-2" />
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Advanced Filters
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Filter by model provider, token size, author, timestamp, and metadata tags.
            </p>
          </Link>

          <Link
            href="/knowledge-graph"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Knowledge Graph
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Traverse multi-hop relationships between entities and agent knowledge.
            </p>
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}
