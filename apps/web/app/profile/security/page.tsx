'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { ShieldCheck, Key, Lock, CheckCircle2, Smartphone } from 'lucide-react';

const profileSubnav = [
  { label: 'Profile Overview', href: '/profile' },
  { label: 'Account Details', href: '/profile/account' },
  { label: 'Security & 2FA', href: '/profile/security' },
  { label: 'Preferences', href: '/profile/preferences' },
  { label: 'Billing & Plan', href: '/profile/billing' },
  { label: 'Personal API Keys', href: '/profile/api-keys' },
];

export default function ProfileSecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <ModuleLayout
      title="Security, Authentication & Keys"
      subtitle="Manage hardware security tokens, two-factor authentication, and password policies"
      subnav={profileSubnav}
    >
      <div className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Two-Factor Authentication
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Authenticator App (TOTP)</div>
                <div className="text-[11px] text-slate-400">Google Authenticator, 1Password, or Authy</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Enabled
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Password & Sessions
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Active Login Sessions</div>
              <div className="text-[11px] text-slate-400">Current browser on Windows 11 (IP: 127.0.0.1)</div>
            </div>
            <button
              onClick={() => alert("All other sessions revoked.")}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Revoke Other Sessions
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
