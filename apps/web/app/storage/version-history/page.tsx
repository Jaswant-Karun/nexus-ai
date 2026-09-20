'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';
import { StorageLayout } from '@/components/storage/StorageLayout';
import { Clock, RotateCcw, FileText, ArrowLeft, CheckCircle2, User, Bot } from 'lucide-react';

const versions = [
  {
    version: 'v1.4 (Current)',
    file: 'Nexus_AI_Architecture.md',
    author: 'Jaswant Karun',
    isAgent: false,
    timestamp: '2 hours ago',
    changes: 'Added OpenAI Consensus Critic (Agent 3) routing specification and pgvector schema.'
  },
  {
    version: 'v1.3',
    file: 'Nexus_AI_Architecture.md',
    author: 'NEXUS Master Orchestrator (GPT-4o)',
    isAgent: true,
    timestamp: '4 hours ago',
    changes: 'Compiled initial Directed Acyclic Graph topology for food delivery multi-agent pipeline.'
  },
  {
    version: 'v1.2',
    file: 'Nexus_AI_Architecture.md',
    author: 'Claude 3.5 Sonnet',
    isAgent: true,
    timestamp: 'Yesterday',
    changes: 'Added spatial H3 hex bin benchmark metrics for driver geo-matching.'
  },
  {
    version: 'v1.1',
    file: 'Nexus_AI_Architecture.md',
    author: 'Jaswant Karun',
    isAgent: false,
    timestamp: 'Sep 3, 2026',
    changes: 'Initial draft of platform architecture.'
  }
];

export default function StorageVersionHistoryPage() {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <AppNavbar />
      <StorageLayout>
        <div className="p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/storage/files" className="hover:text-white transition-colors">
                  Storage Files
                </Link>
                <span>/</span>
                <span className="text-white">Nexus_AI_Architecture.md</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Immutable Version History</h1>
            </div>
            <Link
              href="/storage/files"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storage
            </Link>
          </div>

          <div className="relative pl-6 border-l border-slate-800 space-y-6 my-4">
            {versions.map((v, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 ${
                  i === 0 ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-slate-700'
                }`} />

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{v.version}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        {v.isAgent ? <Bot className="w-3.5 h-3.5 text-indigo-400" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                        {v.author}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{v.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {v.changes}
                  </p>

                  {i > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => alert(`Rollback to ${v.version} confirmed.`)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Revert to this Version
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </StorageLayout>
    </div>
  );
}
