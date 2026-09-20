'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  Search, 
  BookOpen, 
  Cpu, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

const articles = [
  {
    id: 'scaling-multi-agent-consensus',
    title: 'Achieving Deterministic Consensus in Autonomous Multi-Agent Workflows',
    excerpt: 'How NEXUS AI orchestrates asynchronous agents with mathematical consensus verifiers to eliminate hallucinations and divergent execution paths.',
    author: 'Dr. Evelyn Vance',
    role: 'Chief AI Scientist',
    date: 'Sep 4, 2026',
    readTime: '6 min read',
    category: 'Engineering',
    featured: true
  },
  {
    id: 'hybrid-rag-knowledge-graphs',
    title: 'Beyond Vector Search: Hybrid RAG with Dynamic Knowledge Graphs',
    excerpt: 'Combining dense vector embeddings with Neo4j entity relationships enables sub-second context injection with 98.4% retrieval accuracy.',
    author: 'Marcus Chen',
    role: 'Staff Knowledge Architect',
    date: 'Aug 29, 2026',
    readTime: '8 min read',
    category: 'Architecture',
    featured: false
  },
  {
    id: 'enterprise-security-llm-gateways',
    title: 'Zero-Trust AI Gateways: PII Redaction & Prompt Injection Defense',
    excerpt: 'A comprehensive security framework for deploying autonomous agents across regulated healthcare and banking systems.',
    author: 'Sarah Lin',
    role: 'Head of Enterprise Security',
    date: 'Aug 21, 2026',
    readTime: '5 min read',
    category: 'Security',
    featured: false
  },
  {
    id: 'gpt-4o-vision-dag-orchestration',
    title: 'Visual DAG Generation from Natural Language Goals with GPT-4o',
    excerpt: 'Translating human intentions into topologically sorted execution graphs using our state machine compiler.',
    author: 'Jaswant Karun',
    role: 'Lead Systems Architect',
    date: 'Aug 15, 2026',
    readTime: '7 min read',
    category: 'Product',
    featured: false
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Engineering', 'Architecture', 'Security', 'Product'];

  const filteredArticles = articles.filter(a => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = articles.find(a => a.featured) || articles[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>NEXUS Engineering & AI Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
            The NEXUS Journal
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Deep technical dives into multi-agent systems, neural memory graphs, and the frontier of autonomous software engineering.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Featured Post Hero */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="mb-14 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900/90 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  Featured Research
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 hover:text-indigo-300 transition-colors cursor-pointer">
                {featured.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                    {featured.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{featured.author}</div>
                    <div className="text-[11px] text-slate-400">{featured.role}</div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Read Analysis <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <article 
              key={article.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 p-6 flex flex-col justify-between transition-all hover:bg-slate-900/90 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-medium text-slate-300 border border-slate-700">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{article.author}</span>
                <span className="text-indigo-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
