'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Terminal, Code2, Copy, ExternalLink } from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

const endpoints = [
  { method: 'POST', path: '/api/v1/agents/execute', desc: 'Trigger autonomous multi-agent task execution pipeline' },
  { method: 'GET', path: '/api/v1/workflows/status/:id', desc: 'Retrieve real-time DAG execution state and intermediate outputs' },
  { method: 'POST', path: '/api/v1/ai/generate', desc: 'High-throughput model inference with pgvector grounding' },
  { method: 'GET', path: '/api/storage/files', desc: 'Query and list workspace storage assets and vector metadata' },
];

export default function DeveloperApiDocsPage() {
  return (
    <ModuleLayout
      title="OpenAPI & REST Specification Reference"
      subtitle="Complete parameter contracts, request payload schemas, and streaming SSE protocols"
      subnav={devSubnav}
      actions={
        <Link
          href="/developer/playground"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <Code2 className="w-3.5 h-3.5" /> Test in API Console
        </Link>
      }
    >
      <div className="space-y-4">
        {endpoints.map((ep, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {ep.method}
              </span>
              <span className="font-mono text-sm font-semibold text-white">{ep.path}</span>
            </div>
            <p className="text-xs text-slate-400 pl-14 leading-relaxed">{ep.desc}</p>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
