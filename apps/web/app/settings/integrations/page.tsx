'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Blocks, CheckCircle2, Globe, Cpu, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const settingsSubnav = [
  { label: 'All Settings', href: '/settings' },
  { label: 'General', href: '/settings/general' },
  { label: 'Theme & Display', href: '/settings/theme' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Privacy & Data', href: '/settings/privacy' },
  { label: 'AI Models', href: '/settings/ai' },
  { label: 'Storage Engine', href: '/settings/storage' },
  { label: 'Integrations', href: '/settings/integrations' },
  { label: 'Security & Auth', href: '/settings/security' },
];

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState([
    { id: 'n8n', name: 'n8n Automation Engine', status: 'CONNECTED', desc: 'Self-hosted workflow webhook trigger' },
    { id: 'openai', name: 'OpenAI Enterprise API', status: 'CONNECTED', desc: 'Custom BYOK token with GPT-4o access' },
    { id: 'slack', name: 'Slack Bot Workspace', status: 'DISCONNECTED', desc: 'Interactive chat agent bridge' },
    { id: 'github', name: 'GitHub Sync & CI', status: 'CONNECTED', desc: 'Repository code review agent integration' },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED'
        };
      }
      return item;
    }));
  };

  return (
    <ModuleLayout
      title="Third-Party Integrations & Services"
      subtitle="Connect enterprise messaging, CI/CD pipelines, automation tools, and external cloud services"
      subnav={settingsSubnav}
      actions={
        <Link
          href="/integrations/marketplace"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Blocks className="w-3.5 h-3.5" /> Explore Marketplace
        </Link>
      }
    >
      <div className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/60 overflow-hidden">
          {integrations.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'CONNECTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>

              <button
                onClick={() => toggleConnection(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  item.status === 'CONNECTED'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {item.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
