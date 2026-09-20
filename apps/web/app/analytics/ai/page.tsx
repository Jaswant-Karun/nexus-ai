'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bot, Cpu, Clock, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

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

const modelStats = [
  { model: 'OpenAI GPT-4o', promptTokens: '18.4M', completionTokens: '5.8M', cost: '$92.40', avgTtft: '84ms', errRate: '0.02%' },
  { model: 'Anthropic Claude 3.5 Sonnet', promptTokens: '10.2M', completionTokens: '4.6M', cost: '$58.10', avgTtft: '92ms', errRate: '0.01%' },
  { model: 'Google Gemini 1.5 Pro', promptTokens: '7.4M', completionTokens: '1.8M', cost: '$24.60', avgTtft: '142ms', errRate: '0.04%' },
  { model: 'DeepSeek V3', promptTokens: '4.2M', completionTokens: '2.1M', cost: '$9.10', avgTtft: '110ms', errRate: '0.03%' },
];

export default function AnalyticsAiPage() {
  return (
    <ModuleLayout
      title="AI Models & Inference Analytics"
      subtitle="Detailed token usage, latency profiling, prompt-completion ratios, and billing attribution"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Model Invocations & Spend Summary</h3>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Model</th>
                  <th className="px-6 py-3">Prompt Tokens</th>
                  <th className="px-6 py-3">Completion Tokens</th>
                  <th className="px-6 py-3">Incurred Cost</th>
                  <th className="px-6 py-3">Mean TTFT</th>
                  <th className="px-6 py-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {modelStats.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{m.model}</td>
                    <td className="px-6 py-4 font-mono">{m.promptTokens}</td>
                    <td className="px-6 py-4 font-mono">{m.completionTokens}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">{m.cost}</td>
                    <td className="px-6 py-4 font-mono">{m.avgTtft}</td>
                    <td className="px-6 py-4 text-emerald-400">{m.errRate}</td>
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
