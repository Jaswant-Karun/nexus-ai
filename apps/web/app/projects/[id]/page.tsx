'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  ArrowLeft, Plus, Users, CheckCircle2, Clock, FolderKanban,
  FileText, Activity, Target, Calendar, Bot, BarChart3,
  AlertCircle, Circle, ChevronRight
} from 'lucide-react';

const projectsSubnav = [
  { label: 'All Projects', href: '/projects' },
  { label: 'New Project', href: '/projects/create' },
  { label: 'Kanban Board', href: '/projects/kanban' },
  { label: 'Timeline', href: '/projects/timeline' },
];

const projectData: Record<string, {
  name: string; desc: string; status: string; progress: number;
  startDate: string; dueDate: string; members: { name: string; role: string; avatar: string }[];
  tasks: { id: string; title: string; status: 'done' | 'in-progress' | 'todo'; assignee: string; priority: 'high' | 'medium' | 'low' }[];
  files: { name: string; type: string; size: string; updated: string }[];
  stats: { label: string; value: string; color: string }[];
}> = {
  'proj-food-delivery': {
    name: 'Food Delivery Platform Architecture',
    desc: 'Autonomous multi-agent system specification, real-time dispatch, and PostgreSQL pgvector schema.',
    status: 'In Progress',
    progress: 75,
    startDate: 'Aug 20, 2026',
    dueDate: 'Sep 20, 2026',
    members: [
      { name: 'Jaswant Karun', role: 'Project Lead', avatar: 'JK' },
      { name: 'Orchestrator Agent', role: 'AI Coordinator', avatar: 'OA' },
      { name: 'Critic Agent', role: 'QA Verifier', avatar: 'CA' },
    ],
    tasks: [
      { id: 't1', title: 'Design PostgreSQL schema with pgvector extension', status: 'done', assignee: 'Code Agent', priority: 'high' },
      { id: 't2', title: 'Build real-time geo-dispatch algorithm', status: 'done', assignee: 'Research Agent', priority: 'high' },
      { id: 't3', title: 'Implement driver matching service with WebSocket', status: 'in-progress', assignee: 'Code Agent', priority: 'high' },
      { id: 't4', title: 'Create order lifecycle state machine', status: 'in-progress', assignee: 'Jaswant Karun', priority: 'medium' },
      { id: 't5', title: 'Write API contracts for restaurant partner integrations', status: 'todo', assignee: 'Jaswant Karun', priority: 'medium' },
      { id: 't6', title: 'Performance test with 10k concurrent orders', status: 'todo', assignee: 'Analytics Agent', priority: 'low' },
    ],
    files: [
      { name: 'Architecture-Spec-v3.pdf', type: 'PDF', size: '2.4 MB', updated: '2 days ago' },
      { name: 'db-schema.sql', type: 'SQL', size: '48 KB', updated: '5 hours ago' },
      { name: 'dispatch-algorithm.py', type: 'Python', size: '12 KB', updated: 'Yesterday' },
    ],
    stats: [
      { label: 'Tasks Done', value: '2 / 6', color: 'text-emerald-400' },
      { label: 'In Progress', value: '2', color: 'text-indigo-400' },
      { label: 'Blocked', value: '0', color: 'text-red-400' },
      { label: 'Days Left', value: '12', color: 'text-amber-400' },
    ],
  },
  'proj-enterprise-rag': {
    name: 'Enterprise Hybrid RAG Knowledge Engine',
    desc: 'Integration between pgvector, Neo4j knowledge graphs, and semantic embeddings for corporate document search.',
    status: 'Active',
    progress: 90,
    startDate: 'Aug 1, 2026',
    dueDate: 'Sep 15, 2026',
    members: [
      { name: 'Jaswant Karun', role: 'Project Lead', avatar: 'JK' },
      { name: 'Research Agent', role: 'Data Analyst', avatar: 'RA' },
    ],
    tasks: [
      { id: 't7', title: 'Set up pgvector with HNSW indexing', status: 'done', assignee: 'Code Agent', priority: 'high' },
      { id: 't8', title: 'Implement document chunking strategy', status: 'done', assignee: 'Research Agent', priority: 'high' },
      { id: 't9', title: 'Build hybrid BM25 + semantic re-ranking', status: 'done', assignee: 'Code Agent', priority: 'high' },
      { id: 't10', title: 'Create knowledge graph entity extraction pipeline', status: 'in-progress', assignee: 'Knowledge Agent', priority: 'medium' },
      { id: 't11', title: 'Evaluate retrieval accuracy on enterprise corpus', status: 'todo', assignee: 'Analytics Agent', priority: 'medium' },
    ],
    files: [
      { name: 'RAG-Architecture.md', type: 'Markdown', size: '18 KB', updated: '1 week ago' },
      { name: 'embedding-pipeline.py', type: 'Python', size: '8 KB', updated: '3 days ago' },
    ],
    stats: [
      { label: 'Tasks Done', value: '3 / 5', color: 'text-emerald-400' },
      { label: 'In Progress', value: '1', color: 'text-indigo-400' },
      { label: 'Blocked', value: '0', color: 'text-red-400' },
      { label: 'Days Left', value: '7', color: 'text-amber-400' },
    ],
  },
};

const defaultProject = {
  name: 'Project Not Found',
  desc: 'This project does not exist or has been removed.',
  status: 'Unknown',
  progress: 0,
  startDate: '—',
  dueDate: '—',
  members: [],
  tasks: [],
  files: [],
  stats: [],
};

const priorityColors = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const statusIcons = {
  'done': <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  'in-progress': <Activity className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
  'todo': <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />,
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const project = projectData[id] || defaultProject;
  const [activeTab, setActiveTab] = useState<'tasks' | 'files' | 'team'>('tasks');

  return (
    <ModuleLayout
      title={project.name}
      subtitle={project.desc}
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
            href="/projects/create"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {project.stats.map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Progress */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" /> Milestone Progress
                </h3>
                <span className="text-2xl font-bold text-white">{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="flex border-b border-slate-800">
                {(['tasks', 'files', 'team'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-white border-b-2 border-indigo-500 bg-slate-800/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab === 'tasks' ? `Tasks (${project.tasks.length})` :
                     tab === 'files' ? `Files (${project.files.length})` : 'Team'}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'tasks' && (
                  <div className="space-y-2">
                    {project.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                        {statusIcons[task.status]}
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{task.assignee}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                    {project.tasks.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">No tasks yet. Create your first task.</p>
                    )}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="space-y-2">
                    {project.files.map(file => (
                      <div key={file.name} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-slate-200">{file.name}</div>
                          <div className="text-[11px] text-slate-500">{file.type} • {file.size} • {file.updated}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    ))}
                    {project.files.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">No files attached.</p>
                    )}
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-3">
                    {project.members.map(m => (
                      <div key={m.name} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {m.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-400">{m.role}</div>
                        </div>
                      </div>
                    ))}
                    {project.members.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">No team members assigned.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Project Info */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-400" /> Project Info
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Status', value: project.status },
                  { label: 'Start Date', value: project.startDate },
                  { label: 'Due Date', value: project.dueDate },
                  { label: 'Members', value: `${project.members.length} collaborators` },
                ].map(info => (
                  <div key={info.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{info.label}</span>
                    <span className="text-xs text-white font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
              <Link
                href={`/projects/kanban?project=${id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                <FolderKanban className="w-3.5 h-3.5" /> Open Kanban Board
              </Link>
              <Link
                href="/chat"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Project Assistant
              </Link>
              <Link
                href={`/reports/create?project=${id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-400" /> Generate Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
