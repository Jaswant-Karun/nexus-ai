'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Download, FileText, Code2, FileCode, CheckCircle2, ArrowLeft } from 'lucide-react';

const chatSubnav = [
  { label: 'Active Chat', href: '/chat' },
  { label: 'New Conversation', href: '/chat/new' },
  { label: 'History', href: '/chat/history' },
  { label: 'Share', href: '/chat/share' },
  { label: 'Export', href: '/chat/export' },
];

export default function ChatExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setDownloading(format);
    setTimeout(() => {
      // Mock client-side download
      const content = `# Nexus AI Conversation Transcript\nDate: ${new Date().toISOString()}\nUser: Jaswant Karun\n\n### User\nDesign the architecture for Food Delivery System multi-agent workflow.\n\n### NEXUS Auto (GPT-4o)\nThe system consists of 4 orchestrated nodes with consensus verification...`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-ai-transcript.${format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 800);
  };

  return (
    <ModuleLayout
      title="Export Conversation Data"
      subtitle="Export high-fidelity conversational transcripts, code blocks, and execution tokens"
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
            <h3 className="text-base font-bold text-white mb-1">Choose Export Format</h3>
            <p className="text-xs text-slate-400">
              Download transcripts formatted for documentation, model fine-tuning, or knowledge base ingestion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-white text-sm">Markdown (.md)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Formatted GitHub Flavored Markdown with preserved headers, syntax highlighted code, and tables.
                </p>
              </div>
              <button
                onClick={() => handleExport('md')}
                disabled={downloading !== null}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" /> {downloading === 'md' ? 'Exporting...' : 'Export Markdown'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">JSON Format (.json)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Raw message schema with role metadata, timestamps, token usage counts, and model provider telemetry.
                </p>
              </div>
              <button
                onClick={() => handleExport('json')}
                disabled={downloading !== null}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> {downloading === 'json' ? 'Exporting...' : 'Export JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
