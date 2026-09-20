'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Network, 
  Share2, 
  Search, 
  Plus, 
  Database, 
  ArrowUpRight, 
  Sparkles, 
  Layers 
} from 'lucide-react';

const kgSubnav = [
  { label: 'Graph Hub', href: '/knowledge-graph' },
  { label: 'Spatial Visualization', href: '/knowledge-graph/visualization' },
  { label: 'Entity Nodes', href: '/knowledge-graph/nodes' },
  { label: 'Relationships', href: '/knowledge-graph/relationships' },
  { label: 'Graph Search', href: '/knowledge-graph/search' },
];

export default function KnowledgeGraphHubPage() {
  return (
    <ModuleLayout
      title="Multi-Agent Knowledge Graph Engine"
      subtitle="Semantic entity-relationship ontology linking agents, workflows, vector memories, and enterprise knowledge"
      subnav={kgSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/knowledge-graph/visualization"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Network className="w-3.5 h-3.5" /> Interactive 3D/2D Graph
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Entity Nodes</div>
            <div className="text-2xl font-bold text-white">1,842 Nodes</div>
            <div className="text-xs text-indigo-400 mt-1">People, Agents, Services, Tables</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Relationship Triples</div>
            <div className="text-2xl font-bold text-white">4,910 Edges</div>
            <div className="text-xs text-violet-400 mt-1">Directed semantic links</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Graph Density</div>
            <div className="text-2xl font-bold text-white">2.67 / node</div>
            <div className="text-xs text-emerald-400 mt-1">High relational connectedness</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Underlying Store</div>
            <div className="text-2xl font-bold text-white font-mono">pgvector</div>
            <div className="text-xs text-slate-500 mt-1">Graph-over-Postgres</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/knowledge-graph/visualization"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Network className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
              Spatial Visualization
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore force-directed node layouts showing agent interactions, file dependencies, and prompt connections.
            </p>
          </Link>

          <Link
            href="/knowledge-graph/nodes"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Layers className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
              Entity Nodes Index
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse tabular listings of verified concepts, tools, microservices, and databases mapped in the graph.
            </p>
          </Link>

          <Link
            href="/knowledge-graph/relationships"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Share2 className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
              Semantic Relationships
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect subject-predicate-object triples like &quot;Food Delivery DAG USES pgvector&quot;.
            </p>
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}
