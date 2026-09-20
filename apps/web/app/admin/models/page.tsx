'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Cpu, CheckCircle2, ShieldCheck, Plus, Sliders } from 'lucide-react';

const adminSubnav = [
  { label: 'Admin Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Organizations', href: '/admin/organizations' },
  { label: 'Fleet Agents', href: '/admin/agents' },
  { label: 'Model Providers', href: '/admin/models' },
  { label: 'Workflows', href: '/admin/workflows' },
  { label: 'Storage & DB', href: '/admin/storage' },
  { label: 'Cluster Logs', href: '/admin/logs' },
  { label: 'Security & SSO', href: '/admin/security' },
  { label: 'System Health', href: '/admin/system' },
  { label: 'Backups', href: '/admin/backups' },
  { label: 'Admin Settings', href: '/admin/settings' },
];

export default function AdminModelsPage() {
  return (
    <ModuleLayout
      title="Upstream Model Providers & Weights"
      subtitle="Configure upstream API rate limits, model fallback rules, and private local model weights"
      subnav={adminSubnav}
    >
      <div className="space-y-4">
        {[
          { provider: 'OpenAI API', model: 'gpt-4o', rateLimit: '10,000 RPM', status: 'Healthy', latency: '84ms' },
          { provider: 'Anthropic API', model: 'claude-3-5-sonnet', rateLimit: '8,000 RPM', status: 'Healthy', latency: '92ms' },
          { provider: 'Google Vertex AI', model: 'gemini-1-5-pro', rateLimit: '12,000 RPM', status: 'Healthy', latency: '142ms' },
          { provider: 'DeepSeek Platform', model: 'deepseek-v3', rateLimit: '15,000 RPM', status: 'Healthy', latency: '110ms' },
        ].map(m => (
          <div
            key={m.model}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white font-mono">{m.model}</h4>
                <span className="text-xs text-slate-400">({m.provider})</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Rate Limit: {m.rateLimit} • Average Latency: {m.latency}
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full self-end sm:self-center">
              <CheckCircle2 className="w-3 h-3" /> {m.status}
            </span>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
