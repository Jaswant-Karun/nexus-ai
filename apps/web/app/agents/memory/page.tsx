'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Database, 
  Brain, 
  Search, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Marketplace', href: '/agents/marketplace' },
  { label: 'Agent Memory', href: '/agents/memory' },
  { label: 'Performance', href: '/agents/performance' },
  { label: 'Audit Logs', href: '/agents/logs' },
  { label: 'Fleet Settings', href: '/agents/settings' },
];

const mockMemories = [
  {
    id: 'mem-101',
    agent: 'NEXUS Master Orchestrator',
    concept: 'Food Delivery Dispatch State Machine',
    embeddingPreview: '[0.0124, -0.0481, 0.0892, 0.1245, ... 1536 dim]',
    tokens: 420,
    confidence: '99.2%',
    lastAccessed: '14 minutes ago',
    source: 'Workflow: Food Delivery System'
  },
  {
    id: 'mem-102',
    agent: 'Deep Research Agent',
    concept: 'PostgreSQL pgvector IVFFlat vs HNSW Recall Latency Benchmark',
    embeddingPreview: '[-0.0381, 0.0921, -0.0118, 0.0441, ... 1536 dim]',
    tokens: 610,
    confidence: '98.7%',
    lastAccessed: '1 hour ago',
    source: 'Technical Architecture Synthesis'
  },
  {
    id: 'mem-103',
    agent: 'OpenAI Consensus Critic (Agent 3)',
    concept: 'Zero-Tolerance Prompt Injection Redaction Rules',
    embeddingPreview: '[0.0712, 0.0219, -0.0882, 0.0315, ... 1536 dim]',
    tokens: 380,
    confidence: '99.6%',
    lastAccessed: '3 hours ago',
    source: 'Security Policy Baseline'
  }
];

export default function AgentMemoryPage() {
  const [memories, setMemories] = useState(mockMemories);
  const [search, setSearch] = useState('');

  const filtered = memories.filter(m =>
    m.concept.toLowerCase().includes(search.toLowerCase()) ||
    m.agent.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  return (
    <ModuleLayout
      title="Agent Cognitive & Semantic Memory"
      subtitle="Inspect, index, and curate long-term vector embeddings and episodic memory buffers across agents"
      subnav={agentsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Memory synchronization triggered across PostgreSQL pgvector clusters.")}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-index Vectors
          </button>
          <Link
            href="/knowledge-graph"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5" /> Knowledge Graph View
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts or semantic embeddings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Vectors Stored
          </span>
        </div>

        {/* Memory Cards */}
        <div className="space-y-3">
          {filtered.map(mem => (
            <div
              key={mem.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {mem.agent}
                  </span>
                  <h4 className="text-sm font-bold text-white">{mem.concept}</h4>
                </div>

                <div className="font-mono text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 inline-block">
                  {mem.embeddingPreview}
                </div>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                  <span>Source: <strong className="text-slate-300 font-medium">{mem.source}</strong></span>
                  <span>•</span>
                  <span>{mem.tokens} tokens</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{mem.confidence} semantic match</span>
                  <span>•</span>
                  <span>Accessed {mem.lastAccessed}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleDelete(mem.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Purge Vector Memory"
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
