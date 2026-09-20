'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Key, Plus, Copy, Check, Trash2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const devSubnav = [
  { label: 'Developer Portal', href: '/developer' },
  { label: 'API Reference', href: '/developer/api-docs' },
  { label: 'SDKs & Libraries', href: '/developer/sdk' },
  { label: 'API Playground', href: '/developer/playground' },
  { label: 'Webhooks', href: '/developer/webhooks' },
  { label: 'API Keys', href: '/developer/api-keys' },
  { label: 'Developer Logs', href: '/developer/logs' },
];

export default function DeveloperApiKeysPage() {
  const [keys, setKeys] = useState([
    {
      id: 'key_1',
      name: 'Production Worker Key',
      prefix: 'nx_live_99fa****************',
      rawSecret: 'nx_live_99fa84c20e11894b9aa102848c',
      created: 'May 12, 2026',
      lastUsed: '4 mins ago',
      scope: 'Full Access (Read/Write)'
    },
    {
      id: 'key_2',
      name: 'Staging CI/CD Pipeline',
      prefix: 'nx_test_41ca****************',
      rawSecret: 'nx_test_41ca27b878201a09d37449a11',
      created: 'April 02, 2026',
      lastUsed: 'Yesterday',
      scope: 'Restricted (Agent Dispatch Only)'
    }
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecretId, setShowSecretId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newSecret = `nx_live_${randomHex}`;
    const newEntry = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: `nx_live_${randomHex.substring(0, 4)}****************`,
      rawSecret: newSecret,
      created: 'Just now',
      lastUsed: 'Never',
      scope: 'Full Access (Read/Write)'
    };
    setKeys([newEntry, ...keys]);
    setNewKeyName('');
    setIsGenerating(false);
    setShowSecretId(newEntry.id);
  };

  const copyKey = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <ModuleLayout
      title="API Keys & Access Tokens"
      subtitle="Manage cryptographic Bearer tokens for authenticating automated workloads and custom SDK applications"
      subnav={devSubnav}
      actions={
        <button
          onClick={() => setIsGenerating(!isGenerating)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Key
        </button>
      }
    >
      <div className="space-y-6">
        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>Keep your private keys confidential. Never commit raw tokens into client-side bundles or public GitHub repositories.</span>
        </div>

        {/* Generate Modal / Form */}
        {isGenerating && (
          <form onSubmit={handleGenerate} className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur space-y-4">
            <h3 className="text-sm font-semibold text-white">Create New Secret Key</h3>
            <div className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Key Name (e.g. Backend Microservice, Slack Bot)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-all"
              >
                Generate Token
              </button>
            </div>
          </form>
        )}

        {/* Active Keys */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-sm font-semibold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> Active Keys ({keys.length})
          </div>
          <div className="divide-y divide-slate-800/60">
            {keys.map((k) => (
              <div key={k.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{k.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {k.scope}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                    <span>{showSecretId === k.id ? k.rawSecret : k.prefix}</span>
                    <button
                      onClick={() => setShowSecretId(showSecretId === k.id ? null : k.id)}
                      className="text-slate-500 hover:text-slate-300 p-1"
                      title={showSecretId === k.id ? 'Hide Key' : 'Reveal Key'}
                    >
                      {showSecretId === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyKey(k.rawSecret, k.id)}
                      className="text-slate-500 hover:text-slate-300 p-1"
                      title="Copy Key"
                    >
                      {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Created: {k.created}</div>
                    <div className="text-[11px] text-slate-500">Last used: {k.lastUsed}</div>
                  </div>
                  <button
                    onClick={() => deleteKey(k.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
