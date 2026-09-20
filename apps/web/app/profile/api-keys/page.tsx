'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Key, Plus, Trash2, Copy, Check, ShieldCheck } from 'lucide-react';

const profileSubnav = [
  { label: 'Profile Overview', href: '/profile' },
  { label: 'Account Details', href: '/profile/account' },
  { label: 'Security & 2FA', href: '/profile/security' },
  { label: 'Preferences', href: '/profile/preferences' },
  { label: 'Billing & Plan', href: '/profile/billing' },
  { label: 'Personal API Keys', href: '/profile/api-keys' },
];

const mockKeys = [
  { id: '1', name: 'CLI Development Token', keyMask: 'nx_live_948a7b...e1', created: 'Sep 1, 2026', lastUsed: '2 hours ago' },
  { id: '2', name: 'n8n Automation Secret', keyMask: 'nx_live_20bc49...8a', created: 'Aug 24, 2026', lastUsed: 'Yesterday' }
];

export default function ProfileApiKeysPage() {
  const [keys, setKeys] = useState(mockKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ModuleLayout
      title="Personal Developer Access Tokens"
      subtitle="Generate personal API tokens for CLI toolchains, curl scripts, and local SDK development"
      subnav={profileSubnav}
      actions={
        <button
          onClick={() => {
            const name = prompt('Key Name:');
            if (name) {
              setKeys([...keys, {
                id: Date.now().toString(),
                name,
                keyMask: `nx_live_${Math.random().toString(36).substring(2, 10)}...`,
                created: 'Just now',
                lastUsed: 'Never'
              }]);
            }
          }}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Generate Token
        </button>
      }
    >
      <div className="space-y-4">
        {keys.map(k => (
          <div
            key={k.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{k.name}</h4>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block mt-1">
                {k.keyMask}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Created {k.created} • Last used {k.lastUsed}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleCopy(k.id, k.keyMask)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Token"
              >
                {copiedId === k.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setKeys(keys.filter(x => x.id !== k.id))}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Revoke Token"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
