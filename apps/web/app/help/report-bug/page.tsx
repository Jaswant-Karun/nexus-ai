'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Bug, CheckCircle2, AlertTriangle, Code2, Send } from 'lucide-react';

const helpSubnav = [
  { label: 'Help Center', href: '/help' },
  { label: 'FAQ', href: '/help/faq' },
  { label: 'Contact Support', href: '/help/support' },
  { label: 'Report Bug', href: '/help/report-bug' },
  { label: 'Feature Request', href: '/help/feature-request' },
];

export default function ReportBugPage() {
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [component, setComponent] = useState('WORKFLOWS');
  const [steps, setSteps] = useState('');
  const [logs, setLogs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModuleLayout
      title="Report an Issue or Bug"
      subtitle="Help us improve NEXUS AI by detailing software bugs, edge cases, and unexpected system behavior"
      subnav={helpSubnav}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {submitted ? (
          <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Bug Report Logged</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Issue <span className="font-mono text-rose-400 font-bold">BUG-4190</span> has been assigned to our QA and core systems team. Thank you for helping us keep NEXUS rock-solid.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setTitle('');
                setSteps('');
                setLogs('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
            >
              Report Another Bug
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Affected Module / Area</label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="WORKFLOWS">Workflow Builder / DAG Canvas</option>
                  <option value="AGENTS">Agent Execution & Tool Dispatch</option>
                  <option value="CHAT">Chat & Model Streaming</option>
                  <option value="STORAGE">Storage & Vector Search</option>
                  <option value="INTEGRATIONS">n8n / Webhooks / API</option>
                  <option value="UI">Frontend UI & Layouts</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Issue Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., DAG fails to branch on conditional node"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Steps to Reproduce</label>
              <textarea
                required
                rows={4}
                placeholder="1. Navigate to /workflows/editor&#10;2. Add an OpenAI Agent node&#10;3. Connect output to webhook..."
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Console Log / Stack Trace (Optional)</span>
                <span className="text-[10px] text-slate-500 font-mono">stderr / json</span>
              </label>
              <textarea
                rows={3}
                placeholder="Paste any error logs or browser console traces here..."
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-rose-300 focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md shadow-rose-600/30 flex items-center gap-2"
              >
                <Bug className="w-3.5 h-3.5" /> Submit Bug Report
              </button>
            </div>
          </form>
        )}
      </div>
    </ModuleLayout>
  );
}
