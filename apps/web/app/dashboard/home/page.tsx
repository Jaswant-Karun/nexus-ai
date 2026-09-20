'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Bot, 
  GitFork, 
  Database, 
  Cpu, 
  ArrowUpRight, 
  Activity, 
  Clock, 
  Play, 
  Sparkles,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';

const dashboardSubnav = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Home View', href: '/dashboard/home' },
  { label: 'Live Activity', href: '/dashboard/activity' },
  { label: 'Favorites', href: '/dashboard/favorites' },
  { label: 'Recent Runs', href: '/dashboard/recent' },
];

export default function DashboardHomePage() {
  return (
    <ModuleLayout
      title="Mission Control Home"
      subtitle="Unified operational hub for autonomous agents, workflow DAGs, and neural memory"
      subnav={dashboardSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            Open Copilot
          </Link>
          <Link
            href="/workflow"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" /> AI Workflow Builder
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Active Agent Clusters</span>
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">4 Online</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 100% operational health
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Workflow Runs (24h)</span>
              <GitFork className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,429</div>
            <div className="text-xs text-indigo-400 mt-1">99.2% success rate</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Vector Context Synced</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">14.8 GB</div>
            <div className="text-xs text-slate-400 mt-1">pgvector + Chroma DB</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Average Latency</span>
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">312 ms</div>
            <div className="text-xs text-emerald-400 mt-1">High-throughput streaming</div>
          </div>
        </div>

        {/* Quick Launchpad & Primary Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Quick Launch Studio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/agents/create"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    Deploy New Agent
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configure personality, system prompt, tools, and vector memory.
                </p>
              </Link>

              <Link
                href="/workflows/create"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    New DAG Workflow
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect agents, triggers, and APIs in visual node graph editor.
                </p>
              </Link>

              <Link
                href="/storage"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    Storage & Knowledge
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage persistent documents, embeddings, and vector indices.
                </p>
              </Link>

              <Link
                href="/knowledge-graph"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    Knowledge Graph
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visualize entity relationships across multi-agent shared contexts.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Platform Heartbeat
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Real-time connection to backend FastAPI service on port 8001.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">AI Service (Port 8001)</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">n8n Engine (Port 5678)</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-slate-400">Postgres Database</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Healthy
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/activity"
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-xs font-semibold text-slate-300 transition-colors"
            >
              View Detailed Live Stream
            </Link>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
