'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { User, Mail, Building, Save, ShieldCheck } from 'lucide-react';

const profileSubnav = [
  { label: 'Profile Overview', href: '/profile' },
  { label: 'Account Details', href: '/profile/account' },
  { label: 'Security & 2FA', href: '/profile/security' },
  { label: 'Preferences', href: '/profile/preferences' },
  { label: 'Billing & Plan', href: '/profile/billing' },
  { label: 'Personal API Keys', href: '/profile/api-keys' },
];

export default function ProfileAccountPage() {
  const [name, setName] = useState('Jaswant Karun');
  const [email, setEmail] = useState('jaswant.karun@nexusai.io');
  const [title, setTitle] = useState('Lead Systems Architect');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Personal Account Profile"
      subtitle="Manage your identity, professional role, and contact credentials"
      subnav={profileSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Profile Saved!' : 'Save Account Details'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-indigo-500/25">
              JK
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Jaswant Karun</h3>
              <p className="text-xs text-slate-400">Lead Systems Architect • Enterprise Administrator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Primary Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}
