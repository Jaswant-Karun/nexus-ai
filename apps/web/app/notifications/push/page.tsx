'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Smartphone, BellRing, CheckCircle2, XCircle, Clock } from 'lucide-react';

const notifSubnav = [
  { label: 'All Notifications', href: '/notifications' },
  { label: 'Email Notifications', href: '/notifications/email' },
  { label: 'Push Notifications', href: '/notifications/push' },
  { label: 'Notification Settings', href: '/notifications/settings' },
];

export default function PushNotificationsPage() {
  const [pushes] = useState([
    {
      id: 'push_1',
      title: 'Workflow DAG Failed',
      body: 'CRM Sync Pipeline stopped on node #3: HTTP 408 Timeout from webhook.',
      time: '12 mins ago',
      type: 'ERROR'
    },
    {
      id: 'push_2',
      title: 'Agent Task Completed',
      body: 'Data Analyst Agent processed 4,800 records in 18 seconds.',
      time: '45 mins ago',
      type: 'SUCCESS'
    },
    {
      id: 'push_3',
      title: 'Vector Reindex Complete',
      body: 'Knowledge base cluster updated with 12 new documents.',
      time: '2 hours ago',
      type: 'INFO'
    }
  ]);

  return (
    <ModuleLayout
      title="Mobile & Browser Push Notifications"
      subtitle="Real-time Web Push telemetry delivered to connected desktop browsers and mobile devices"
      subnav={notifSubnav}
    >
      <div className="space-y-4 max-w-4xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/60 overflow-hidden">
          {pushes.map((p) => (
            <div key={p.id} className="p-5 flex items-start gap-4 hover:bg-slate-800/30 transition-colors">
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                p.type === 'ERROR'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : p.type === 'SUCCESS'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
                <BellRing className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{p.title}</h4>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
