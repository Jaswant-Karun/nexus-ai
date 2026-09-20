'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bot, Plus, Sliders, Play, CheckCircle2, ArrowUpRight } from 'lucide-react';

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

export default function AdminAgentsPage() {
  return (
    <ModuleLayout
      title="Cluster Agent Registry & Supervision"
      subtitle="Fleet-wide resource throttling, worker isolation, and system prompt enforcement"
      subnav={adminSubnav}
      actions={
        <Link
          href="/agents/create"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Deploy Agent
        </Link>
      }
    >
      <div className="space-y-4">
        {[
          { name: 'NEXUS Master Orchestrator', model: 'GPT-4o', isolation: 'Micro-VM', memory: '1.2 GB pgvector', status: 'Online' },
          { name: 'OpenAI Consensus Critic (Agent 3)', model: 'OpenAI Chat Model', isolation: 'gVisor Sandbox', memory: 'Session Cache', status: 'Online' },
          { name: 'Deep Research Agent', model: 'Claude 3.5 Sonnet', isolation: 'Micro-VM', memory: 'Knowledge Graph', status: 'Online' },
          { name: 'Full-Stack Code Synthesizer', model: 'Gemini 1.5 Pro', isolation: 'Docker Sandbox', memory: 'Repository Vector', status: 'Standby' },
        ].map(a => (
          <div
            key={a.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{a.name}</h4>
                <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {a.model}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Runtime: <strong className="text-slate-200">{a.isolation}</strong> • Attached Memory: {a.memory}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> {a.status}
              </span>
              <Link
                href="/agents"
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Inspect
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
