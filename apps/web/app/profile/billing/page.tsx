'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { CreditCard, CheckCircle2, ArrowUpRight, DollarSign } from 'lucide-react';

const profileSubnav = [
  { label: 'Profile Overview', href: '/profile' },
  { label: 'Account Details', href: '/profile/account' },
  { label: 'Security & 2FA', href: '/profile/security' },
  { label: 'Preferences', href: '/profile/preferences' },
  { label: 'Billing & Plan', href: '/profile/billing' },
  { label: 'Personal API Keys', href: '/profile/api-keys' },
];

export default function ProfileBillingPage() {
  return (
    <ModuleLayout
      title="Personal Billing & Subscription Tier"
      subtitle="View your personal compute allowance, invoices, and payment methods"
      subnav={profileSubnav}
      actions={
        <Link
          href="/billing"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" /> Full Billing Portal
        </Link>
      }
    >
      <div className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Active Plan</span>
              <h3 className="text-xl font-bold text-white mt-1">Enterprise Developer Plan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Unlimited DAG executions, dedicated pgvector index instance, and high-frequency rate limits.
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Next billing date: <strong className="text-slate-200">October 1, 2026</strong></span>
            <span className="font-mono text-emerald-400 font-bold">$49.00 / month</span>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
