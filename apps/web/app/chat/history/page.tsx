'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Trash2, 
  ArrowUpRight, 
  Sparkles, 
  Tag, 
  Filter 
} from 'lucide-react';

const chatSubnav = [
  { label: 'Active Chat', href: '/chat' },
  { label: 'New Conversation', href: '/chat/new' },
  { label: 'History', href: '/chat/history' },
  { label: 'Share', href: '/chat/share' },
  { label: 'Export', href: '/chat/export' },
];

const mockThreads = [
  {
    id: 'thread-food-delivery',
    title: 'Food Delivery System Architecture',
    preview: 'Generated 4-agent collaborative design diagram and schema for real-time dispatch...',
    model: 'Nexus Auto (GPT-4o)',
    date: 'Today, 2:15 PM',
    messagesCount: 14,
    tags: ['Architecture', 'Agents']
  },
  {
    id: 'thread-pgvector-optim',
    title: 'Postgres pgvector Index Optimization',
    preview: 'Comparing HNSW versus IVFFlat indexes for 1536-dimension OpenAI text-embedding-3-small...',
    model: 'Claude 3.5 Sonnet',
    date: 'Yesterday',
    messagesCount: 8,
    tags: ['Database', 'RAG']
  },
  {
    id: 'thread-n8n-webhook',
    title: 'n8n Webhook & Microservice Resilience',
    preview: 'Designing exponential backoff and dead-letter queues for n8n execution failures...',
    model: 'DeepSeek V3',
    date: 'Sep 3, 2026',
    messagesCount: 22,
    tags: ['Orchestration']
  }
];

export default function ChatHistoryPage() {
  const [threads, setThreads] = useState(mockThreads);
  const [search, setSearch] = useState('');

  const filtered = threads.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setThreads(threads.filter(t => t.id !== id));
  };

  return (
    <ModuleLayout
      title="Conversation Archives"
      subtitle="Search, resume, and organize your past multi-model dialogue sessions"
      subnav={chatSubnav}
      actions={
        <Link
          href="/chat/new"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Start New Session
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations by keywords or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} Archived {filtered.length === 1 ? 'Thread' : 'Threads'}
          </div>
        </div>

        {/* Thread List */}
        <div className="space-y-3">
          {filtered.map(thread => (
            <div 
              key={thread.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {thread.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {thread.model}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {thread.preview}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {thread.date}
                  </span>
                  <span>•</span>
                  <span>{thread.messagesCount} turns</span>
                  <div className="flex items-center gap-1 ml-2">
                    {thread.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/chat?session=${thread.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 shadow"
                >
                  Resume <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(thread.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Thread"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
