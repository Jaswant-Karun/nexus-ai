'use client';

import React from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  BarChart3, 
  Bot, 
  GitFork, 
  Database, 
  Cpu, 
  Zap, 
  Users, 
  ShieldCheck, 
  HardDrive, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const dashboardSubnav = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Home View', href: '/dashboard/home' },
  { label: 'Live Activity', href: '/dashboard/activity' },
  { label: 'Favorites', href: '/dashboard/favorites' },
  { label: 'Recent Runs', href: '/dashboard/recent' },
];

export default function DashboardOverviewPage() {
  return (
    <ModuleLayout
      title="Cluster & Ecosystem Overview"
      subtitle="Comprehensive infrastructure health, execution statistics, and enterprise resource consumption"
      subnav={dashboardSubnav}
      actions={
        <Link
          href="/analytics"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" /> Full Analytics
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Total Token Ingestion</div>
            <div className="text-2xl font-bold text-white">48.2M</div>
            <div className="text-xs text-indigo-400 mt-1">Across GPT-4o & Claude 3.5 Sonnet</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Active Agents</div>
            <div className="text-2xl font-bold text-white">12 Agents</div>
            <div className="text-xs text-emerald-400 mt-1">100% consensus reliability</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Vector Storage Allocated</div>
            <div className="text-2xl font-bold text-white">2.4 / 10 GB</div>
            <div className="text-xs text-slate-400 mt-1">24% capacity utilized</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Compute Nodes</div>
            <div className="text-2xl font-bold text-white">8 Workers</div>
            <div className="text-xs text-emerald-400 mt-1">All microservices operational</div>
          </div>
        </div>

        {/* System Architecture Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Active Agents Fleet
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Nexus Orchestrator', model: 'GPT-4o', status: 'Active', tasks: '1,240' },
                { name: 'Research & Search Agent', model: 'Claude 3.5 Sonnet', status: 'Active', tasks: '890' },
                { name: 'Critic & Consensus Verifier', model: 'OpenAI Chat Model', status: 'Active', tasks: '620' },
                { name: 'Synthesis & Code Generator', model: 'Gemini 1.5 Pro', status: 'Standby', tasks: '430' },
              ].map((agent, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{agent.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{agent.model}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {agent.status}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">{agent.tasks} operations</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <Link href="/agents" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Manage all agents in fleet <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" /> Storage & Knowledge Graph Health
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">PostgreSQL (pgvector tables)</span>
                  <span className="text-emerald-400 font-mono">1.2 GB (Healthy)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[24%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Semantic Document Chunks</span>
                  <span className="text-indigo-400 font-mono">12,480 Vectors</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[52%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Graph Nodes & Entity Relations</span>
                  <span className="text-violet-400 font-mono">3,890 Triples</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full w-[38%]" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <Link href="/storage" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Open Storage Explorer <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
