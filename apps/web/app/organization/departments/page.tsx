'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Building, Plus, DollarSign, Users } from 'lucide-react';

const orgSubnav = [
  { label: 'Organization Overview', href: '/organization' },
  { label: 'Teams', href: '/organization/teams' },
  { label: 'Members', href: '/organization/members' },
  { label: 'Departments', href: '/organization/departments' },
  { label: 'Organization Settings', href: '/organization/settings' },
];

const departments = [
  { name: 'Core Engineering', head: 'Jaswant Karun', members: 4, budget: '$150.00 / mo', spend: '$92.40' },
  { name: 'Data Science & Lab', head: 'Marcus Chen', members: 3, budget: '$100.00 / mo', spend: '$58.10' },
  { name: 'Security & Operations', head: 'Sarah Lin', members: 2, budget: '$80.00 / mo', spend: '$24.60' },
];

export default function OrganizationDepartmentsPage() {
  return (
    <ModuleLayout
      title="Corporate Departments & Budgets"
      subtitle="Allocate organizational compute budgets, monitor departmental spend, and enforce usage quotas"
      subnav={orgSubnav}
      actions={
        <button
          onClick={() => alert("Add Department modal")}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Department
        </button>
      }
    >
      <div className="space-y-4">
        {departments.map(d => (
          <div
            key={d.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">{d.name}</h4>
              </div>
              <div className="text-xs text-slate-400">
                Department Head: <strong className="text-slate-200">{d.head}</strong> • {d.members} Assigned Seats
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-center">
              <div>
                <span className="text-slate-500 block text-[11px]">Monthly Budget</span>
                <span className="text-white font-bold">{d.budget}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Current Spend</span>
                <span className="text-emerald-400 font-bold">{d.spend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
