'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Clock, 
  DollarSign, 
  Bot, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu 
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

const agentMetrics = [
  {
    name: 'NEXUS Master Orchestrator',
    model: 'GPT-4o',
    avgLatency: '184 ms',
    successRate: '99.8%',
    costPerRun: '$0.012',
    tokensTotal: '2.4M',
    health: 'Optimal'
  },
  {
    name: 'Deep Research Agent',
    model: 'Claude 3.5 Sonnet',
    avgLatency: '342 ms',
    successRate: '99.4%',
    costPerRun: '$0.018',
    tokensTotal: '4.8M',
    health: 'Optimal'
  },
  {
    name: 'OpenAI Consensus Critic (Agent 3)',
    model: 'OpenAI Chat Model',
    avgLatency: '142 ms',
    successRate: '98.9%',
    costPerRun: '$0.006',
    tokensTotal: '1.1M',
    health: 'Optimal'
  },
  {
    name: 'Full-Stack Code Synthesizer',
    model: 'Gemini 1.5 Pro',
    avgLatency: '410 ms',
    successRate: '99.1%',
    costPerRun: '$0.009',
    tokensTotal: '3.6M',
    health: 'Optimal'
  }
];

export default function AgentPerformancePage() {
  return (
    <ModuleLayout
      title="Fleet Telemetry & Benchmarking"
      subtitle="Execution latency, inference token overhead, cost attribution, and reliability SLAs"
      subnav={agentsSubnav}
      actions={
        <Link
          href="/analytics"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" /> Full Cluster Analytics
        </Link>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Mean Fleet Latency</div>
            <div className="text-2xl font-bold text-white">269 ms</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 18ms faster than SLA
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Fleet Success Rate</div>
            <div className="text-2xl font-bold text-white">99.3%</div>
            <div className="text-xs text-emerald-400 mt-1">Zero unhandled crashes</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">24h Incurred Cost</div>
            <div className="text-2xl font-bold text-white">$4.82</div>
            <div className="text-xs text-indigo-400 mt-1">Token-optimized routing</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Token Volume</div>
            <div className="text-2xl font-bold text-white">11.9M</div>
            <div className="text-xs text-slate-400 mt-1">Across 4 active agents</div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Per-Agent Performance Breakdown</h3>
            <span className="text-xs text-slate-400">Live Window (Last 7 Days)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Agent</th>
                  <th className="px-6 py-3">Base Model</th>
                  <th className="px-6 py-3">Avg Latency</th>
                  <th className="px-6 py-3">Reliability</th>
                  <th className="px-6 py-3">Cost / Run</th>
                  <th className="px-6 py-3">Tokens Consumed</th>
                  <th className="px-6 py-3">Cluster Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {agentMetrics.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{m.name}</td>
                    <td className="px-6 py-4 font-mono text-indigo-400">{m.model}</td>
                    <td className="px-6 py-4 font-mono">{m.avgLatency}</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">{m.successRate}</td>
                    <td className="px-6 py-4 font-mono">{m.costPerRun}</td>
                    <td className="px-6 py-4 font-mono">{m.tokensTotal}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> {m.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
