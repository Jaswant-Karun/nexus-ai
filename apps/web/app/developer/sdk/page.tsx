'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Terminal, Download, Code2, Check, Copy } from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

const sdks = [
  { lang: 'TypeScript / Node.js', pkg: 'npm install @nexus-ai/sdk', version: 'v1.4.2', doc: 'Full async streaming & SSE support' },
  { lang: 'Python', pkg: 'pip install nexusai', version: 'v1.4.0', doc: 'Pydantic v2 schemas and LangChain / LlamaIndex adapters' },
  { lang: 'Go', pkg: 'go get github.com/nexus-ai/nexus-go', version: 'v1.2.1', doc: 'High-throughput concurrency client for microservices' },
];

export default function DeveloperSdkPage() {
  return (
    <ModuleLayout
      title="Official Client SDKs & Libraries"
      subtitle="Type-safe SDKs for integrating autonomous agent pipelines into your application stack"
      subnav={devSubnav}
    >
      <div className="space-y-4">
        {sdks.map(s => (
          <div
            key={s.lang}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">{s.lang}</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {s.version}
                </span>
              </div>
              <span className="text-xs text-slate-400">{s.doc}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 flex items-center justify-between">
              <span>{s.pkg}</span>
              <button
                onClick={() => navigator.clipboard.writeText(s.pkg)}
                className="text-xs text-slate-500 hover:text-white"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
