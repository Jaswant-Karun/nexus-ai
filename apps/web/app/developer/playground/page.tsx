'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Terminal, Send, Copy, Check, Play, Settings2, Code2 } from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

export default function ApiPlaygroundPage() {
  const [method, setMethod] = useState<'POST' | 'GET' | 'DELETE'>('POST');
  const [endpoint, setEndpoint] = useState('/api/v1/agents/dispatch');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    agentId: "agent-researcher-01",
    task: "Synthesize quarterly AI research trends into a 3-bullet brief.",
    stream: true,
    maxTokens: 1024
  }, null, 2));
  
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseOutput, setResponseOutput] = useState<string>('// Click "Run Request" to send a test API payload');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecute = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResponseStatus(200);
      setResponseOutput(JSON.stringify({
        status: "success",
        timestamp: new Date().toISOString(),
        executionTimeMs: 142,
        data: {
          jobId: "job_998124_exec",
          agent: "agent-researcher-01",
          status: "COMPLETED",
          tokensUsed: { prompt: 48, completion: 210, total: 258 },
          output: "1. Autonomous multi-modal reasoning models show 38% higher task completion.\n2. Speculative decoding reduces local inference latency by 2.4x.\n3. Enterprise agent orchestrators shift towards deterministic state machine fallback."
        }
      }, null, 2));
      setIsLoading(false);
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout
      title="Interactive API Playground"
      subtitle="Craft, test, and debug live API payloads with instant response feedback"
      subnav={devSubnav}
      actions={
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          {isLoading ? <span className="animate-spin text-xs">⏳</span> : <Play className="w-3.5 h-3.5 fill-current" />}
          {isLoading ? 'Sending...' : 'Run Request'}
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Terminal className="w-4 h-4 text-indigo-400" /> Request Configuration
            </div>
            <span className="text-[11px] font-mono text-slate-400">Bearer Token: active</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-400 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Payload (JSON)</span>
              <span className="text-[10px] text-slate-500 font-mono">application/json</span>
            </label>
            <textarea
              rows={14}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Response Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Code2 className="w-4 h-4 text-emerald-400" /> Response Output
              {responseStatus && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {responseStatus} OK
                </span>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Copy Output"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="w-full flex-1 min-h-[350px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
              {responseOutput}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
