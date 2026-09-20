'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Layers, Search, Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { searchKnowledgeGraph } from '@/services/knowledge-graph.service';

const kgSubnav = [
  { label: 'Graph Hub', href: '/knowledge-graph' },
  { label: 'Spatial Visualization', href: '/knowledge-graph/visualization' },
  { label: 'Entity Nodes', href: '/knowledge-graph/nodes' },
  { label: 'Relationships', href: '/knowledge-graph/relationships' },
  { label: 'Graph Search', href: '/knowledge-graph/search' },
];

const mockNodes = [
  { id: 'node-1', label: 'NEXUS Master Orchestrator', category: 'Agent', degree: 14, source: 'System Core' },
  { id: 'node-2', label: 'Food Delivery System DAG', category: 'Workflow', degree: 8, source: 'User Project' },
  { id: 'node-3', label: 'PostgreSQL pgvector', category: 'Database', degree: 22, source: 'Infrastructure' },
  { id: 'node-4', label: 'OpenAI Consensus Critic (Agent 3)', category: 'Agent', degree: 11, source: 'System Core' },
  { id: 'node-5', label: 'Nexus_AI_Architecture.md', category: 'Document', degree: 6, source: 'Workspace Storage' },
];

export default function KnowledgeGraphNodesPage() {
  const [search, setSearch] = useState('');
  const [liveNodes, setLiveNodes] = useState<typeof mockNodes>([]);

  useEffect(() => {
    if (search.trim().length < 2) {
      setLiveNodes([]);
      return;
    }
    let cancelled = false;
    searchKnowledgeGraph(search.trim())
      .then((results) => {
        if (!cancelled) setLiveNodes(results.map(({ entity, degree }) => ({ id: entity.id, label: entity.label, category: entity.category, degree, source: entity.source })));
      })
      .catch(() => {
        if (!cancelled) setLiveNodes([]);
      });
    return () => { cancelled = true; };
  }, [search]);

  const sourceNodes = search.trim().length >= 2 && liveNodes.length > 0 ? liveNodes : mockNodes;
  const filtered = sourceNodes.filter(n =>
    n.label.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Knowledge Graph Entity Nodes"
      subtitle="Canonical inventory of all ontologically registered concepts, agents, and data objects"
      subnav={kgSubnav}
      actions={
        <button
          onClick={() => alert("Register new entity node modal")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Register Entity Node
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search entity nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Entities</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Node Label</th>
                <th className="px-6 py-3">Entity Type</th>
                <th className="px-6 py-3">Degree (Connections)</th>
                <th className="px-6 py-3">Origin Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(n => (
                <tr key={n.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{n.label}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {n.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{n.degree} links</td>
                  <td className="px-6 py-4 text-slate-400">{n.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleLayout>
  );
}
