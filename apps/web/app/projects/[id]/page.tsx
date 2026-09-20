'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FolderKanban, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  GitFork, 
  ArrowUpRight, 
  Sparkles, 
  Plus 
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

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string || 'proj-food-delivery';

  return (
    <ModuleLayout
      title={`Project: ${projectId}`}
      subtitle="Operational mission room, milestone roadmap, and agent assignments"
      subnav={projectsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/projects"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Projects
          </Link>
          <Link
            href={`/projects/kanban?project=${projectId}`}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <FolderKanban className="w-3.5 h-3.5" /> Open Kanban Board
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Project Header Info */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In Progress (75%)
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {projectId}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Food Delivery Platform Architecture</h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Autonomous multi-agent system specification, real-time dispatch, and PostgreSQL pgvector schema.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Lead Architect</span>
              <span className="text-white font-semibold">Jaswant Karun</span>
            </div>
            <div>
              <span className="text-slate-500 block">Lead Agent</span>
              <span className="text-indigo-400 font-mono">GPT-4o Orchestrator</span>
            </div>
          </div>
        </div>

        {/* Quick Tabs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active Tasks
              </h3>
              <span className="text-xs text-slate-400 font-mono">18 / 24 Done</span>
            </div>
            <p className="text-xs text-slate-400">
              6 remaining tasks assigned to OpenAI Consensus Critic for final code verification.
            </p>
            <Link
              href="/projects/tasks"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-2"
            >
              Inspect Task Backlog →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Attached Files
              </h3>
              <span className="text-xs text-slate-400 font-mono">4 Assets</span>
            </div>
            <p className="text-xs text-slate-400">
              Nexus_AI_Architecture.md and pgvector SQL schemas indexed in project storage.
            </p>
            <Link
              href="/projects/files"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-2"
            >
              Browse Storage Assets →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" /> Team & Agents
              </h3>
              <span className="text-xs text-slate-400 font-mono">3 Active</span>
            </div>
            <p className="text-xs text-slate-400">
              Human team members paired with autonomous worker personas.
            </p>
            <Link
              href="/projects/team"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-2"
            >
              Manage Collaborators →
            </Link>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
