'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Share2, Copy, Check, Globe, Lock, Shield, ArrowLeft } from 'lucide-react';

const chatSubnav = [
  { label: 'Active Chat', href: '/chat' },
  { label: 'New Conversation', href: '/chat/new' },
  { label: 'History', href: '/chat/history' },
  { label: 'Share', href: '/chat/share' },
  { label: 'Export', href: '/chat/export' },
];

export default function ChatSharePage() {
  const [copied, setCopied] = useState(false);
  const [access, setAccess] = useState<'organization' | 'public' | 'password'>('organization');
  const [redactKeys, setRedactKeys] = useState(true);

  const shareUrl = "https://nexusai.io/share/c_98fa203b87d";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout
      title="Share Conversation"
      subtitle="Generate secure, interactive snapshot links of your AI dialogues and agent runs"
      subnav={chatSubnav}
      actions={
        <Link
          href="/chat"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Chat
        </Link>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Public & Team Share Link</h3>
            <p className="text-xs text-slate-400">
              Anyone with this link will view a snapshot of this conversation up to the current turn.
            </p>
          </div>

          {/* Copy Link Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          {/* Access Control Options */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Access Visibility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAccess('organization')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  access === 'organization'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">Team Only</span>
                </div>
                <p className="text-[11px] text-slate-500">Restricted to authenticated org members.</p>
              </button>

              <button
                type="button"
                onClick={() => setAccess('public')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  access === 'public'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Public Link</span>
                </div>
                <p className="text-[11px] text-slate-500">Accessible by anyone with the link.</p>
              </button>

              <button
                type="button"
                onClick={() => setAccess('password')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  access === 'password'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Passcode</span>
                </div>
                <p className="text-[11px] text-slate-500">Requires secret key to unlock.</p>
              </button>
            </div>
          </div>

          {/* Privacy Redaction Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Auto-Redact Sensitive Tokens</div>
              <div className="text-[11px] text-slate-400">Mask API keys, passwords, and private company emails.</div>
            </div>
            <input
              type="checkbox"
              checked={redactKeys}
              onChange={(e) => setRedactKeys(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
