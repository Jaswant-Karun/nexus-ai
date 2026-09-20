'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Search, ArrowRight, Layers, Bot, Database, Calendar } from 'lucide-react';

const searchSubnav = [
  { label: 'Search Home', href: '/search' },
  { label: 'Semantic Search', href: '/search/semantic' },
  { label: 'Advanced Filters', href: '/search/advanced' },
  { label: 'Saved Queries', href: '/search/saved' },
  { label: 'Search History', href: '/search/history' },
];

export default function SearchAdvancedPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [model, setModel] = useState('all');
  const [author, setAuthor] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search/results?q=${encodeURIComponent(keyword)}&cat=${category}&model=${model}`);
  };

  return (
    <ModuleLayout
      title="Parametric & Faceted Search"
      subtitle="Refine multi-entity search across metadata attributes, authors, model families, and time ranges"
      subnav={searchSubnav}
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Advanced Filter Criteria
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Keyword or Query Phrase
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Food Delivery Dispatch Schema"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Entity Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="all">All Entities</option>
                <option value="workflows">Workflow DAGs</option>
                <option value="documents">Storage Documents & Markdown</option>
                <option value="agents">Agent Personas & Memories</option>
                <option value="reports">Audit Reports & Whitepapers</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Model Family
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="all">Any Model Provider</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
                <option value="gemini">Google Gemini 1.5 Pro</option>
                <option value="deepseek">DeepSeek V3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Created By / Contributor
              </label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="all">Anyone</option>
                <option value="jaswant">Jaswant Karun</option>
                <option value="agents">Autonomous Agents</option>
                <option value="system">System Background Jobs</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Timestamp Window
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Run Parametric Search
        </button>
      </form>
    </ModuleLayout>
  );
}
