'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  Sparkles,
  Search,
  Download,
  Star,
  ShieldCheck,
  Bot,
  Check,
  ArrowUpRight
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

const marketplaceAgents = [
  {
    id: 'sre-incident-commander',
    name: 'DevOps & SRE Incident Commander',
    author: 'NEXUS Labs',
    category: 'DevOps',
    model: 'GPT-4o',
    rating: 4.9,
    installs: '14.2k',
    verified: true,
    description: 'Monitors Kubernetes clusters, analyzes Prometheus alerts, isolates noisy pods, and drafts post-mortems.'
  },
  {
    id: 'contract-compliance-analyst',
    name: 'SOC2 & HIPAA Compliance Auditor',
    author: 'SecureAI Corp',
    category: 'Security',
    model: 'Claude 3.5 Sonnet',
    rating: 4.8,
    installs: '8.7k',
    verified: true,
    description: 'Audits Terraform infrastructure, IAM policies, and repository commit histories against compliance frameworks.'
  },
  {
    id: 'quantitative-researcher',
    name: 'Algorithmic Financial Analyst',
    author: 'AlphaSignal',
    category: 'Finance',
    model: 'DeepSeek V3',
    rating: 4.7,
    installs: '6.1k',
    verified: false,
    description: 'Ingests SEC 10-K filings, parses earnings call transcripts, and extracts tabular financial balance sheets.'
  },
  {
    id: 'sql-query-optimizer',
    name: 'Postgres & Vector Performance Tuner',
    author: 'pgEngine',
    category: 'Database',
    model: 'Gemini 1.5 Pro',
    rating: 4.9,
    installs: '11.8k',
    verified: true,
    description: 'Analyzes EXPLAIN ANALYZE traces, suggests optimal indexes, and refactors pgvector distance queries.'
  }
];

export default function AgentsMarketplacePage() {
  const [search, setSearch] = useState('');
  const [installed, setInstalled] = useState<Record<string, boolean>>({});

  const handleInstall = (id: string) => {
    setInstalled(prev => ({ ...prev, [id]: true }));
  };

  const filtered = marketplaceAgents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Agent Marketplace & Hub"
      subtitle="Discover, install, and customize pre-configured autonomous agents curated by the community and verified partners"
      subnav={agentsSubnav}
      actions={
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(agent => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {agent.name}
                        </h3>
                        {agent.verified && (
                          <span title="Verified Enterprise">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>by {agent.author}</span>
                        <span>•</span>
                        <span className="font-mono text-indigo-400">{agent.model}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {agent.description}
                </p>
              </div>

              <div>
                <div className="py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {agent.rating}
                  </span>
                  <span>{agent.installs} installations</span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {agent.category}
                  </span>

                  <button
                    onClick={() => handleInstall(agent.id)}
                    disabled={installed[agent.id]}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow ${
                      installed[agent.id]
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {installed[agent.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Installed to Cluster
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Install Agent
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
