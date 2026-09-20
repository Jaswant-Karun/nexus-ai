'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Sliders, 
  Save, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Lock, 
  CheckCircle2 
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

export default function AgentSettingsPage() {
  const [maxConcurrency, setMaxConcurrency] = useState(16);
  const [consensusThreshold, setConsensusThreshold] = useState(0.85);
  const [autoFallback, setAutoFallback] = useState(true);
  const [sandboxIsolation, setSandboxIsolation] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Fleet Governance & Cluster Settings"
      subtitle="Cluster-wide agent execution limits, multi-model fallback topologies, and security boundaries"
      subnav={agentsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Settings Saved' : 'Save Fleet Policies'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Execution & Concurrency */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Concurrency & Queue Policy
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Max Concurrent Autonomous Agents</span>
              <span className="text-indigo-400 font-mono font-bold">{maxConcurrency} workers</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={maxConcurrency}
              onChange={(e) => setMaxConcurrency(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Limits parallel asynchronous sub-task dispatches to prevent rate-limiting against upstream LLM APIs.
            </p>
          </div>
        </div>

        {/* Consensus Verification */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Agent Consensus Threshold
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Minimum Agreement Threshold</span>
              <span className="text-emerald-400 font-mono font-bold">{Math.round(consensusThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={consensusThreshold}
              onChange={(e) => setConsensusThreshold(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Percentage of agent consensus required before an autonomous action or database modification is committed.
            </p>
          </div>
        </div>

        {/* Resilience & Sandboxing */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> Runtime Isolation & Resilience
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Dynamic Model Fallback Cascading</div>
              <div className="text-[11px] text-slate-400">Automatically failover from GPT-4o to Claude 3.5 Sonnet if 5xx or rate-limits occur.</div>
            </div>
            <input
              type="checkbox"
              checked={autoFallback}
              onChange={(e) => setAutoFallback(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Isolated gVisor Docker Sandbox</div>
              <div className="text-[11px] text-slate-400">Run all agent-synthesized code in ephemeral, network-isolated micro-VMs.</div>
            </div>
            <input
              type="checkbox"
              checked={sandboxIsolation}
              onChange={(e) => setSandboxIsolation(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}
