'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Code2, 
  Terminal, 
  Key, 
  Download, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

export default function DeveloperHubPage() {
  return (
    <ModuleLayout
      title="Developer Gateway & Engineering Portal"
      subtitle="Client SDKs, OpenAPI specifications, API key tokens, and integration tooling"
      subnav={devSubnav}
      actions={
        <Link
          href="/developer/api-keys"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Key className="w-3.5 h-3.5" /> Generate API Key
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Quick Launchpad Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/developer/api-docs"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Code2 className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              API Documentation
            </h3>
            <p className="text-xs text-slate-400">
              Interactive OpenAPI and REST endpoints for agent dispatch, DAG runs, and storage.
            </p>
          </Link>

          <Link
            href="/developer/sdk"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Terminal className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              SDKs & Client Libraries
            </h3>
            <p className="text-xs text-slate-400">
              Native TypeScript, Python, and Go client packages for asynchronous agent streaming.
            </p>
          </Link>

          <Link
            href="/developer/playground"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Zap className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              Interactive API Console
            </h3>
            <p className="text-xs text-slate-400">
              Send authenticated HTTP requests and test streaming endpoints directly from your browser.
            </p>
          </Link>
        </div>

        {/* Quick Sample */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Quick Install TypeScript SDK</span>
            <span className="text-xs text-emerald-400 font-mono">v1.4.2</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
            npm install @nexus-ai/sdk
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
