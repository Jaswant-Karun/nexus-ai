'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Puzzle, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  ArrowUpRight, 
  Plus, 
  Sparkles, 
  Zap 
} from 'lucide-react';

const integrationsSubnav = [
  { label: 'Integrations Hub', href: '/integrations' },
  { label: 'API Connectors', href: '/integrations/apis' },
  { label: 'Plugins', href: '/integrations/plugins' },
  { label: 'Webhooks', href: '/integrations/webhooks' },
  { label: 'Marketplace', href: '/integrations/marketplace' },
];

const mockIntegrations = [
  {
    id: 'int-n8n',
    name: 'n8n Workflow Automation Engine',
    category: 'Orchestration',
    status: 'Connected',
    desc: 'Bi-directional execution hook connecting visual nodes with n8n triggers on port 5678.',
    icon: '⚡'
  },
  {
    id: 'int-github',
    name: 'GitHub Enterprise & Cloud',
    category: 'Source Control',
    status: 'Connected',
    desc: 'Auto-commit agent synthesized PRs, inspect repositories, and trigger CI/CD pipelines.',
    icon: '🐙'
  },
  {
    id: 'int-slack',
    name: 'Slack Notification Gateway',
    category: 'Communication',
    status: 'Connected',
    desc: 'Stream workflow run states, agent consensus checkpoints, and security alerts to channels.',
    icon: '💬'
  },
  {
    id: 'int-pgvector',
    name: 'PostgreSQL pgvector Store',
    category: 'Database',
    status: 'Connected',
    desc: 'High-speed relational storage with native vector similarity distance operations.',
    icon: '🐘'
  }
];

export default function IntegrationsHubPage() {
  const [search, setSearch] = useState('');

  const filtered = mockIntegrations.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Ecosystem Integrations & Connectors"
      subtitle="Connect NEXUS autonomous agents to third-party APIs, source repositories, and webhook event buses"
      subnav={integrationsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/integrations/marketplace"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Integration Marketplace
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">{item.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs text-slate-400">{item.category}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-500">ID: {item.id}</span>
                <Link
                  href={`/integrations/apis?id=${item.id}`}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  Configure Connector <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
