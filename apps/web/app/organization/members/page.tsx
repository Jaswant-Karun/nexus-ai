'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Users, Plus, Shield, Search, MoreVertical, Trash2 } from 'lucide-react';

const orgSubnav = [
  { label: 'Organization Overview', href: '/organization' },
  { label: 'Teams', href: '/organization/teams' },
  { label: 'Members', href: '/organization/members' },
  { label: 'Departments', href: '/organization/departments' },
  { label: 'Organization Settings', href: '/organization/settings' },
];

const members = [
  { id: '1', name: 'Jaswant Karun', email: 'jaswant.karun@nexusai.io', role: 'Super Admin', dept: 'Engineering', status: 'Active' },
  { id: '2', name: 'Marcus Chen', email: 'marcus.chen@nexusai.io', role: 'Developer', dept: 'Data Science', status: 'Active' },
  { id: '3', name: 'Sarah Lin', email: 'sarah.lin@nexusai.io', role: 'Security Admin', dept: 'Security & Operations', status: 'Active' },
  { id: '4', name: 'Alex Rivera', email: 'alex.rivera@nexusai.io', role: 'Operator', dept: 'Product', status: 'Invited' },
];

export default function OrganizationMembersPage() {
  const [search, setSearch] = useState('');

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Organization Member Directory"
      subtitle="Manage human seats, security role assignments, and single sign-on access"
      subnav={orgSubnav}
      actions={
        <Link
          href="/organization-invite"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Invite Teammates
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Members</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{m.email}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-400">{m.role}</td>
                  <td className="px-6 py-4 text-slate-300">{m.dept}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                      m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleLayout>
  );
}
