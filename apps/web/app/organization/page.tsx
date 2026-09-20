'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Building, Users, Shield, Plus, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const orgSubnav = [
  { label: 'Organization Overview', href: '/organization' },
  { label: 'Teams', href: '/organization/teams' },
  { label: 'Members', href: '/organization/members' },
  { label: 'Departments', href: '/organization/departments' },
  { label: 'Organization Settings', href: '/organization/settings' },
];

export default function OrganizationHubPage() {
  return (
    <ModuleLayout
      title="Enterprise Organization & Cluster Governance"
      subtitle="Manage corporate departments, multi-seat team access, single sign-on, and RBAC policies"
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
        {/* Org Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-300">
              NA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Nexus AI Enterprise Cluster</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Enterprise Tier
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Managed by <strong className="text-slate-200 font-medium">Jaswant Karun</strong> (Super Admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Total Seats</span>
              <span className="text-white font-bold">4 / 10 Allocated</span>
            </div>
            <div>
              <span className="text-slate-500 block">SSO Status</span>
              <span className="text-emerald-400 font-bold">Enforced (SAML 2.0)</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/organization/members"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Users className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              Member Directory
            </h3>
            <p className="text-xs text-slate-400">
              Manage human engineers and autonomous agent roles across corporate seats.
            </p>
          </Link>

          <Link
            href="/organization/teams"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Building className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              Teams & Pods
            </h3>
            <p className="text-xs text-slate-400">
              Segment projects, agents, and data storage into functional pod units.
            </p>
          </Link>

          <Link
            href="/organization/departments"
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group block"
          >
            <Shield className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
              Departments & Budgets
            </h3>
            <p className="text-xs text-slate-400">
              Set departmental token limits and track cross-cost allocation.
            </p>
          </Link>
        </div>
      </div>
    </ModuleLayout>
  );
}
