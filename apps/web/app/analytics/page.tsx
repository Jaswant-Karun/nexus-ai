'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Bot, 
  GitFork, 
  Database, 
  Clock, 
  DollarSign, 
  Download, 
  Layers 
} from 'lucide-react';

const analyticsSubnav = [
  { label: 'Cluster Overview', href: '/analytics' },
  { label: 'AI & Models', href: '/analytics/ai' },
  { label: 'Workflows', href: '/analytics/workflows' },
  { label: 'Projects', href: '/analytics/projects' },
  { label: 'User Activity', href: '/analytics/users' },
  { label: 'Storage & Vectors', href: '/analytics/storage' },
  { label: 'Search Queries', href: '/analytics/search' },
  { label: 'Export Telemetry', href: '/analytics/export' },
];

export default function AnalyticsHubPage() {
  return (
    <ModuleLayout
      title="Cluster Analytics & Performance Telemetry"
      subtitle="Comprehensive metrics across model tokens, agent execution throughput, and database latency"
      subnav={analyticsSubnav}
      actions={
        <Link
          href="/analytics/export"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export Telemetry CSV
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Tokens (30d)</div>
            <div className="text-2xl font-bold text-white font-mono">48.2M</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% throughput
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Workflow Runs</div>
            <div className="text-2xl font-bold text-white font-mono">1,429</div>
            <div className="text-xs text-emerald-400 mt-1">99.8% completion rate</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Avg TTFT Latency</div>
            <div className="text-2xl font-bold text-white font-mono">84 ms</div>
            <div className="text-xs text-indigo-400 mt-1">Streaming acceleration</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Estimated Incurred Cost</div>
            <div className="text-2xl font-bold text-white font-mono">$184.20</div>
            <div className="text-xs text-slate-400 mt-1">Under $250.00 monthly budget</div>
          </div>
        </div>

        {/* Model Breakdown Chart & Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> Token Distribution by Model
            </h3>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">OpenAI GPT-4o</span>
                  <span className="text-indigo-400 font-mono">24.2M tokens (50.2%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[50%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Anthropic Claude 3.5 Sonnet</span>
                  <span className="text-violet-400 font-mono">14.8M tokens (30.7%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full w-[31%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Google Gemini 1.5 Pro</span>
                  <span className="text-emerald-400 font-mono">9.2M tokens (19.1%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[19%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-violet-400" /> Top Executed Pipelines
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Food Delivery System Architecture', runs: 842, success: '99.9%' },
                { name: 'pgvector Continuous Knowledge Sync', runs: 410, success: '100%' },
                { name: 'Multi-Agent Security Consensus Audit', runs: 177, success: '98.8%' },
              ].map((pipe, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{pipe.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">{pipe.runs} runs</span>
                    <span className="text-emerald-400 font-semibold">{pipe.success}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
