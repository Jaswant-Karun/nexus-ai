'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  Bot, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Play, 
  Save, 
  Download,
  Share2
} from 'lucide-react';

const studioSubnav = [
  { label: 'Playground', href: '/playground' },
  { label: 'Prompt Library', href: '/prompt-library' },
  { label: 'Prompt Builder', href: '/prompt-builder' },
  { label: 'Response Viewer', href: '/response-viewer' },
  { label: 'Agent Canvas', href: '/canvas' },
];

export default function AgentCanvasPage() {
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState([
    { id: '1', title: 'Input Ingest Node', type: 'Trigger', x: 80, y: 120, desc: 'Real-time WebSocket & REST webhook' },
    { id: '2', title: 'Research Agent (Sonnet)', type: 'Agent', x: 380, y: 80, desc: 'Autonomous web search & vector retrieval' },
    { id: '3', title: 'Code Critic (OpenAI)', type: 'Agent', x: 380, y: 240, desc: 'Syntax, security, and consensus verification' },
    { id: '4', title: 'Artifact Synthesizer', type: 'Output', x: 700, y: 160, desc: 'Production bundle code compiler' },
  ]);

  return (
    <ModuleLayout
      title="Multi-Agent Interactive Canvas"
      subtitle="Visual spatial environment for freeform agent ideation, node graph linkage, and artifact generation"
      subnav={studioSubnav}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              const newId = (nodes.length + 1).toString();
              setNodes([...nodes, {
                id: newId,
                title: `Agent Node ${newId}`,
                type: 'Agent',
                x: 200 + nodes.length * 40,
                y: 180 + (nodes.length % 2) * 50,
                desc: 'Configurable agent persona'
              }]);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Node
          </button>

          <Link
            href="/workflow"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Compile to DAG
          </Link>
        </div>
      }
    >
      <div className="relative w-full h-[640px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Spatial Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left'
          }}
        />

        {/* Canvas Workspace */}
        <div 
          className="absolute inset-0 transition-transform duration-100"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {nodes.map(node => (
            <div
              key={node.id}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className="absolute w-64 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing hover:border-indigo-500/80 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  node.type === 'Agent' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                  node.type === 'Trigger' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {node.type}
                </span>
                <span className="font-mono text-[10px] text-slate-500">#{node.id}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{node.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{node.desc}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-indigo-400" /> Active
                </span>
                <span className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                  Configure →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Canvas Toolbar Floating Overlay */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur text-xs text-slate-400 flex items-center gap-3">
          <span>Drag nodes to position</span>
          <span>•</span>
          <span>Nodes: {nodes.length}</span>
          <span>•</span>
          <span className="text-emerald-400">Autosaved</span>
        </div>
      </div>
    </ModuleLayout>
  );
}
