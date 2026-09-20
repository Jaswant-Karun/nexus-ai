'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Save, ShieldCheck, Lock, Building } from 'lucide-react';

const orgSubnav = [
  { label: 'Organization Overview', href: '/organization' },
  { label: 'Teams', href: '/organization/teams' },
  { label: 'Members', href: '/organization/members' },
  { label: 'Departments', href: '/organization/departments' },
  { label: 'Organization Settings', href: '/organization/settings' },
];

export default function OrganizationSettingsPage() {
  const [orgName, setOrgName] = useState('Nexus AI Enterprise Cluster');
  const [enforce2fa, setEnforce2fa] = useState(true);
  const [enforceSso, setEnforceSso] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Organization Security & Tenant Policies"
      subtitle="Configure corporate single sign-on, identity providers, and two-factor mandates"
      subnav={orgSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Saved!' : 'Save Org Policies'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" /> Organization Profile
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Legal Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Mandatory Two-Factor Authentication (2FA)</div>
                <div className="text-[11px] text-slate-400">Require all members to verify via TOTP or WebAuthn hardware token.</div>
              </div>
              <input
                type="checkbox"
                checked={enforce2fa}
                onChange={(e) => setEnforce2fa(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">SAML 2.0 / Okta / Google Workspace SSO Enforced</div>
                <div className="text-[11px] text-slate-400">Prohibit password authentication for corporate email domains.</div>
              </div>
              <input
                type="checkbox"
                checked={enforceSso}
                onChange={(e) => setEnforceSso(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}
