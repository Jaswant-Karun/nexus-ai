'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Save, Database, ShieldCheck, Trash2 } from 'lucide-react';

const memorySubnav = [
  { label: 'Memory Hub', href: '/memory' },
  { label: 'Session Memory', href: '/memory/session' },
  { label: 'Long-Term Storage', href: '/memory/long-term' },
  { label: 'Context Windows', href: '/memory/context' },
  { label: 'Memory Settings', href: '/memory/settings' },
];

export default function MemorySettingsPage() {
  const [encryption, setEncryption] = useState(true);
  const [vectorRetentionDays, setVectorRetentionDays] = useState(90);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Cognitive Memory Policies & Retention"
      subtitle="Configure vector retention policies, pgvector hardware acceleration, and privacy encryption"
      subnav={memorySubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Policies Saved!' : 'Save Policies'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Vector Retention & Storage
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Episodic Vector Retention Period</span>
              <span className="text-indigo-400 font-mono font-bold">{vectorRetentionDays} Days</span>
            </div>
            <input
              type="range"
              min="30"
              max="365"
              step="30"
              value={vectorRetentionDays}
              onChange={(e) => setVectorRetentionDays(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">AES-256 Vector Encryption at Rest</div>
              <div className="text-[11px] text-slate-400">Cryptographically protect all semantic vector embeddings in pgvector storage.</div>
            </div>
            <input
              type="checkbox"
              checked={encryption}
              onChange={(e) => setEncryption(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
          <h3 className="text-base font-bold text-rose-400">Memory Purge Controls</h3>
          <p className="text-xs text-slate-400">
            Wiping vector memories resets all agent adaptation models and learned domain relationships.
          </p>
          <button
            type="button"
            onClick={() => alert("Memory wipe requires cluster administrator approval.")}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wipe All Vector Memories
          </button>
        </div>
      </form>
    </ModuleLayout>
  );
}
