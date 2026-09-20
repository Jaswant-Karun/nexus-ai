'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Users, 
  Plus, 
  Bot, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  MoreVertical, 
  Trash2 
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

const teamMembers = [
  {
    id: 'mem-1',
    name: 'Jaswant Karun',
    role: 'Lead Systems Architect & Owner',
    type: 'Human',
    email: 'jaswant.karun@nexusai.io',
    avatar: 'JK',
    status: 'Online'
  },
  {
    id: 'mem-2',
    name: 'NEXUS Master Orchestrator',
    role: 'Autonomous Project Lead',
    type: 'Agent (GPT-4o)',
    email: 'orchestrator@nexusai.internal',
    avatar: '🤖',
    status: 'Online'
  },
  {
    id: 'mem-3',
    name: 'OpenAI Consensus Critic (Agent 3)',
    role: 'Quality Assurance & Security Verifier',
    type: 'Agent (OpenAI Chat Model)',
    email: 'critic@nexusai.internal',
    avatar: '🛡️',
    status: 'Online'
  }
];

export default function ProjectTeamPage() {
  return (
    <ModuleLayout
      title="Project Team & Agent Pairings"
      subtitle="Manage permissions, collaborator invitations, and autonomous worker assignments"
      subnav={projectsSubnav}
      actions={
        <Link
          href="/organization-invite"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Invite Teammate
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {teamMembers.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                  {m.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{m.role}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{m.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
