'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Search, Network, Sparkles, ArrowRight, CornerDownRight } from 'lucide-react';

const kgSubnav = [
  { label: 'Graph Hub', href: '/knowledge-graph' },
  { label: 'Spatial Visualization', href: '/knowledge-graph/visualization' },
  { label: 'Entity Nodes', href: '/knowledge-graph/nodes' },
  { label: 'Relationships', href: '/knowledge-graph/relationships' },
  { label: 'Graph Search', href: '/knowledge-graph/search' },
];

export default function KnowledgeGraphSearchPage() {
  const [cypherQuery, setCypherQuery] = useState('MATCH (a:Agent)-[r:ORCHESTRATES]->(w:Workflow) RETURN a, r, w');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([
    { path: 'NEXUS Master Orchestrator -> [ORCHESTRATES] -> Food Delivery System DAG', confidence: '1.00' },
    { path: 'NEXUS Master Orchestrator -> [ORCHESTRATES] -> PostgreSQL pgvector Sync', confidence: '0.98' }
  ]);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  return (
    <ModuleLayout
      title="Graph Query & Multi-Hop Path Search"
      subtitle="Execute relational traversals across ontology nodes and semantic edge links"
      subnav={kgSubnav}
    >
      <div className="space-y-6">
        <form onSubmit={handleRun} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" /> Graph Traversal Query
          </h3>

          <textarea
            rows={3}
            value={cypherQuery}
            onChange={(e) => setCypherQuery(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-indigo-300 focus:border-indigo-500 outline-none resize-none"
            placeholder="MATCH (n)-[r]->(m) RETURN n, r, m..."
          />

          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> {searching ? 'Traversing Graph Triples...' : 'Execute Path Query'}
          </button>
        </form>

        {/* Path Results */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Discovered Traversal Paths</h4>
          {results.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-mono">
                <CornerDownRight className="w-4 h-4 text-indigo-400" />
                <span>{r.path}</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">Match: {r.confidence}</span>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
