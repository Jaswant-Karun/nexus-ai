'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Webhook, Plus, CheckCircle, AlertCircle, RefreshCw, Send, Trash2 } from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState([
    {
      id: 'wh_1',
      url: 'https://api.acme.corp/nexus/events',
      events: ['agent.run.completed', 'agent.run.failed', 'workflow.status.changed'],
      status: 'active',
      lastDelivery: '2 mins ago',
      successRate: '99.8%'
    },
    {
      id: 'wh_2',
      url: 'https://hooks.slack.com/services/T00/B00/X00',
      events: ['security.incident.alert', 'model.drift.detected'],
      status: 'active',
      lastDelivery: '1 hour ago',
      successRate: '100%'
    }
  ]);

  const [newUrl, setNewUrl] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setEndpoints([
      ...endpoints,
      {
        id: `wh_${Date.now()}`,
        url: newUrl,
        events: ['agent.run.completed', 'workflow.status.changed'],
        status: 'active',
        lastDelivery: 'Never',
        successRate: '100%'
      }
    ]);
    setNewUrl('');
    setShowAdd(false);
  };

  const removeEndpoint = (id: string) => {
    setEndpoints(endpoints.filter(e => e.id !== id));
  };

  return (
    <ModuleLayout
      title="Webhooks & Event Subscriptions"
      subtitle="Configure secure HTTPS endpoints to receive real-time JSON webhooks for agent and workflow events"
      subnav={devSubnav}
      actions={
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-3.5 h-3.5" /> Add Endpoint
        </button>
      }
    >
      <div className="space-y-6">
        {showAdd && (
          <form onSubmit={handleAddWebhook} className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur space-y-4">
            <h3 className="text-sm font-semibold text-white">Register New Webhook Endpoint</h3>
            <div className="flex gap-3">
              <input
                type="url"
                required
                placeholder="https://your-domain.com/api/webhooks"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-all"
              >
                Save Endpoint
              </button>
            </div>
          </form>
        )}

        {/* Endpoints List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-sm font-semibold text-white flex items-center gap-2">
            <Webhook className="w-4 h-4 text-indigo-400" /> Active Webhook Endpoints ({endpoints.length})
          </div>
          <div className="divide-y divide-slate-800/60">
            {endpoints.map((ep) => (
              <div key={ep.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-white">{ep.url}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ep.events.map((ev) => (
                      <span key={ev} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Success Rate: <span className="text-white font-semibold">{ep.successRate}</span></div>
                    <div className="text-[11px] text-slate-500">Last delivery: {ep.lastDelivery}</div>
                  </div>
                  <button
                    onClick={() => removeEndpoint(ep.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete endpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
