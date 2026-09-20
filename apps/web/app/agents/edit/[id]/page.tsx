'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bot, Save, ArrowLeft, Cpu, Database, Trash2, Sliders } from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Marketplace', href: '/agents/marketplace' },
  { label: 'Agent Memory', href: '/agents/memory' },
  { label: 'Performance', href: '/agents/performance' },
  { label: 'Audit Logs', href: '/agents/logs' },
  { label: 'Fleet Settings', href: '/agents/settings' },
];

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id as string || 'agent-orchestrator';

  const [name, setName] = useState(agentId.replace(/-/g, ' ').toUpperCase());
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.2);
  const [systemPrompt, setSystemPrompt] = useState('You are an autonomous orchestrator in the NEXUS multi-agent system.');
  const [saving, setSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push(`/agents/${agentId}`);
    }, 700);
  };

  return (
    <ModuleLayout
      title={`Edit Agent: ${agentId}`}
      subtitle="Modify agent persona, hyperparameter tuning, and capabilities"
      subnav={agentsSubnav}
      actions={
        <Link
          href={`/agents/${agentId}`}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Agent
        </Link>
      }
    >
      <form onSubmit={handleUpdate} className="max-w-4xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Agent Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Model Engine
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gemini-1-5-pro">Google Gemini 1.5 Pro</option>
                <option value="deepseek-v3">DeepSeek V3</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Temperature (Deterministic vs Creative)</span>
              <span className="text-indigo-400 font-mono">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              System Instruction
            </label>
            <textarea
              required
              rows={5}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none resize-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to retire this agent from the fleet?')) {
                router.push('/agents');
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Retire Agent
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving Changes...' : 'Save Agent Configuration'}
          </button>
        </div>
      </form>
    </ModuleLayout>
  );
}
