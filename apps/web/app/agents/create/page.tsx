'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Bot, 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Cpu, 
  Sliders, 
  Shield, 
  Database,
  Plus,
  Trash2
} from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Marketplace', href: '/agents/marketplace' },
  { label: 'Agent Memory', href: '/agents/memory' },
  { label: 'Performance', href: '/agents/performance' },
  { label: 'Audit Logs', href: '/agents/logs' },
  { label: 'Fleet Settings', href: '/agents/settings' },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.3);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [memoryType, setMemoryType] = useState('vector');
  const [tools, setTools] = useState<string[]>(['Web Search', 'Code Execution']);
  const [saving, setSaving] = useState(false);

  const availableTools = [
    'Web Search',
    'Code Execution',
    'Database Query (PostgreSQL)',
    'n8n Webhook Dispatch',
    'Vector Semantic Retrieval',
    'File System Storage'
  ];

  const toggleTool = (tool: string) => {
    if (tools.includes(tool)) {
      setTools(tools.filter(t => t !== tool));
    } else {
      setTools([...tools, tool]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push('/agents');
    }, 800);
  };

  return (
    <ModuleLayout
      title="Provision Autonomous Agent"
      subtitle="Define personality, reasoning engine, tools, and long-term memory permissions"
      subnav={agentsSubnav}
      actions={
        <Link
          href="/agents"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel & Back
        </Link>
      }
    >
      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* Basic Identity */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" /> Identity & Persona
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Agent Display Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Data Pipeline Inspector"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Primary Model Engine
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Reasoning & Consensus)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Analysis & Code)</option>
                <option value="gemini-1-5-pro">Google Gemini 1.5 Pro (Long Context)</option>
                <option value="deepseek-v3">DeepSeek V3 (Cost Efficiency)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Role Description / Capability Summary
            </label>
            <input
              required
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Analyzes streaming logs and alerts engineers to anomalous spikes."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              System Instruction / Persona Prompt
            </label>
            <textarea
              required
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define behavioral boundaries, tone, and verification standards..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none resize-none font-mono"
            />
          </div>
        </div>

        {/* Tools & Capabilities */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Capabilities & Tool Grants
          </h3>
          <p className="text-xs text-slate-400">
            Select the tools this agent is authorized to invoke autonomously during workflow execution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableTools.map(tool => {
              const active = tools.includes(tool);
              return (
                <button
                  type="button"
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    active 
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium">{tool}</span>
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                    active ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                  }`}>
                    {active && '✓'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory & Persistence */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Working & Long-Term Memory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'ephemeral', label: 'Ephemeral Only', desc: 'No cross-session state persistence.' },
              { id: 'vector', label: 'Semantic Vector (pgvector)', desc: 'Indexes conversations into embedding space.' },
              { id: 'graph', label: 'Knowledge Graph', desc: 'Maintains entity relation triples.' }
            ].map(mem => (
              <button
                type="button"
                key={mem.id}
                onClick={() => setMemoryType(mem.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  memoryType === mem.id
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold mb-1">{mem.label}</div>
                <p className="text-[11px] text-slate-500">{mem.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {saving ? 'Deploying Agent to Cluster...' : 'Deploy Agent to Fleet'}
        </button>
      </form>
    </ModuleLayout>
  );
}
