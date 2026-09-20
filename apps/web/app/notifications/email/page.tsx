'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Mail, CheckCircle2, Clock, Inbox, ChevronRight } from 'lucide-react';

const notifSubnav = [
  { label: 'All Notifications', href: '/notifications' },
  { label: 'Email Notifications', href: '/notifications/email' },
  { label: 'Push Notifications', href: '/notifications/push' },
  { label: 'Notification Settings', href: '/notifications/settings' },
];

export default function EmailNotificationsPage() {
  const [emails] = useState([
    {
      id: 'em_1',
      subject: 'Weekly Agent Execution Performance & Cost Summary',
      recipient: 'jaswant@nexus.ai',
      date: 'Today at 08:00 AM',
      status: 'DELIVERED',
      preview: 'Across 14 active agents, 12,480 operations completed with a 99.8% success rating.'
    },
    {
      id: 'em_2',
      subject: 'Invoice INV-2026-07 Payment Received - $1,240.00',
      recipient: 'jaswant@nexus.ai',
      date: 'Yesterday at 09:14 AM',
      status: 'DELIVERED',
      preview: 'Thank you for your business. Your monthly enterprise billing cycle has processed successfully.'
    },
    {
      id: 'em_3',
      subject: 'Security Notice: New session initiated from Chrome on Windows',
      recipient: 'jaswant@nexus.ai',
      date: 'May 10, 2026',
      status: 'DELIVERED',
      preview: 'A new login occurred from IP 192.168.1.45. If this was not you, please rotate your keys immediately.'
    }
  ]);

  return (
    <ModuleLayout
      title="Email Notifications & Dispatch History"
      subtitle="Audit logs and previews of all transactional and digest emails delivered to your inbox"
      subnav={notifSubnav}
    >
      <div className="space-y-4 max-w-4xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/60 overflow-hidden">
          {emails.map((item) => (
            <div key={item.id} className="p-5 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">{item.subject}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{item.preview}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Sent to: <span className="text-slate-300 font-mono">{item.recipient}</span></span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
