'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Save, Moon, Bell, Monitor, Globe } from 'lucide-react';

const profileSubnav = [
  { label: 'Profile Overview', href: '/profile' },
  { label: 'Account Details', href: '/profile/account' },
  { label: 'Security & 2FA', href: '/profile/security' },
  { label: 'Preferences', href: '/profile/preferences' },
  { label: 'Billing & Plan', href: '/profile/billing' },
  { label: 'Personal API Keys', href: '/profile/api-keys' },
];

export default function ProfilePreferencesPage() {
  const [theme, setTheme] = useState('dark');
  const [streamAudio, setStreamAudio] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="User Interface & Audio Preferences"
      subtitle="Customize your platform theme, streaming behavior, and notification sounds"
      subnav={profileSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Preferences Saved!' : 'Save Preferences'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Appearance & Theme
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode (OLED)', icon: Moon },
              { id: 'slate', label: 'Slate Gray', icon: Monitor },
              { id: 'system', label: 'System Default', icon: Globe },
            ].map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    theme === opt.id
                      ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                  <div className="text-xs font-semibold">{opt.label}</div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Audio Chime on Agent Consensus</div>
                <div className="text-[11px] text-slate-400">Play subtle auditory alert when Critic Agent completes verification.</div>
              </div>
              <input
                type="checkbox"
                checked={streamAudio}
                onChange={(e) => setStreamAudio(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </div>
        </div>
      </form>
    </ModuleLayout>
  );
}
