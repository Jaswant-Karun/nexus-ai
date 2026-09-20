'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { BookOpen, Search, ShieldCheck, Plus } from 'lucide-react';

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

export default function AdminPromptsPage() {
  return (
    <ModuleLayout
      title="Cluster-Wide System Prompts & Guardrails"
      subtitle="Enforce enterprise safety guardrails, PII redaction rules, and core agent directives"
      subnav={adminSubnav}
      actions={
        <Link
          href="/prompt-library"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" /> Open Prompt Library
        </Link>
      }
    >
      <div className="space-y-4">
        {[
          { name: 'Mandatory Safety & PII Redaction Layer', scope: 'Global (All Agents)', enforcement: 'Strict Regex + LLM Validator', status: 'Enforced' },
          { name: 'Deterministic Code Formatting Standard', scope: 'Code Synthesizer & Critic', enforcement: 'AST Linter', status: 'Enforced' },
          { name: 'Zero-Tolerance Prompt Injection Shield', scope: 'Inbound User Messages', enforcement: 'FastAPI AI Middleware', status: 'Enforced' },
        ].map(p => (
          <div
            key={p.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">{p.name}</h4>
              </div>
              <div className="text-xs text-slate-400">
                Scope: <strong className="text-slate-200">{p.scope}</strong> • Validator: {p.enforcement}
              </div>
            </div>

            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-end sm:self-center">
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
