'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bell, Mail, Smartphone, Save, CheckCircle2 } from 'lucide-react';

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

export default function NotificationSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [agentFailurePush, setAgentFailurePush] = useState(true);
  const [workflowSuccessNotif, setWorkflowSuccessNotif] = useState(false);
  const [securityIncidentAlert, setSecurityIncidentAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <ModuleLayout
      title="Notification Preferences & Alerts"
      subtitle="Define delivery channels, webhook dispatches, and trigger conditions for system events"
      subnav={settingsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Save Preferences
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {saved && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Notification preferences successfully updated.
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" /> Event Trigger Channels
          </h3>

          <div className="space-y-4 text-xs divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div className="space-y-0.5">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> Daily Email Digest
                </span>
                <span className="text-slate-400">Receive a morning breakdown of completed agent jobs and token consumption.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-rose-400" /> Agent Runtime Failures
                </span>
                <span className="text-slate-400">Immediate push alert if an agent encounters unrecoverable API errors or halts.</span>
              </div>
              <input
                type="checkbox"
                checked={agentFailurePush}
                onChange={(e) => setAgentFailurePush(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Workflow Pipeline Completions</span>
                <span className="text-slate-400">Notify when scheduled batch cron DAG pipelines execute successfully.</span>
              </div>
              <input
                type="checkbox"
                checked={workflowSuccessNotif}
                onChange={(e) => setWorkflowSuccessNotif(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Security & Auth Anomalies</span>
                <span className="text-slate-400">Instant notification upon new device logins or API key rotation.</span>
              </div>
              <input
                type="checkbox"
                checked={securityIncidentAlert}
                onChange={(e) => setSecurityIncidentAlert(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
