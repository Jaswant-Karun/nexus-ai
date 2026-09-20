'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { ShieldCheck, Lock, CheckCircle2, Key } from 'lucide-react';

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

export default function AdminSecurityPage() {
  return (
    <ModuleLayout
      title="Global Security Posture & Compliance"
      subtitle="Hardware security enforcement, SAML identity providers, and zero-trust perimeter configuration"
      subnav={adminSubnav}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Global 2FA Enforcement</div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> 100% Compliant
            </div>
            <div className="text-xs text-slate-500 mt-1">FIDO2 & TOTP enabled</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Encryption at Rest</div>
            <div className="text-2xl font-bold text-white font-mono">AES-256</div>
            <div className="text-xs text-emerald-400 mt-1">PostgreSQL & Disk volumes</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">In-Flight Encryption</div>
            <div className="text-2xl font-bold text-white font-mono">TLS 1.3 / mTLS</div>
            <div className="text-xs text-emerald-400 mt-1">Internal service-to-service</div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
