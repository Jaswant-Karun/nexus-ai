'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  SplitSquareVertical, 
  Cpu, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BarChart2, 
  Copy, 
  Check 
} from 'lucide-react';

const studioSubnav = [
  { label: 'Playground', href: '/playground' },
  { label: 'Prompt Library', href: '/prompt-library' },
  { label: 'Prompt Builder', href: '/prompt-builder' },
  { label: 'Response Viewer', href: '/response-viewer' },
  { label: 'Agent Canvas', href: '/canvas' },
];

export default function ResponseViewerPage() {
  const [activeTab, setActiveTab] = useState<'comparison' | 'json' | 'metrics'>('comparison');
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const modelAResponse = `### Architecture Synthesis (GPT-4o)
To build a resilient food delivery system:
1. **Order Service**: Exposes gRPC endpoints; emits \`OrderCreated\` events.
2. **Matching Agent**: Evaluates driver proximity using geospatial H3 hex bins.
3. **Consensus Engine**: Confirms driver acceptance within 15-second timeout window.`;

  const modelBResponse = `### Architecture Synthesis (Claude 3.5 Sonnet)
Recommended design pattern for Food Delivery Dispatch:
- **Event Mesh**: NATS JetStream provides sub-millisecond dispatch queues.
- **State Machine**: Temporal.io or custom DAG orchestrator handles multi-step compensation if driver cancels.
- **Data Layer**: PostgreSQL with PostGIS for spatial queries and pgvector for semantic dispatch optimization.`;

  return (
    <ModuleLayout
      title="Inference Response & Evaluation Viewer"
      subtitle="Side-by-side model output benchmarking, token latency profiling, and schema validation"
      subnav={studioSubnav}
      actions={
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['comparison', 'json', 'metrics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model A Card */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Model A: OpenAI GPT-4o
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Latency: 284ms • Tokens: 342 • Cost: $0.0017
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(modelAResponse);
                    setCopiedA(true);
                    setTimeout(() => setCopiedA(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-5 flex-1 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {modelAResponse}
              </div>
            </div>

            {/* Model B Card */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                    Model B: Anthropic Claude 3.5 Sonnet
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Latency: 312ms • Tokens: 388 • Cost: $0.0019
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(modelBResponse);
                    setCopiedB(true);
                    setTimeout(() => setCopiedB(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-5 flex-1 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {modelBResponse}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
            <pre>
{JSON.stringify({
  evaluation_id: "eval_94b087a2",
  timestamp: "2026-09-06T12:00:00Z",
  prompt_hash: "sha256:d8a9f02c4b8",
  results: [
    {
      model: "gpt-4o",
      status: 200,
      ttft_ms: 84,
      total_duration_ms: 284,
      tokens: { input: 42, output: 342, total: 384 },
      semantic_coherence_score: 0.984
    },
    {
      model: "claude-3-5-sonnet",
      status: 200,
      ttft_ms: 92,
      total_duration_ms: 312,
      tokens: { input: 42, output: 388, total: 430 },
      semantic_coherence_score: 0.989
    }
  ]
}, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Time to First Token (TTFT)</div>
              <div className="text-2xl font-bold text-white">84 ms</div>
              <div className="text-xs text-emerald-400 mt-1">GPT-4o Streaming</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Coherence Accuracy Score</div>
              <div className="text-2xl font-bold text-white">98.9%</div>
              <div className="text-xs text-indigo-400 mt-1">Claude 3.5 Sonnet Lead</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Token Economy Delta</div>
              <div className="text-2xl font-bold text-white">-12% Tokens</div>
              <div className="text-xs text-slate-400 mt-1">Normalized output compression</div>
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
