'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Database, HardDrive, Layers, Save, CheckCircle2, RefreshCw } from 'lucide-react';

const settingsSubnav = [
  { label: 'All Settings', href: '/settings' },
  { label: 'General', href: '/settings/general' },
  { label: 'Theme & Display', href: '/settings/theme' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Privacy & Data', href: '/settings/privacy' },
  { label: 'AI Models', href: '/settings/ai' },
  { label: 'Storage Engine', href: '/settings/storage' },
  { label: 'Integrations', href: '/settings/integrations' },
  { label: 'Security & Auth', href: '/settings/security' },
];

export default function StorageSettingsPage() {
  const [vectorBackend, setVectorBackend] = useState('pgvector');
  const [chunkSize, setChunkSize] = useState('512');
  const [chunkOverlap, setChunkOverlap] = useState('64');
  const [autoReindex, setAutoReindex] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <ModuleLayout
      title="Storage & Vector Engine Configuration"
      subtitle="Configure document parsing, chunking windows, vector embeddings, and object store buckets"
      subnav={settingsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Save Storage Config
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {saved && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Storage configuration updated successfully.
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Vector Database Backend
          </h3>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Embedding Vector Store Engine</label>
            <select
              value={vectorBackend}
              onChange={(e) => setVectorBackend(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="pgvector">PostgreSQL + pgvector (HNSW Indexing - Recommended)</option>
              <option value="pinecone">Pinecone Serverless</option>
              <option value="weaviate">Weaviate Enterprise Cluster</option>
              <option value="qdrant">Qdrant Vector Database</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Chunk Size (Tokens)</label>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Chunk Overlap (Tokens)</label>
              <input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auto Re-index on File Update</span>
                <span className="text-slate-400">Trigger background embedding generation whenever a file in NEXUS Storage is overwritten.</span>
              </div>
              <input
                type="checkbox"
                checked={autoReindex}
                onChange={(e) => setAutoReindex(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </label>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
