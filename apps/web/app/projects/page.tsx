'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  FileText 
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

interface ProjectSummary {
  id: string;
  name: string;
  desc: string;
  status: string;
  progress: number;
  tasksCount: number;
  members: string[];
  updated: string;
}

const mockProjects: ProjectSummary[] = [
  {
    id: 'proj-food-delivery',
    name: 'Food Delivery Platform Architecture',
    desc: 'Autonomous multi-agent system specification, real-time dispatch, and PostgreSQL pgvector schema.',
    status: 'In Progress',
    progress: 75,
    tasksCount: 24,
    members: ['Jaswant Karun', 'Agent 3 Critic', 'Orchestrator'],
    updated: '20 minutes ago'
  },
  {
    id: 'proj-enterprise-rag',
    name: 'Enterprise Hybrid RAG Knowledge Engine',
    desc: 'Integration between pgvector, Neo4j knowledge graphs, and semantic embeddings for corporate document search.',
    status: 'Active',
    progress: 90,
    tasksCount: 18,
    members: ['Jaswant Karun', 'Research Agent'],
    updated: '2 hours ago'
  },
  {
    id: 'proj-agent-marketplace',
    name: 'Autonomous Agent Marketplace & Sandbox',
    desc: 'Public and private agent persona directory with gVisor container isolation and micro-billing.',
    status: 'Planning',
    progress: 35,
    tasksCount: 42,
    members: ['Jaswant Karun', 'Full-Stack Synthesizer'],
    updated: 'Yesterday'
  }
];

export default function ProjectsHubPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedProjects = window.localStorage.getItem('nexus_projects');
    if (!storedProjects) return;

    try {
      const createdProjects = JSON.parse(storedProjects) as ProjectSummary[];
      setProjects((current) => [
        ...createdProjects.filter((created) => !current.some((project) => project.id === created.id)),
        ...current,
      ]);
    } catch {
      window.localStorage.removeItem('nexus_projects');
    }
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Engineering Projects & Workspaces"
      subtitle="Organize multi-agent workflows, deliverables, task boards, and team collaboration"
      subnav={projectsSubnav}
      actions={
        <Link
          href="/projects/create"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> New Project
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Active Projects
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(proj => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    proj.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    proj.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {proj.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {proj.updated}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {proj.desc}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Milestone Progress</span>
                    <span className="font-mono text-slate-200">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>

              <div>
                <div className="py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> {proj.members.length} Collaborators
                  </span>
                  <span>{proj.tasksCount} Tasks</span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/projects/kanban?project=${proj.id}`}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Open Kanban
                  </Link>
                  <Link
                    href={`/projects/${proj.id}`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow"
                  >
                    Project Room <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
