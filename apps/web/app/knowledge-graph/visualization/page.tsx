'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Bot, 
  Database, 
  FileText, 
  GitFork, 
  ArrowLeft 
} from 'lucide-react';

const kgSubnav = [
  { label: 'Graph Hub', href: '/knowledge-graph' },
  { label: 'Spatial Visualization', href: '/knowledge-graph/visualization' },
  { label: 'Entity Nodes', href: '/knowledge-graph/nodes' },
  { label: 'Relationships', href: '/knowledge-graph/relationships' },
  { label: 'Graph Search', href: '/knowledge-graph/search' },
];

export default function KnowledgeGraphVisualizationPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>('node-orchestrator');

  const nodes = [
    { id: 'node-orchestrator', label: 'Master Orchestrator', type: 'Agent', x: 420, y: 220, color: 'bg-indigo-500' },
    { id: 'node-critic', label: 'Critic Agent 3', type: 'Agent', x: 220, y: 120, color: 'bg-indigo-500' },
    { id: 'node-food-wf', label: 'Food Delivery DAG', type: 'Workflow', x: 620, y: 120, color: 'bg-violet-500' },
    { id: 'node-pgvector', label: 'pgvector Vector Store', type: 'Database', x: 300, y: 380, color: 'bg-emerald-500' },
    { id: 'node-spec', label: 'Nexus_AI_Architecture.md', type: 'Document', x: 560, y: 360, color: 'bg-amber-500' },
  ];

  return (
    <ModuleLayout
      title="Interactive Spatial Entity Graph"
      subtitle="Force-directed visual relationship map of agents, knowledge assets, and microservices"
      subnav={kgSubnav}
      actions={
        <Link
          href="/knowledge-graph"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
        </Link>
      }
    >
      <div className="relative h-[600px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* SVG Linking Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800 stroke-[1.5]">
          <line x1="420" y1="220" x2="220" y2="120" strokeDasharray="4 4" className="stroke-indigo-500/50" />
          <line x1="420" y1="220" x2="620" y2="120" className="stroke-indigo-500/50" />
          <line x1="420" y1="220" x2="300" y2="380" className="stroke-emerald-500/50" />
          <line x1="420" y1="220" x2="560" y2="360" className="stroke-amber-500/50" />
        </svg>

        {/* Node Elements */}
        {nodes.map(n => (
          <div
            key={n.id}
            onClick={() => setSelectedNode(n.id)}
            style={{ left: `${n.x - 70}px`, top: `${n.y - 35}px` }}
            className={`absolute w-36 p-2.5 rounded-xl border cursor-pointer transition-all shadow-xl backdrop-blur text-center ${
              selectedNode === n.id
                ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-500/30'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
              {n.type}
            </span>
            <div className="text-xs font-bold text-white truncate">{n.label}</div>
          </div>
        ))}

        {/* Floating Detail Overlay */}
        <div className="absolute top-4 right-4 z-20 w-72 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur shadow-xl space-y-2">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Inspected Entity: {selectedNode}
          </div>
          <div className="text-xs text-slate-300">
            Connected via 4 semantic triples:
            <ul className="list-disc pl-4 mt-1 text-slate-400 space-y-0.5 font-mono text-[11px]">
              <li>DEPLOYS Food Delivery DAG</li>
              <li>QUERIES pgvector</li>
              <li>VERIFIES WITH Critic 3</li>
              <li>SYNTHESIZES Nexus_AI_Architecture.md</li>
            </ul>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
