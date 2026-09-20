'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Brain, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { listMemories, MemoryItem, saveMemory } from '@/services/memory.service';

const memorySubnav = [
  { label: 'Memory Hub', href: '/memory' },
  { label: 'Session Memory', href: '/memory/session' },
  { label: 'Long-Term Storage', href: '/memory/long-term' },
  { label: 'Context Windows', href: '/memory/context' },
  { label: 'Memory Settings', href: '/memory/settings' },
];

export default function MemoryHubPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryError, setMemoryError] = useState('');
  const [savingMemory, setSavingMemory] = useState(false);

  useEffect(() => {
    listMemories().then(setMemories).catch(() => setMemoryError('Live memory service is not connected yet.'));
  }, []);

  async function handleSaveMemory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memoryInput.trim() || savingMemory) return;
    setSavingMemory(true);
    setMemoryError('');
    try {
      const saved = await saveMemory(memoryInput.trim(), 'long_term');
      setMemories((current) => [saved, ...current]);
      setMemoryInput('');
    } catch (error) {
      setMemoryError(error instanceof Error ? error.message : 'Memory could not be saved.');
    } finally {
      setSavingMemory(false);
    }
  }

  return (
    <ModuleLayout
      title="Cognitive Neural Memory Architecture"
      subtitle="Unified hierarchical memory system managing working session caches, long-term vector stores, and episodic context"
      subnav={memorySubnav}
      actions={
        <Link
          href="/memory/long-term"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5" /> Long-Term Vector Store
        </Link>
      }
    >
      <div className="space-y-6">
        <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-bold text-white">Live memory records</h2><p className="mt-1 text-xs text-slate-400">{memories.length} records in the local workspace namespace.</p></div><span className="text-xs font-mono text-emerald-400">{memoryError ? 'Offline' : 'Connected'}</span></div>
          <form onSubmit={handleSaveMemory} className="flex flex-col gap-2 sm:flex-row"><input value={memoryInput} onChange={(event) => setMemoryInput(event.target.value)} placeholder="Save a useful preference or project context..." className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" /><button type="submit" disabled={savingMemory || !memoryInput.trim()} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{savingMemory ? 'Saving...' : 'Save memory'}</button></form>
          {memoryError && <p className="text-xs text-amber-300">{memoryError}</p>}
          {memories.length > 0 && <div className="grid gap-2 md:grid-cols-2">{memories.slice(0, 4).map((memory) => <div key={memory.id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><div className="flex items-center justify-between gap-2"><span className="text-[10px] uppercase tracking-wider text-indigo-300">{memory.scope}</span><span className="text-[10px] text-slate-500">{memory.importance}% importance</span></div><p className="mt-2 text-xs leading-5 text-slate-300">{memory.content}</p></div>)}</div>}
        </section>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Tier 1: Working Memory</span>
              <span className="text-[10px] font-mono text-emerald-400">Ultra-Fast (Redis)</span>
            </div>
            <h3 className="text-lg font-bold text-white">Active Session Cache</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains current multi-agent conversation turn history, active scratchpads, and intermediate code ASTs.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300">
              Allocated: 14.2 MB • TTL: 24h
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tier 2: Episodic Memory</span>
              <span className="text-[10px] font-mono text-emerald-400">PostgreSQL (pgvector)</span>
            </div>
            <h3 className="text-lg font-bold text-white">Semantic Vector Embeddings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dense vector embeddings (1536-dim) generated from past conversations, uploaded files, and consensus records.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300">
              Vectors: 14,820 • Size: 1.2 GB
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Tier 3: Declarative Memory</span>
              <span className="text-[10px] font-mono text-violet-400">Knowledge Graph</span>
            </div>
            <h3 className="text-lg font-bold text-white">Entity Relation Triples</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured relationship graph linking software dependencies, team roles, and architectural decisions.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300">
              Nodes: 1,842 • Triples: 4,910
            </div>
          </div>
        </div>

        {/* Action navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/memory/session"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Inspect Session Working Memory →
              </h4>
              <p className="text-xs text-slate-400 mt-1">View active token buffers across current agent turns.</p>
            </div>
          </Link>

          <Link
            href="/memory/context"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Manage Dynamic Context Windows →
              </h4>
              <p className="text-xs text-slate-400 mt-1">Configure context window compaction and token eviction rules.</p>
            </div>
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}
