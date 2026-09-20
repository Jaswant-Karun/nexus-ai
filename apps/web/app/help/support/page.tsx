'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { LifeBuoy, Send, CheckCircle2, Paperclip, Clock, MessageSquare } from 'lucide-react';

const helpSubnav = [
  { label: 'Help Center', href: '/help' },
  { label: 'FAQ', href: '/help/faq' },
  { label: 'Contact Support', href: '/help/support' },
  { label: 'Report Bug', href: '/help/report-bug' },
  { label: 'Feature Request', href: '/help/feature-request' },
];

export default function ContactSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [category, setCategory] = useState('TECHNICAL');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModuleLayout
      title="Contact Enterprise Support"
      subtitle="Connect directly with our engineering tier for technical troubleshooting and architecture review"
      subnav={helpSubnav}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {submitted ? (
          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Ticket Submitted Successfully</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your support ticket <span className="font-mono text-emerald-400 font-bold">#NX-89211</span> has been dispatched to our engineering desk. You will receive an email update within 15 minutes.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSubject('');
                setMessage('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TECHNICAL">Technical / Infrastructure</option>
                  <option value="AGENT_ERROR">Agent Runtime Execution</option>
                  <option value="WORKFLOW">Workflow Orchestrator</option>
                  <option value="BILLING">Billing & Quota Upgrade</option>
                  <option value="SECURITY">Security & Compliance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="LOW">Low (General guidance)</option>
                  <option value="NORMAL">Normal (Standard response)</option>
                  <option value="HIGH">High (Production degraded)</option>
                  <option value="CRITICAL">Critical (System offline / P1)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Description & Reproduction Steps</label>
              <textarea
                required
                rows={5}
                placeholder="Please describe what occurred, relevant agent IDs, timestamps, or expected outcomes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> SLA Response: &lt; 15 mins for High/Critical
              </span>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </ModuleLayout>
  );
}
