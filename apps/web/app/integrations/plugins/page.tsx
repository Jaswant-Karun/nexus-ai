'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Puzzle, CheckCircle2, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

const integrationsSubnav = [
  { label: 'Integrations Hub', href: '/integrations' },
  { label: 'API Connectors', href: '/integrations/apis' },
  { label: 'Plugins', href: '/integrations/plugins' },
  { label: 'Webhooks', href: '/integrations/webhooks' },
  { label: 'Marketplace', href: '/integrations/marketplace' },
];

const plugins = [
  { id: 'p-1', name: 'Code Sandbox Execution Runtime', author: 'NEXUS Labs', enabled: true, desc: 'Executes Python and JavaScript in isolated gVisor micro-VMs.' },
  { id: 'p-2', name: 'PostgreSQL Schema Auto-Migrator', author: 'Database Fleet', enabled: true, desc: 'Validates Prisma schema changes and runs pgvector migrations.' },
  { id: 'p-3', name: 'ArXiv & Scholar Research Harvester', author: 'Research Lab', enabled: true, desc: 'Parses academic research PDFs and generates semantic summaries.' },
  { id: 'p-4', name: 'Slack Bot Real-time Dispatcher', author: 'Community', enabled: false, desc: 'Sends dynamic block-kit cards with run approvals directly to Slack.' },
];

export default function IntegrationsPluginsPage() {
  const [list, setList] = useState(plugins);

  const toggle = (id: string) => {
    setList(list.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <ModuleLayout
      title="Platform Plugins & Extensions"
      subtitle="Modular system extensions that grant autonomous agents new capabilities and tools"
      subnav={integrationsSubnav}
    >
      <div className="space-y-4">
        {list.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Puzzle className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <span className="text-[11px] text-slate-500">by {item.author}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{item.desc}</p>
            </div>

            <button
              onClick={() => toggle(item.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                item.enabled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
