'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Bot, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Clock, 
  Edit, 
  ArrowLeft, 
  Play, 
  Activity, 
  ShieldCheck 
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

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params?.id as string || 'agent-orchestrator';

  return (
    <ModuleLayout
      title={`Agent: ${agentId}`}
      subtitle="Operational telemetry, attached neural memory, and capability verification"
      subnav={agentsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/agents"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Fleet Hub
          </Link>
          <Link
            href={`/agents/edit/${agentId}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Configuration
          </Link>
          <Link
            href={`/workflow?agent=${agentId}`}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Run In Workflow
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Agent Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Operational State</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Online
            </div>
            <div className="text-xs text-slate-500 mt-1">Ready for task dispatch</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Underlying Model</div>
            <div className="text-xl font-bold text-white font-mono">GPT-4o</div>
            <div className="text-xs text-indigo-400 mt-1">Omni Reasoning Engine</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Execution Accuracy</div>
            <div className="text-xl font-bold text-white">99.8%</div>
            <div className="text-xs text-emerald-400 mt-1">Critic Agent verified</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Lifetime Tasks</div>
            <div className="text-xl font-bold text-white">4,120</div>
            <div className="text-xs text-slate-500 mt-1">Across 86 workflows</div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> Active System Prompt & Policy
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
              You are the primary NEXUS Autonomous Orchestrator. When given complex enterprise goals, deconstruct the task into a deterministic Directed Acyclic Graph (DAG). Validate dependencies across downstream worker agents and enforce consensus verification before finalizing outputs.
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Granted Capabilities
              </div>
              <div className="flex flex-wrap gap-2">
                {['Workflow Dispatcher', 'Code Sandbox', 'Consensus Verifier', 'PostgreSQL pgvector', 'HTTP Webhook'].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-emerald-400" /> Attached Memory
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Memory Type</span>
                  <span className="font-semibold text-white">Semantic Vector</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Context Store</span>
                  <span className="font-mono text-indigo-400">pgvector (1536 dim)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entities Tracked</span>
                  <span className="font-mono text-slate-300">1,842 vectors</span>
                </div>
              </div>
            </div>

            <Link
              href={`/agents/memory?agent=${agentId}`}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-xs font-semibold text-slate-300 transition-colors"
            >
              Explore Agent Vector Memory →
            </Link>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
