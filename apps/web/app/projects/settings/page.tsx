'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sliders, Save, Trash2, ArrowLeft, Shield, Lock } from 'lucide-react';

const projectsSubnav = [
  { label: 'All Projects', href: '/projects' },
  { label: 'New Project', href: '/projects/create' },
  { label: 'Tasks', href: '/projects/tasks' },
  { label: 'Kanban Board', href: '/projects/kanban' },
  { label: 'Timeline', href: '/projects/timeline' },
  { label: 'Team Members', href: '/projects/team' },
  { label: 'Project Files', href: '/projects/files' },
  { label: 'Project Reports', href: '/projects/reports' },
  { label: 'Settings', href: '/projects/settings' },
];

export default function ProjectSettingsPage() {
  const [name, setName] = useState('Food Delivery Platform Architecture');
  const [autoCommit, setAutoCommit] = useState(true);
  const [notifySlack, setNotifySlack] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ModuleLayout
      title="Project Settings & Governance"
      subtitle="Configure project defaults, webhook triggers, access permissions, and danger zone"
      subnav={projectsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      }
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">General Parameters</h3>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Auto-commit Agent Artifacts to GitHub</div>
                <div className="text-[11px] text-slate-400">Push verified code artifacts directly into connected repository branches.</div>
              </div>
              <input
                type="checkbox"
                checked={autoCommit}
                onChange={(e) => setAutoCommit(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Slack / Discord Run Notifications</div>
                <div className="text-[11px] text-slate-400">Dispatch webhook payloads when milestone tasks complete.</div>
              </div>
              <input
                type="checkbox"
                checked={notifySlack}
                onChange={(e) => setNotifySlack(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
          <h3 className="text-base font-bold text-rose-400">Danger Zone</h3>
          <p className="text-xs text-slate-400">
            Archiving or deleting this project will unbind associated agent memory vectors and cancel scheduled DAG runs.
          </p>
          <button
            type="button"
            onClick={() => alert("Project deletion requires cluster administrator role.")}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Archive Project Workspace
          </button>
        </div>
      </form>
    </ModuleLayout>
  );
}
