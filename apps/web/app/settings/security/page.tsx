'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { ShieldCheck, Key, Smartphone, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const settingsSubnav = [
  { label: 'All Settings', href: '/settings' },
  { label: 'General', href: '/settings/general' },
  { label: 'Theme & Display', href: '/settings/theme' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Privacy & Data', href: '/settings/privacy' },
  { label: 'AI Models', href: '/settings/ai' },
  { label: 'Storage Engine', href: '/settings/storage' },
  { label: 'Integrations', href: '/settings/integrations' },
  { label: 'Security & Auth', href: '/settings/security' },
];

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('24h');
  const [enforcePasswordComplexity, setEnforcePasswordComplexity] = useState(true);

  return (
    <ModuleLayout
      title="Security, Authentication & Session Policies"
      subtitle="Configure multi-factor authentication, password expiration intervals, and tenant authorization policies"
      subnav={settingsSubnav}
    >
      <div className="max-w-3xl space-y-6">
        {/* Two-Factor Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-400">TOTP Authenticator app (Google Authenticator, 1Password)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
            </span>
          </div>
          <div className="pt-2 flex gap-3">
            <Link
              href="/2fa"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
            >
              Reconfigure 2FA Device
            </Link>
          </div>
        </div>

        {/* Session Rules */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Tenant Session Boundaries
          </h3>

          <div className="space-y-4 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <span className="font-semibold text-white block">Idle Session Expiration</span>
                <span className="text-slate-400">Automatically logout inactive web sessions.</span>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="1h">1 Hour</option>
                <option value="8h">8 Hours</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-semibold text-white block">Enforce Strong Password Complexity</span>
                <span className="text-slate-400">Require minimum 12 characters, numbers, and symbols for all team members.</span>
              </div>
              <input
                type="checkbox"
                checked={enforcePasswordComplexity}
                onChange={(e) => setEnforcePasswordComplexity(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
