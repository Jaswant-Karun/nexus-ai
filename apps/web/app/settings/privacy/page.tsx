'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { ShieldCheck, Lock, EyeOff, Trash2, Download, CheckCircle2 } from 'lucide-react';

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

export default function PrivacySettingsPage() {
  const [allowTelemetry, setAllowTelemetry] = useState(false);
  const [modelTrainingExclusion, setModelTrainingExclusion] = useState(true);
  const [ephemeralMemoryRetention, setEphemeralMemoryRetention] = useState('30');
  const [anonymizeLogs, setAnonymizeLogs] = useState(true);

  return (
    <ModuleLayout
      title="Data Privacy & Compliance Governance"
      subtitle="Manage data retention policies, zero-retention model agreements, and GDPR/SOC2 compliance export"
      subnav={settingsSubnav}
      actions={
        <button
          onClick={() => alert('Initiating comprehensive GDPR/SOC2 tenant archive download...')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export All Data
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {/* Compliance Guarantee Banner */}
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Zero Model Training Guarantee</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              NEXUS AI Enterprise is under strict zero-data retention agreements with upstream foundation model providers (OpenAI, Anthropic, Google). Your enterprise prompts, transcripts, and vector chunks are never stored or used for model training.
            </p>
          </div>
        </div>

        {/* Policies */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Retention & Anonymization
          </h3>

          <div className="space-y-4 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Anonymize PII in Log Streams</span>
                <span className="text-slate-400 block">Automatically redact emails, phone numbers, and credit cards from internal agent logs.</span>
              </div>
              <input
                type="checkbox"
                checked={anonymizeLogs}
                onChange={(e) => setAnonymizeLogs(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Anonymous Usage Telemetry</span>
                <span className="text-slate-400 block">Send aggregated UI crash and latency metrics to help improve NEXUS.</span>
              </div>
              <input
                type="checkbox"
                checked={allowTelemetry}
                onChange={(e) => setAllowTelemetry(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Chat Session Retention</span>
                <span className="text-slate-400 block">Automatic purging duration for conversational memory vectors.</span>
              </div>
              <select
                value={ephemeralMemoryRetention}
                onChange={(e) => setEphemeralMemoryRetention(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
                <option value="never">Indefinite (Manual Delete)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Tenant Purge & Data Deletion</h4>
          <p className="text-xs text-slate-400">
            Permanently erase all stored agent sessions, vector index embeddings, and user records. This action is irreversible.
          </p>
          <button
            onClick={() => alert('Tenant purge requires two-factor authentication from the primary organization owner.')}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purge Entire Tenant Store
          </button>
        </div>
      </div>
    </ModuleLayout>
  );
}
