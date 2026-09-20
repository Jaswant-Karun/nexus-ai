'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  ArrowLeft, Save, Bot, Cpu, Database, Settings,
  Sliders, Plus, X, CheckCircle2, AlertCircle
} from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Performance', href: '/agents/performance' },
];

const MODEL_OPTIONS = [
  'models/gemini-2.5-flash',
  'models/gemini-1.5-pro',
  'gpt-4o',
  'gpt-4o-mini',
  'claude-3-5-sonnet-20241022',
  'claude-3-haiku-20240307',
];

const MEMORY_OPTIONS = [
  'Vector Store (pgvector)',
  'Semantic Knowledge Graph',
  'Working Session Memory',
  'Repository Codebase Vector',
  'Redis Short-Term Cache',
  'None',
];

const agentDefaults: Record<string, {
  name: string; role: string; model: string; temperature: string;
  maxTokens: string; systemPrompt: string; tools: string[]; memory: string;
}> = {
  'agent-orchestrator': {
    name: 'NEXUS Master Orchestrator',
    role: 'Decomposes complex requests into task graphs and directs worker agents.',
    model: 'gpt-4o',
    temperature: '0.2',
    maxTokens: '4096',
    systemPrompt: 'You are the NEXUS master orchestrator. Decompose the user task into a DAG of subtasks. Assign each subtask to the most appropriate specialist agent. Monitor execution and synthesize outputs through consensus verification.',
    tools: ['Workflow Dispatcher', 'Code Sandbox', 'Consensus Verifier'],
    memory: 'Vector Store (pgvector)',
  },
  'agent-researcher': {
    name: 'Deep Research & Analysis Agent',
    role: 'Scrapes live web data, queries scholarly sources, and compiles factual briefs.',
    model: 'claude-3-5-sonnet-20241022',
    temperature: '0.3',
    maxTokens: '8192',
    systemPrompt: 'You are a deep research specialist. Use available search tools to gather comprehensive, multi-source information. Always cite sources, check credibility, and synthesize findings into structured reports.',
    tools: ['Google Search API', 'PDF Parser', 'ArXiv Search'],
    memory: 'Semantic Knowledge Graph',
  },
};

export default function AgentEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const defaults = agentDefaults[id] || {
    name: '',
    role: '',
    model: 'models/gemini-2.5-flash',
    temperature: '0.7',
    maxTokens: '2048',
    systemPrompt: '',
    tools: [],
    memory: 'None',
  };

  const [form, setForm] = useState(defaults);
  const [newTool, setNewTool] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTool = () => {
    if (newTool.trim() && !form.tools.includes(newTool.trim())) {
      setForm(prev => ({ ...prev, tools: [...prev.tools, newTool.trim()] }));
      setNewTool('');
    }
  };

  const removeTool = (tool: string) => {
    setForm(prev => ({ ...prev, tools: prev.tools.filter(t => t !== tool) }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <ModuleLayout
      title={`Edit: ${form.name || 'Agent'}`}
      subtitle="Modify configuration, system prompt, tools, and memory for this agent"
      subnav={agentsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${id}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Agent
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-60"
          >
            {saving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save Changes</>
            )}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Config */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identity */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> Agent Identity
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Agent Name</label>
                <input
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Research Specialist Agent"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Role Description</label>
                <textarea
                  value={form.role}
                  onChange={e => handleChange('role', e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Describe what this agent does in 1-2 sentences..."
                />
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" /> System Prompt
            </h3>
            <textarea
              value={form.systemPrompt}
              onChange={e => handleChange('systemPrompt', e.target.value)}
              rows={8}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
              placeholder="You are a specialized AI agent that..."
            />
            <div className="flex justify-between mt-2 text-[11px] text-slate-500">
              <span>Defines the agent&apos;s personality, scope, and behavior</span>
              <span>{form.systemPrompt.length} chars</span>
            </div>
          </div>

          {/* Tools */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Attached Tools
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tools.map(tool => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                >
                  {tool}
                  <button onClick={() => removeTool(tool)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.tools.length === 0 && (
                <span className="text-xs text-slate-500">No tools attached. Add tools below.</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={newTool}
                onChange={e => setNewTool(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTool()}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Web Search API, Code Runner..."
              />
              <button
                onClick={addTool}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right: Model Config */}
        <div className="space-y-5">
          {/* Model Selection */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Model Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Base Model</label>
                <select
                  value={form.model}
                  onChange={e => handleChange('model', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {MODEL_OPTIONS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 flex items-center justify-between">
                  Temperature
                  <span className="font-mono text-white">{form.temperature}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={form.temperature}
                  onChange={e => handleChange('temperature', e.target.value)}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>Precise (0)</span>
                  <span>Creative (1)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Max Output Tokens</label>
                <select
                  value={form.maxTokens}
                  onChange={e => handleChange('maxTokens', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {['512', '1024', '2048', '4096', '8192', '16384'].map(t => (
                    <option key={t} value={t}>{t} tokens</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Memory */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Memory Store
            </h3>
            <select
              value={form.memory}
              onChange={e => handleChange('memory', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {MEMORY_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Controls what this agent remembers across sessions.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/50">
            <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Danger Zone
            </h3>
            <button className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-semibold transition-all">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
