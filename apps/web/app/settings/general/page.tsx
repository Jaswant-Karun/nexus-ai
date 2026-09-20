'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Save, CheckCircle2, Globe, Clock, Building2 } from 'lucide-react';

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

export default function GeneralSettingsPage() {
  const [appName, setAppName] = useState('NEXUS AI Enterprise');
  const [workspaceSlug, setWorkspaceSlug] = useState('acme-nexus-production');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en-US');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <ModuleLayout
      title="General Platform Configuration"
      subtitle="Workspace identifiers, local timezones, language localization, and global system metadata"
      subnav={settingsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {saved && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Workspace settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Workspace Name
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Workspace URL Identifier</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">https://nexus.ai/org/</span>
              <input
                type="text"
                value={workspaceSlug}
                onChange={(e) => setWorkspaceSlug(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white font-mono rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> System Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="de-DE">Deutsch (Germany)</option>
                <option value="ja-JP">日本語 (Japanese)</option>
                <option value="fr-FR">Français (France)</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </ModuleLayout>
  );
}
