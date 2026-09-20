'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { MessageSquare, ArrowLeft, ArrowUpRight, Share2, Download, Bot } from 'lucide-react';

const chatSubnav = [
  { label: 'Active Chat', href: '/chat' },
  { label: 'New Conversation', href: '/chat/new' },
  { label: 'History', href: '/chat/history' },
  { label: 'Share', href: '/chat/share' },
  { label: 'Export', href: '/chat/export' },
];

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params?.conversationId as string || 'default-session';

  return (
    <ModuleLayout
      title={`Thread: ${conversationId}`}
      subtitle="Context-isolated multi-agent conversational session"
      subnav={chatSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/chat/history"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to History
          </Link>
          <Link
            href={`/chat?session=${conversationId}`}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Open in Copilot Canvas
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Thread Session Metadata</h3>
                <span className="font-mono text-xs text-slate-400">ID: {conversationId}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/chat/share?session=${conversationId}`}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center gap-1"
              >
                <Share2 className="w-4 h-4" />
              </Link>
              <Link
                href={`/chat/export?session=${conversationId}`}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 mb-1">User Prompt (Initial Turn)</div>
              <p className="text-sm text-slate-200">
                Generate the multi-agent system architecture and database schema for food delivery dispatch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 mb-1">
                <span>NEXUS Auto (GPT-4o)</span>
                <span className="font-mono text-[11px]">842 tokens • 182ms</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Here is the verified architecture for the Food Delivery System. The orchestration workflow contains 4 sequential nodes: Customer Order Ingestion, Driver Geolocation Matching, Merchant Kitchen State Machine, and Real-Time Delivery Tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
