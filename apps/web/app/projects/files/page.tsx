'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Folder, 
  FileText, 
  Upload, 
  Download, 
  Database, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

const projectsSubnav = [
  { label: 'All Projects', href: '/projects' },
  { label: 'New Project', href: '/projects/create' },
  { label: 'Tasks', href: '/projects/tasks' },
  { label: 'Kanban Board', href: '/projects/kanban' },
  { label: 'Timeline', href: '/projects/timeline' },
  { label: 'Team Members', href: '/projects/team' },
  { label: 'Project Files', href: '/projects/files' },
  { label: 'Project Reports', href: '/projects/reports' },
  { label: 'Settings', href: '/projects/settings' },
];

const projectFiles = [
  {
    name: 'Nexus_AI_Architecture.md',
    size: '14.8 KB',
    updated: '2 hours ago',
    type: 'Markdown Specification',
    vectors: 48,
    status: 'Indexed (pgvector)'
  },
  {
    name: 'nexus_multi_agent_collaboration.json',
    size: '22.4 KB',
    updated: '5 hours ago',
    type: 'n8n Workflow Export',
    vectors: 12,
    status: 'Indexed (pgvector)'
  },
  {
    name: 'food_delivery_schema.prisma',
    size: '8.2 KB',
    updated: 'Yesterday',
    type: 'Database Schema',
    vectors: 24,
    status: 'Indexed (pgvector)'
  }
];

export default function ProjectFilesPage() {
  return (
    <ModuleLayout
      title="Project Storage & Vector Assets"
      subtitle="Documents, schemas, and assets bound to this workspace and indexed for agent RAG retrieval"
      subnav={projectsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/storage"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            Global Storage Explorer
          </Link>
          <button
            onClick={() => alert("File upload dialog: Drag and drop documents to vectorize.")}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Asset
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {projectFiles.map(file => (
            <div
              key={file.name}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{file.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.type}</span>
                    <span>•</span>
                    <span>Modified {file.updated}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> {file.status} ({file.vectors} vectors)
                </span>
                <button
                  onClick={() => alert(`Downloading ${file.name}`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
