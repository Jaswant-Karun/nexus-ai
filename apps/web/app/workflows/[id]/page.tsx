'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  GitFork, 
  Play, 
  ArrowLeft, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Edit, 
  Activity, 
  Sliders 
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

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = params?.id as string || 'wf-food-delivery';

  return (
    <ModuleLayout
      title={`Workflow: ${workflowId}`}
      subtitle="Directed Acyclic Graph topology, node dependencies, and run logs"
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/workflows"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <Link
            href={`/workflows/editor?id=${workflowId}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Open Visual DAG Editor
          </Link>
          <Link
            href={`/workflows/execution?id=${workflowId}`}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Dispatch Execution
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Pipeline Health</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Operational
            </div>
            <div className="text-xs text-slate-500 mt-1">Ready for trigger</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Node Complexity</div>
            <div className="text-xl font-bold text-white">4 Nodes • 3 Edges</div>
            <div className="text-xs text-indigo-400 mt-1">Linear sequential with critic</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Average Run Duration</div>
            <div className="text-xl font-bold text-white font-mono">38.4s</div>
            <div className="text-xs text-slate-500 mt-1">Includes 3 LLM hops</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Lifetime Runs</div>
            <div className="text-xl font-bold text-white">1,420</div>
            <div className="text-xs text-emerald-400 mt-1">99.8% convergence</div>
          </div>
        </div>

        {/* Node Topology List */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Compiled Execution Graph Sequence
          </h3>

          <div className="space-y-3">
            {[
              { step: 1, name: 'Goal Deconstruction & Schema Spec', agent: 'NEXUS Master Orchestrator (GPT-4o)', out: 'JSON AST' },
              { step: 2, name: 'Deep Research & Spatial Routing Algorithms', agent: 'Deep Research Agent (Claude 3.5 Sonnet)', out: 'Markdown Brief' },
              { step: 3, name: 'Consensus & Vulnerability Verification', agent: 'OpenAI Consensus Critic (Agent 3)', out: 'Verification Report' },
              { step: 4, name: 'Production Code & Artifact Synthesis', agent: 'Full-Stack Code Synthesizer (Gemini 1.5 Pro)', out: 'Complete Codebase' },
            ].map(node => (
              <div key={node.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {node.step}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{node.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Assigned Agent: <span className="text-indigo-400 font-mono">{node.agent}</span></div>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Emits {node.out}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
