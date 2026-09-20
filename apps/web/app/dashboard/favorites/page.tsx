'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Star, 
  Bot, 
  GitFork, 
  FileText, 
  ArrowUpRight, 
  Play, 
  Trash2,
  FolderPlus
} from 'lucide-react';

const dashboardSubnav = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Home View', href: '/dashboard/home' },
  { label: 'Live Activity', href: '/dashboard/activity' },
  { label: 'Favorites', href: '/dashboard/favorites' },
  { label: 'Recent Runs', href: '/dashboard/recent' },
];

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: 'fav-1',
      title: 'Food Delivery System Workflow',
      type: 'Workflow DAG',
      icon: GitFork,
      path: '/workflow',
      description: 'Autonomous 4-agent pipeline generating complete backend, database schemas, and API contracts.',
      tags: ['GPT-4o', 'Multi-Agent', 'n8n']
    },
    {
      id: 'fav-2',
      title: 'Nexus_AI_Architecture.md',
      type: 'Storage Asset',
      icon: FileText,
      path: '/storage',
      description: 'System specifications, multi-agent protocol details, and pgvector schema architecture.',
      tags: ['Markdown', 'Indexed', 'RAG']
    },
    {
      id: 'fav-3',
      title: 'Market Research & Analyst Agent',
      type: 'Agent Persona',
      icon: Bot,
      path: '/agents',
      description: 'High-precision research agent combining web scraping with semantic cross-examination.',
      tags: ['Claude 3.5', 'Autonomous', 'Web']
    }
  ]);

  const handleRemove = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <ModuleLayout
      title="Starred Workspaces & Artifacts"
      subtitle="Quick access to your most frequently used agents, workflows, and knowledge documents"
      subnav={dashboardSubnav}
      actions={
        <button 
          onClick={() => alert("Pin any workflow, agent, or document to favorites using the Star icon.")}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <FolderPlus className="w-3.5 h-3.5 text-indigo-400" /> How to Star Items
        </button>
      }
    >
      <div className="space-y-6">
        {favorites.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
            <Star className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Starred Items Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the star icon next to any workflow DAG, autonomous agent, or storage document to pin it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => {
              const Icon = fav.icon;
              return (
                <div 
                  key={fav.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Icon className="w-3.5 h-3.5" /> {fav.type}
                      </span>
                      <button
                        onClick={() => handleRemove(fav.id)}
                        className="p-1 rounded-lg text-amber-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Remove from favorites"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                      {fav.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {fav.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {fav.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <Link
                        href={fav.path}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        Open Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
