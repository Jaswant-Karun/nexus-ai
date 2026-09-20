'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  GitFork, 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  Zap, 
  Clock, 
  Code2, 
  Play 
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Templates', href: '/workflows/templates' },
  { label: 'Live Execution', href: '/workflows/execution' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
  { label: 'Analytics', href: '/workflows/analytics' },
];

export default function CreateWorkflowPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [trigger, setTrigger] = useState('manual');
  const [creationMode, setCreationMode] = useState<'ai' | 'scratch' | 'template'>('ai');
  const [aiGoal, setAiGoal] = useState('Build an automated customer support triaging and sentiment classification pipeline');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (creationMode === 'ai') {
      router.push(`/workflow?goal=${encodeURIComponent(aiGoal)}`);
    } else {
      router.push('/workflows/editor');
    }
  };

  return (
    <ModuleLayout
      title="Create New Workflow DAG"
      subtitle="Assemble an orchestrated multi-agent execution pipeline from scratch or via GPT-4o generator"
      subnav={workflowsSubnav}
      actions={
        <Link
          href="/workflows"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workflows
        </Link>
      }
    >
      <form onSubmit={handleCreate} className="max-w-3xl space-y-6">
        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setCreationMode('ai')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              creationMode === 'ai'
                ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5 text-indigo-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">AI Prompt Generator</div>
            <p className="text-xs text-slate-400">Describe your goal and let GPT-4o automatically synthesize the DAG nodes.</p>
          </button>

          <button
            type="button"
            onClick={() => setCreationMode('scratch')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              creationMode === 'scratch'
                ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 text-violet-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">Visual DAG Editor</div>
            <p className="text-xs text-slate-400">Assemble nodes, connect edges, and bind agent personas manually.</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/workflows/templates')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-left transition-all"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">From Template</div>
            <p className="text-xs text-slate-400">Choose from battle-tested multi-agent blueprints and enterprise recipes.</p>
          </button>
        </div>

        {/* Inputs */}
        {creationMode === 'ai' ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Natural Language Goal Formulation
            </h3>
            <p className="text-xs text-slate-400">
              Our backend AI service transforms your objective into a validated graph schema with input/output contracts.
            </p>
            <textarea
              required
              rows={4}
              value={aiGoal}
              onChange={(e) => setAiGoal(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none resize-none"
              placeholder="e.g. Ingest customer refund requests, verify with Stripe, query shipping status, and issue decision..."
            />
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Workflow Metadata</h3>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Workflow Title
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asynchronous Log Auditing Pipeline"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief summary of pipeline behavior..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
        >
          {creationMode === 'ai' ? (
            <>
              <Zap className="w-4 h-4" /> Synthesize DAG with GPT-4o
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Open Visual Canvas
            </>
          )}
        </button>
      </form>
    </ModuleLayout>
  );
}
