'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Share2, Search, Plus, ArrowRight } from 'lucide-react';

const kgSubnav = [
  { label: 'Graph Hub', href: '/knowledge-graph' },
  { label: 'Spatial Visualization', href: '/knowledge-graph/visualization' },
  { label: 'Entity Nodes', href: '/knowledge-graph/nodes' },
  { label: 'Relationships', href: '/knowledge-graph/relationships' },
  { label: 'Graph Search', href: '/knowledge-graph/search' },
];

const mockTriples = [
  { source: 'NEXUS Master Orchestrator', predicate: 'ORCHESTRATES', target: 'Food Delivery System DAG', confidence: '1.00' },
  { source: 'Food Delivery System DAG', predicate: 'DEPENDS_ON', target: 'OpenAI Consensus Critic', confidence: '0.99' },
  { source: 'OpenAI Consensus Critic', predicate: 'VERIFIES', target: 'Nexus_AI_Architecture.md', confidence: '0.98' },
  { source: 'Food Delivery System DAG', predicate: 'PERSISTS_TO', target: 'PostgreSQL pgvector', confidence: '1.00' },
  { source: 'Deep Research Agent', predicate: 'QUERIES', target: 'Google Search API', confidence: '0.95' },
];

export default function KnowledgeGraphRelationshipsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockTriples.filter(t =>
    t.source.toLowerCase().includes(search.toLowerCase()) ||
    t.predicate.toLowerCase().includes(search.toLowerCase()) ||
    t.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Graph Semantic Relationship Triples"
      subtitle="Subject-Predicate-Object bindings enforcing formal enterprise knowledge topology"
      subnav={kgSubnav}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search relationship triples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Triples</span>
        </div>

        <div className="space-y-3">
          {filtered.map((triple, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-white bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {triple.source}
                </span>
                <span className="font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  [{triple.predicate}]
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-white bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  {triple.target}
                </span>
              </div>

              <span className="text-emerald-400 font-mono text-[11px] self-end sm:self-center">
                Confidence: {triple.confidence}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
