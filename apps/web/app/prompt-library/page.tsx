'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  Play, 
  Sparkles, 
  Tag, 
  Filter 
} from 'lucide-react';

const studioSubnav = [
  { label: 'Playground', href: '/playground' },
  { label: 'Prompt Library', href: '/prompt-library' },
  { label: 'Prompt Builder', href: '/prompt-builder' },
  { label: 'Response Viewer', href: '/response-viewer' },
  { label: 'Agent Canvas', href: '/canvas' },
];

const mockPrompts = [
  {
    id: 'system-architect',
    title: 'Autonomous Multi-Agent System Architect',
    description: 'Deconstruct complex enterprise technical requirements into microservice DAG nodes with formal contracts.',
    category: 'Architecture',
    prompt: `You are an elite Autonomous System Architect. Given the user goal {{goal}}, produce:
1. High-level architecture topology with microservice boundaries
2. Inter-agent communication protocols (gRPC or NATS event streams)
3. Data persistence strategy with schema migrations
4. Failure mode recovery and backoff criteria.`,
    variables: ['goal'],
    uses: '2.4k'
  },
  {
    id: 'code-review-critic',
    title: 'Zero-Tolerance Security & Code Reviewer',
    description: 'Inspect pull requests and code snippets for OWASP vulnerabilities, memory leaks, and concurrency deadlocks.',
    category: 'Security',
    prompt: `You are a Principal Security Auditor. Analyze the provided code:
\`\`\`{{language}}
{{code}}
\`\`\`
Check specifically for:
- Input sanitization & SQL/Prompt Injection
- Race conditions & unhandled Promise rejections
- Memory leaks & unbounded buffers
Rate severity: Critical, High, Medium, Low.`,
    variables: ['language', 'code'],
    uses: '1.8k'
  },
  {
    id: 'sql-schema-generator',
    title: 'High-Scale PostgreSQL Schema Synthesizer',
    description: 'Generates normalized relational schemas with pgvector embedding columns and optimal index structures.',
    category: 'Database',
    prompt: `Design a production-ready PostgreSQL 16 schema for {{domain}}. Include:
- Primary UUID keys and Foreign key constraints
- Vector embedding column: embedding vector(1536)
- HNSW or IVFFlat index specifications
- Updated_at automatic triggers.`,
    variables: ['domain'],
    uses: '950'
  }
];

export default function PromptLibraryPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Architecture', 'Security', 'Database'];

  const filtered = mockPrompts.filter(p => {
    const matchesCat = category === 'All' || p.category === category;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ModuleLayout
      title="Enterprise Prompt Library"
      subtitle="Curated, tested, and version-controlled prompt templates for autonomous agent roles"
      subnav={studioSubnav}
      actions={
        <Link
          href="/prompt-builder"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Template
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === c
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search prompt templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Prompt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{item.uses} runs</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 line-clamp-3 mb-4">
                  {item.prompt}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {item.variables.map(v => (
                    <span key={v} className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {'{{'}{v}{'}}'}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(item.id, item.prompt)}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </button>

                  <Link
                    href={`/playground?prompt=${encodeURIComponent(item.prompt)}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 shadow"
                  >
                    <Play className="w-3 h-3 fill-current" /> Open in Lab
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
