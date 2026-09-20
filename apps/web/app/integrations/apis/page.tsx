'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Key, ShieldCheck, CheckCircle2, Plus, ExternalLink } from 'lucide-react';

const integrationsSubnav = [
  { label: 'Integrations Hub', href: '/integrations' },
  { label: 'API Connectors', href: '/integrations/apis' },
  { label: 'Plugins', href: '/integrations/plugins' },
  { label: 'Webhooks', href: '/integrations/webhooks' },
  { label: 'Marketplace', href: '/integrations/marketplace' },
];

export default function IntegrationsApisPage() {
  return (
    <ModuleLayout
      title="Third-Party API Connectors & Keys"
      subtitle="Manage external provider credentials, model inference tokens, and SaaS API bridges"
      subnav={integrationsSubnav}
      actions={
        <Link
          href="/developer/api-keys"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Key className="w-3.5 h-3.5" /> API Keys Console
        </Link>
      }
    >
      <div className="space-y-4">
        {[
          { name: 'OpenAI API Platform', status: 'Configured', models: 'GPT-4o, text-embedding-3-small', keyMask: 'sk-proj-...84f2' },
          { name: 'Anthropic Claude API', status: 'Configured', models: 'Claude 3.5 Sonnet, Claude 3 Haiku', keyMask: 'sk-ant-...991c' },
          { name: 'Google Vertex & Gemini', status: 'Configured', models: 'Gemini 1.5 Pro, Flash', keyMask: 'AIzaSy...20ba' },
          { name: 'DeepSeek Platform', status: 'Configured', models: 'DeepSeek V3, DeepSeek R1', keyMask: 'sk-deep-...33a1' },
        ].map(item => (
          <div
            key={item.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-white">{item.name}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Active models: <span className="text-slate-300 font-mono">{item.models}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="font-mono text-xs text-slate-500 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                {item.keyMask}
              </span>
              <button
                onClick={() => alert(`Rotate key for ${item.name}`)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Rotate
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
