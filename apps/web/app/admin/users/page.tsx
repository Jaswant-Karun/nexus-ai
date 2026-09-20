"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModuleLayout from "@/components/layout/ModuleLayout";
import { Search, Shield, UserCheck, Key, Users } from "lucide-react";

const adminSubnav = [
  { label: "Admin Overview",   href: "/admin" },
  { label: "Users",            href: "/admin/users" },
  { label: "Organizations",    href: "/admin/organizations" },
  { label: "Fleet Agents",     href: "/admin/agents" },
  { label: "Model Providers",  href: "/admin/models" },
  { label: "Workflows",        href: "/admin/workflows" },
  { label: "Storage & DB",     href: "/admin/storage" },
  { label: "Cluster Logs",     href: "/admin/logs" },
  { label: "Security & SSO",   href: "/admin/security" },
  { label: "System Health",    href: "/admin/system" },
  { label: "Backups",          href: "/admin/backups" },
  { label: "Admin Settings",   href: "/admin/settings" },
];

interface AdminUser {
  id:           string;
  name:         string;
  email:        string;
  role:         string;
  createdAt:    string;
  organization: { name: string; plan: string };
}

const ROLE_COLOR: Record<string, string> = {
  ADMIN:  "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20",
  MEMBER: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
  GUEST:  "text-gray-400 bg-gray-700/30 border border-gray-600/30",
  SYSTEM: "text-rose-400 bg-rose-500/10 border border-rose-500/20",
};

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d: { success: boolean; data?: AdminUser[] }) => {
        if (d.success && d.data) setUsers(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <ModuleLayout
      title="Global User Management & Access Control"
      subtitle="Provision identities, manage roles, audit authentication, and configure RBAC"
      subnav={adminSubnav}
    >
      <div className="space-y-6">
        {/* Search bar */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono shrink-0">
            {loading ? "…" : `${users.length} account${users.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Users table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-slate-800 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {search ? `No users matching "${search}"` : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${ROLE_COLOR[u.role] ?? ROLE_COLOR.MEMBER}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{u.organization.name}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">{u.organization.plan}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" title="Reset Auth"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" title="Verify User"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" title="Security"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleLayout>
  );
}
