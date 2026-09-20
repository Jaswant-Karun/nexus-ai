'use client';

import React, { useEffect, useState } from 'react';
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
  const [project, setProject] = useState<{ name: string; desc: string; status: string; progress: number; tasks?: Array<{ id: string; title: string; completed: boolean }> } | null>(null);

  useEffect(() => {
    const storedProjects = window.localStorage.getItem('nexus_projects');
    if (!storedProjects) return;
    try {
      const projects = JSON.parse(storedProjects) as Array<{ id: string; name: string; desc: string; status: string; progress: number; tasks?: Array<{ id: string; title: string; completed: boolean }> }>;
      setProject(projects.find((candidate) => candidate.id === projectId) ?? null);
    } catch {
      window.localStorage.removeItem('nexus_projects');
    }
  }, [projectId]);

  const projectName = project?.name ?? 'Food Delivery Platform Architecture';
  const projectDescription = project?.desc ?? 'Autonomous multi-agent system specification, real-time dispatch, and PostgreSQL pgvector schema.';
  const projectStatus = project ? `${project.status} (${project.progress}%)` : 'In Progress (75%)';
  const projectTasks = project?.tasks ?? [];

  function toggleTask(taskId: string) {
    if (!project) return;
    const tasks = project.tasks?.map((task) => (
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )) ?? [];
    const progress = tasks.length === 0 ? project.progress : Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100);
    const updatedProject = { ...project, tasks, progress, status: progress === 100 ? 'Complete' : 'Planning' };
    setProject(updatedProject);

    const storedProjects = window.localStorage.getItem('nexus_projects');
    if (!storedProjects) return;
    try {
      const projects = JSON.parse(storedProjects) as Array<typeof updatedProject & { id: string }>;
      window.localStorage.setItem('nexus_projects', JSON.stringify(projects.map((candidate) => candidate.id === projectId ? updatedProject : candidate)));
    } catch {
      window.localStorage.removeItem('nexus_projects');
    }
  }

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
                {projectStatus}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {projectId}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{projectName}</h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {projectDescription}
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

        {projectTasks.length > 0 && (
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Generated implementation tasks</h3>
              <span className="text-xs text-slate-400">{projectTasks.length} tasks</span>
            </div>
            <div className="space-y-2">
              {projectTasks.map((task, index) => (
                <button type="button" key={task.id} onClick={() => toggleTask(task.id)} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-200 transition hover:border-indigo-500/40">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${task.completed ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-600 text-transparent'}`}>✓</span>
                  <span className="text-xs font-mono text-indigo-400">0{index + 1}</span>
                  <span className={task.completed ? 'text-slate-500 line-through' : undefined}>{task.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

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
