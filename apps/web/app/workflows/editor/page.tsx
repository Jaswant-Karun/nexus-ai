'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Layers, 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  GitFork, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Templates', href: '/workflows/templates' },
  { label: 'Live Execution', href: '/workflows/execution' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
  { label: 'Analytics', href: '/workflows/analytics' },
];

export default function WorkflowEditorPage() {
  const [nodes, setNodes] = useState([
    { id: '1', name: 'Trigger (API Webhook)', type: 'trigger', agent: 'System Ingest', x: 60, y: 120 },
    { id: '2', name: 'Specification Decomposer', type: 'agent', agent: 'Orchestrator (GPT-4o)', x: 340, y: 80 },
    { id: '3', name: 'Security & Consensus Audit', type: 'agent', agent: 'Agent 3 Critic (OpenAI)', x: 340, y: 240 },
    { id: '4', name: 'Code & Migration Synthesizer', type: 'agent', agent: 'Code Synthesizer (Gemini)', x: 640, y: 160 },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>('2');
  const [validDag, setValidDag] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Visual DAG Workflow Editor"
      subtitle="Assemble, connect, and validate multi-agent asynchronous Directed Acyclic Graphs"
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newId = (nodes.length + 1).toString();
              setNodes([...nodes, {
                id: newId,
                name: `Agent Node ${newId}`,
                type: 'agent',
                agent: 'Claude 3.5 Sonnet',
                x: 200 + nodes.length * 30,
                y: 160
              }]);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Node
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> {saved ? 'Saved!' : 'Save DAG'}
          </button>
          <Link
            href="/workflows/execution"
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Execute Pipeline
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-8 relative h-[560px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl p-6">
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 w-full h-full">
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-56 p-4 rounded-xl border cursor-pointer transition-all shadow-lg backdrop-blur-md ${
                  selectedNode === node.id
                    ? 'bg-indigo-950/80 border-indigo-500 shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    node.type === 'trigger' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {node.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">#{node.id}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1 truncate">{node.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">{node.agent}</p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>DAG Validated: 0 Cycles Detected</span>
          </div>
        </div>

        {/* Node Configuration Inspector */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" /> Node Configuration Inspector
          </h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Node Identifier
                </label>
                <input
                  type="text"
                  readOnly
                  value={`Node_${selectedNode}`}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Assigned Agent Persona
                </label>
                <select className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none">
                  <option>NEXUS Master Orchestrator (GPT-4o)</option>
                  <option>Deep Research Agent (Claude 3.5 Sonnet)</option>
                  <option>OpenAI Consensus Critic (Agent 3)</option>
                  <option>Full-Stack Code Synthesizer (Gemini 1.5 Pro)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Input Contract Transformation
                </label>
                <textarea
                  rows={4}
                  defaultValue="{\n  &quot;input&quot;: &quot;{{prev_step.output}}&quot;,\n  &quot;validate_schema&quot;: true\n}"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNodes(nodes.filter(n => n.id !== selectedNode));
                    setSelectedNode(null);
                  }}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Node from Graph
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">
              Click any node on the canvas to inspect and edit its execution parameters.
            </p>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
