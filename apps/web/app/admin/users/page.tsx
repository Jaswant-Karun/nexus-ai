'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Users, Search, Shield, UserCheck, Trash2, Key } from 'lucide-react';

const adminSubnav = [
  { label: 'Admin Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Organizations', href: '/admin/organizations' },
  { label: 'Fleet Agents', href: '/admin/agents' },
  { label: 'Model Providers', href: '/admin/models' },
  { label: 'Workflows', href: '/admin/workflows' },
  { label: 'Storage & DB', href: '/admin/storage' },
  { label: 'Cluster Logs', href: '/admin/logs' },
  { label: 'Security & SSO', href: '/admin/security' },
  { label: 'System Health', href: '/admin/system' },
  { label: 'Backups', href: '/admin/backups' },
  { label: 'Admin Settings', href: '/admin/settings' },
];

const users = [
  { id: 'usr-1', name: 'Jaswant Karun', email: 'jaswant.karun@nexusai.io', role: 'Super Admin', org: 'Nexus AI Enterprise', status: 'Active', mfa: 'Enforced' },
  { id: 'usr-2', name: 'Marcus Chen', email: 'marcus.chen@nexusai.io', role: 'Developer', org: 'Nexus AI Enterprise', status: 'Active', mfa: 'Enforced' },
  { id: 'usr-3', name: 'Sarah Lin', email: 'sarah.lin@nexusai.io', role: 'Security Admin', org: 'Nexus AI Enterprise', status: 'Active', mfa: 'Enforced' },
  { id: 'usr-4', name: 'Devin Vance', email: 'devin.vance@acmecorp.com', role: 'Viewer', org: 'Nexus AI Enterprise', status: 'Invited', mfa: 'Pending' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Global User Management & Access Control"
      subtitle="Provision identities, manage roles, audit authentication, and configure RBAC"
      subnav={adminSubnav}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Registered Accounts</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Cluster Role</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">2FA / MFA</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-400">{u.role}</td>
                  <td className="px-6 py-4 text-slate-300">{u.org}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">{u.mfa}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                      u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`Password reset link generated for ${u.email}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                    >
                      Reset Auth
                    </button>
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
