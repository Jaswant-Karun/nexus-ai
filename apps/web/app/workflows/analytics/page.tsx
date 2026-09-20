'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  Zap, 
  GitFork 
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

export default function WorkflowAnalyticsPage() {
  return (
    <ModuleLayout
      title="Workflow DAG Analytics & SLA Metrics"
      subtitle="Execution throughput, node latency bottlenecks, and error recovery benchmarks"
      subnav={workflowsSubnav}
      actions={
        <Link
          href="/workflows/history"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" /> View Execution History
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Executions (30d)</div>
            <div className="text-2xl font-bold text-white">42,890</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% month-over-month
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Avg DAG Latency</div>
            <div className="text-2xl font-bold text-white font-mono">31.2s</div>
            <div className="text-xs text-emerald-400 mt-1">Faster by 4.2s with parallel nodes</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Convergence Reliability</div>
            <div className="text-2xl font-bold text-white">99.4%</div>
            <div className="text-xs text-emerald-400 mt-1">Critic Agent verification</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Spend (30d)</div>
            <div className="text-2xl font-bold text-white font-mono">$184.20</div>
            <div className="text-xs text-indigo-400 mt-1">Average $0.0043 / run</div>
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Node Latency Breakdown Across Active Pipelines
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Research Agent (Claude 3.5 Sonnet - Web Search)</span>
                <span className="text-amber-400 font-mono">14.2s (45% of total run)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Critic Agent 3 (Consensus & Verification)</span>
                <span className="text-indigo-400 font-mono">8.4s (27% of total run)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[27%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Code Synthesizer (Gemini 1.5 Pro - AST Build)</span>
                <span className="text-emerald-400 font-mono">6.2s (20% of total run)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
