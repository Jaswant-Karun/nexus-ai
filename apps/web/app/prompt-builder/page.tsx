'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Sparkles, 
  Layers, 
  Save, 
  Play, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';

const studioSubnav = [
  { label: 'Playground', href: '/playground' },
  { label: 'Prompt Library', href: '/prompt-library' },
  { label: 'Prompt Builder', href: '/prompt-builder' },
  { label: 'Response Viewer', href: '/response-viewer' },
  { label: 'Agent Canvas', href: '/canvas' },
];

export default function PromptBuilderPage() {
  const [role, setRole] = useState('Senior Distributed Systems Architect');
  const [goal, setGoal] = useState('Design resilient failover mechanisms for multi-agent microservices');
  const [format, setFormat] = useState('JSON Schema with step-by-step rationale');
  const [constraints, setConstraints] = useState([
    'Never return unverified assumptions',
    'Explicitly handle network partitions using Raft protocol',
    'Keep execution latency below 200ms per agent hop'
  ]);
  const [newConstraint, setNewConstraint] = useState('');
  const [copied, setCopied] = useState(false);

  const assembledPrompt = `You are a ${role}.

### PRIMARY OBJECTIVE
${goal}

### OPERATIONAL CONSTRAINTS
${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### OUTPUT FORMAT SPECIFICATION
Produce strictly: ${format}

### EXECUTION DIRECTIVE
Begin autonomous reasoning. Verify each dependency before concluding output.`;

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (idx: number) => {
    setConstraints(constraints.filter((_, i) => i !== idx));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout
      title="Visual Prompt Engineering Studio"
      subtitle="Assemble structured agent directives with guardrails, output constraints, and few-shot grounding"
      subnav={studioSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Prompt'}
          </button>
          <Link
            href={`/playground?prompt=${encodeURIComponent(assembledPrompt)}`}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Test in Playground
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Assembly Blocks */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Agent Persona / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              placeholder="e.g. Lead DevOps Engineer"
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Core Mission / Objective
            </label>
            <textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none resize-none"
              placeholder="Describe the primary goal..."
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Behavioral Constraints & Guardrails
              </label>
              <span className="text-[11px] text-slate-500">{constraints.length} Active</span>
            </div>

            <div className="space-y-2">
              {constraints.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span>{i + 1}. {c}</span>
                  <button
                    onClick={() => handleRemoveConstraint(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                placeholder="Add rule (e.g. Limit output to 300 words)..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Format Specification
            </label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              placeholder="e.g. Markdown bullet points with code snippets"
            />
          </div>
        </div>

        {/* Right: Real-time Compiled Directive Preview */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden sticky top-6">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Compiled System Directive
              </span>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                Dynamic Preview
              </span>
            </div>
            <div className="p-5 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
              {assembledPrompt}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
