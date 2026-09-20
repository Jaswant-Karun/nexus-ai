'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Users, UserCheck, ShieldCheck, Activity } from 'lucide-react';

const analyticsSubnav = [
  { label: 'Cluster Overview', href: '/analytics' },
  { label: 'AI & Models', href: '/analytics/ai' },
  { label: 'Workflows', href: '/analytics/workflows' },
  { label: 'Projects', href: '/analytics/projects' },
  { label: 'User Activity', href: '/analytics/users' },
  { label: 'Storage & Vectors', href: '/analytics/storage' },
  { label: 'Search Queries', href: '/analytics/search' },
  { label: 'Export Telemetry', href: '/analytics/export' },
];

export default function AnalyticsUsersPage() {
  return (
    <ModuleLayout
      title="User & Team Member Engagement Analytics"
      subtitle="Active seats, session frequency, copilot interaction volume, and role distribution"
      subnav={analyticsSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Active Team Seats</div>
            <div className="text-2xl font-bold text-white">4 Seats</div>
            <div className="text-xs text-emerald-400 mt-1">100% active this week</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Daily Active Sessions</div>
            <div className="text-2xl font-bold text-white font-mono">18 Sessions</div>
            <div className="text-xs text-indigo-400 mt-1">Copilot & DAG Builder</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Security Compliant Logins</div>
            <div className="text-2xl font-bold text-white">100% 2FA</div>
            <div className="text-xs text-emerald-400 mt-1">Enforced organization policy</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
