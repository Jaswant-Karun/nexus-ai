'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Users, Plus, Building, ArrowUpRight } from 'lucide-react';

const orgSubnav = [
  { label: 'Organization Overview', href: '/organization' },
  { label: 'Teams', href: '/organization/teams' },
  { label: 'Members', href: '/organization/members' },
  { label: 'Departments', href: '/organization/departments' },
  { label: 'Organization Settings', href: '/organization/settings' },
];

const teams = [
  { id: 't-1', name: 'Platform Core & Multi-Agent Systems', lead: 'Jaswant Karun', membersCount: 4, projectsCount: 3 },
  { id: 't-2', name: 'Data Engineering & Vector Operations', lead: 'Marcus Chen', membersCount: 3, projectsCount: 2 },
  { id: 't-3', name: 'Enterprise Security & Audit QA', lead: 'Sarah Lin', membersCount: 2, projectsCount: 1 },
];

export default function OrganizationTeamsPage() {
  return (
    <ModuleLayout
      title="Engineering Teams & Pods"
      subtitle="Team groupings with role-based access to projects, agents, and vector storage"
      subnav={orgSubnav}
      actions={
        <button
          onClick={() => alert("Create Team modal")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Create Team
        </button>
      }
    >
      <div className="space-y-4">
        {teams.map(t => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
              </div>
              <div className="text-xs text-slate-400">
                Lead: <strong className="text-slate-200">{t.lead}</strong> • {t.membersCount} Members • {t.projectsCount} Active Projects
              </div>
            </div>

            <Link
              href={`/projects?team=${t.id}`}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              View Workspaces <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
