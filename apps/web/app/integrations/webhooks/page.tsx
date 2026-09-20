'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Zap, Plus, CheckCircle2, Trash2, Copy, Check } from 'lucide-react';

const integrationsSubnav = [
  { label: 'Integrations Hub', href: '/integrations' },
  { label: 'API Connectors', href: '/integrations/apis' },
  { label: 'Plugins', href: '/integrations/plugins' },
  { label: 'Webhooks', href: '/integrations/webhooks' },
  { label: 'Marketplace', href: '/integrations/marketplace' },
];

const webhooks = [
  {
    id: 'wh-n8n-trigger',
    name: 'n8n Workflow Execution Inbound Webhook',
    url: 'https://nexusai.io/api/webhooks/v1/n8n/4819a0',
    events: ['workflow.dispatched', 'agent.consensus_reached'],
    status: 'Active',
    lastPing: '12 minutes ago'
  },
  {
    id: 'wh-github-ci',
    name: 'GitHub Commit & PR Sync Webhook',
    url: 'https://nexusai.io/api/webhooks/v1/github/77f20e',
    events: ['push', 'pull_request.opened'],
    status: 'Active',
    lastPing: '2 hours ago'
  }
];

export default function IntegrationsWebhooksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ModuleLayout
      title="Inbound & Outbound Webhook Endpoints"
      subtitle="Event-driven triggers bridging external webhooks to autonomous agent pipelines"
      subnav={integrationsSubnav}
      actions={
        <button
          onClick={() => alert("Create Webhook modal")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Webhook
        </button>
      }
    >
      <div className="space-y-4">
        {webhooks.map(wh => (
          <div
            key={wh.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">{wh.name}</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> {wh.status}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Last ping: {wh.lastPing}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={wh.url}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 outline-none"
              />
              <button
                onClick={() => handleCopy(wh.id, wh.url)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                {copiedId === wh.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === wh.id ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Subscribed events:</span>
              {wh.events.map(ev => (
                <span key={ev} className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {ev}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
