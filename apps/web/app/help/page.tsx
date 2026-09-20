'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  LifeBuoy, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Terminal
} from 'lucide-react';

const helpSubnav = [
  { label: 'Help Center', href: '/help' },
  { label: 'FAQ', href: '/help/faq' },
  { label: 'Contact Support', href: '/help/support' },
  { label: 'Report Bug', href: '/help/report-bug' },
  { label: 'Feature Request', href: '/help/feature-request' },
];

export default function HelpCenterPage() {
  return (
    <ModuleLayout
      title="Help Center & Knowledge Base"
      subtitle="Find documentation, troubleshooting guides, raise support tickets, and submit product feedback"
      subnav={helpSubnav}
      actions={
        <Link
          href="/help/support"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <LifeBuoy className="w-3.5 h-3.5" /> Submit Support Ticket
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Search Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 p-8 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-3.5 h-3.5" /> 24/7 Enterprise Assistance
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">How can we assist you today?</h2>
            <p className="text-xs text-slate-400">
              Explore step-by-step agent tutorials, workflow pipeline configuration, API references, or connect with an engineer.
            </p>
            <div className="relative max-w-md mx-auto pt-2">
              <input
                type="text"
                placeholder="Search troubleshooting guides, error codes, topics..."
                className="w-full bg-slate-900/90 border border-slate-700 text-xs text-white rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-indigo-500 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Core Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/help/faq"
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group block space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Knowledge Base & FAQ
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Frequently asked questions regarding agents, subscriptions, and LLM quotas.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium pt-1">
              Read FAQs <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/help/support"
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group block space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Direct Support
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Open a dedicated ticket with our engineering team for SLA-backed resolutions.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium pt-1">
              Open Ticket <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/help/report-bug"
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group block space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Report a Defect
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Submit an issue reproduction, log stack traces, and view resolution statuses.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-rose-400 font-medium pt-1">
              Report Bug <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/help/feature-request"
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group block space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Feature Wishlist
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Suggest new integrations, vote on upcoming roadmap capabilities, and give ideas.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-medium pt-1">
              Suggest Ideas <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Popular Articles */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Popular Troubleshooting Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { title: "Resolving '429 Rate Limit Exceeded' on OpenAI / Anthropic Provider Endpoints", category: "API & Models", href: "/help/faq" },
              { title: "Configuring Self-Hosted Docker or Kubernetes n8n Webhook Workers", category: "Workflows", href: "/help/faq" },
              { title: "Embedding Vector Indexes with pgvector & Hybrid ElasticSearch", category: "Storage & RAG", href: "/help/faq" },
              { title: "Deploying Custom Autonomous Multi-Agent Graphs with Fallback Nodes", category: "Agent Fleet", href: "/help/faq" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="text-[10px] text-indigo-400 uppercase font-semibold tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
