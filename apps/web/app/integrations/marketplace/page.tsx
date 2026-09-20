'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sparkles, Search, Download, Star, ShieldCheck, Check } from 'lucide-react';

const integrationsSubnav = [
  { label: 'Integrations Hub', href: '/integrations' },
  { label: 'API Connectors', href: '/integrations/apis' },
  { label: 'Plugins', href: '/integrations/plugins' },
  { label: 'Webhooks', href: '/integrations/webhooks' },
  { label: 'Marketplace', href: '/integrations/marketplace' },
];

const connectors = [
  { id: 'c-jira', name: 'Jira Enterprise Cloud', category: 'Project Management', rating: 4.9, installs: '18k', desc: 'Sync backlog tickets and task statuses directly with autonomous worker agents.' },
  { id: 'c-notion', name: 'Notion Knowledge Base', category: 'Documentation', rating: 4.8, installs: '24k', desc: 'Ingest team wikis and databases into pgvector semantic memory in real-time.' },
  { id: 'c-datadog', name: 'Datadog APM & Logs', category: 'Monitoring', rating: 4.9, installs: '9.4k', desc: 'Stream runtime execution traces and anomalous latency spikes to Datadog.' },
  { id: 'c-snowflake', name: 'Snowflake Data Cloud', category: 'Data Warehouse', rating: 4.7, installs: '11k', desc: 'Execute analytical SQL queries and ingest tabular data into agent pipelines.' },
];

export default function IntegrationsMarketplacePage() {
  const [installed, setInstalled] = useState<Record<string, boolean>>({});

  return (
    <ModuleLayout
      title="Integrations Marketplace"
      subtitle="Discover and install verified connectors for third-party cloud platforms and tools"
      subnav={integrationsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {connectors.map(c => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {c.rating} ({c.installs})
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {c.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">SOC2 Compliant</span>
                <button
                  onClick={() => setInstalled(prev => ({ ...prev, [c.id]: true }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow ${
                    installed[c.id]
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {installed[c.id] ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  {installed[c.id] ? 'Installed' : 'Install'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
