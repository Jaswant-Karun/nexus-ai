'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';
import { StorageLayout } from '@/components/storage/StorageLayout';
import { Folder, Plus, Search, MoreVertical, FileText, ArrowUpRight } from 'lucide-react';

const mockFolders = [
  { id: 'f-1', name: 'Agent Memory Embeddings', fileCount: 48, size: '340 MB', updated: '20 minutes ago', color: 'indigo' },
  { id: 'f-2', name: 'Workflows & DAG Exports', fileCount: 16, size: '84 MB', updated: '2 hours ago', color: 'violet' },
  { id: 'f-3', name: 'Architecture & Specifications', fileCount: 12, size: '12 MB', updated: 'Yesterday', color: 'emerald' },
  { id: 'f-4', name: 'Prisma Schemas & SQL Migrations', fileCount: 22, size: '4.2 MB', updated: 'Sep 3, 2026', color: 'amber' },
  { id: 'f-5', name: 'Compliance & Audit Reports', fileCount: 8, size: '64 MB', updated: 'Sep 1, 2026', color: 'rose' }
];

export default function StorageFoldersPage() {
  const [folders, setFolders] = useState(mockFolders);
  const [search, setSearch] = useState('');

  const filtered = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <AppNavbar />
      <StorageLayout>
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Storage Folders & Partitions</h1>
              <p className="text-xs text-slate-400">Structured organizational directories for documents, embeddings, and artifacts</p>
            </div>
            <button
              onClick={() => {
                const name = prompt('Folder Name:');
                if (name) {
                  setFolders([...folders, {
                    id: `f-${Date.now()}`,
                    name,
                    fileCount: 0,
                    size: '0 KB',
                    updated: 'Just now',
                    color: 'indigo'
                  }]);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> New Folder
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search folders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Folders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(f => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Folder className="w-5 h-5 fill-indigo-500/20" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{f.size}</span>
                </div>

                <Link href={`/storage/files?folder=${f.id}`} className="block">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {f.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {f.fileCount} Assets • Modified {f.updated}
                  </div>
                </Link>

                <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <Link
                    href={`/storage/files?folder=${f.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    Open Folder <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StorageLayout>
    </div>
  );
}
