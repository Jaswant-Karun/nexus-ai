'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Building, Plus, ShieldCheck, ArrowUpRight } from 'lucide-react';

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

export default function AdminOrganizationsPage() {
  return (
    <ModuleLayout
      title="Multi-Tenant Organizations"
      subtitle="Super-admin tenant partitioning, custom domain bindings, and SAML SSO routing"
      subnav={adminSubnav}
    >
      <div className="space-y-4">
        {[
          { name: 'Nexus AI Enterprise Cluster', domain: 'nexusai.io', tier: 'Enterprise Tier', seats: '4 / 10 Seats', sso: 'Active (SAML 2.0)' }
        ].map(org => (
          <div
            key={org.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{org.name}</h4>
                <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {org.tier}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Domain: <span className="font-mono text-slate-300">{org.domain}</span> • {org.seats} • SSO: {org.sso}
              </div>
            </div>

            <Link
              href="/organization/settings"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 self-end sm:self-center"
            >
              Configure Tenant <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
