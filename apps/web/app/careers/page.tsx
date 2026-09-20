'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Globe, 
  Laptop, 
  ShieldCheck, 
  Zap, 
  Compass 
} from 'lucide-react';

const positions = [
  {
    id: 'lead-distributed-systems',
    title: 'Lead Distributed Systems Engineer',
    team: 'Platform Infrastructure',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    compensation: '$190,000 - $240,000 + Equity',
    tags: ['Go', 'Rust', 'Kubernetes', 'Raft']
  },
  {
    id: 'staff-ai-researcher-agents',
    title: 'Staff AI Research Scientist - Multi-Agent Systems',
    team: 'AI Core Lab',
    location: 'New York, NY / Remote',
    type: 'Full-time',
    compensation: '$210,000 - $270,000 + Equity',
    tags: ['PyTorch', 'Reinforcement Learning', 'LLMs', 'Evaluation']
  },
  {
    id: 'senior-frontend-architect',
    title: 'Senior Frontend Architect (Next.js & WebGL)',
    team: 'Design & Experience',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    compensation: '$165,000 - $205,000 + Equity',
    tags: ['Next.js 15', 'TypeScript', 'React Flow', 'Tailwind']
  },
  {
    id: 'enterprise-solutions-architect',
    title: 'Enterprise AI Solutions Architect',
    team: 'Customer Engineering',
    location: 'London, UK / Remote',
    type: 'Full-time',
    compensation: '£130,000 - £160,000 + Bonus',
    tags: ['RAG', 'Enterprise Security', 'Cloud Integrations']
  },
  {
    id: 'product-designer-ai-canvas',
    title: 'Staff Product Designer - Graph & DAG Interfaces',
    team: 'Product Design',
    location: 'Remote',
    type: 'Full-time',
    compensation: '$160,000 - $195,000 + Equity',
    tags: ['Figma', 'Design Systems', 'Data Visualization']
  }
];

export default function CareersPage() {
  const [selectedTeam, setSelectedTeam] = useState('All');
  const teams = ['All', 'Platform Infrastructure', 'AI Core Lab', 'Design & Experience', 'Customer Engineering', 'Product Design'];

  const filtered = selectedTeam === 'All' 
    ? positions 
    : positions.filter(p => p.team === selectedTeam);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <AppNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the NEXUS Collective</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
            Shape the Future of Autonomous Intelligence
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            We are building the cognitive nervous system for the next generation of software: multi-agent orchestration, neural memory graphs, and high-performance execution engines.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Globe className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Globally Distributed First</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Work from anywhere with asynchronous-first team cadences, generous home-office stipends, and worldwide health coverage.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Zap className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-base mb-1">State-of-the-Art Compute</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Unrestricted access to high-density H100/B200 GPU clusters, state-of-the-art model weights, and top-tier experimentation toolchains.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Heart className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Comprehensive Wellness</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Unlimited PTO with mandatory annual minimums, parental leave, mental health stipends, and competitive equity packages.
            </p>
          </div>
        </div>

        {/* Positions Section */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Open Roles</h2>
              <p className="text-xs sm:text-sm text-slate-400">Discover where your unique engineering craft can make an outsized impact.</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {teams.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTeam(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    selectedTeam === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map(job => (
              <div 
                key={job.id}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {job.team}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-emerald-400 font-medium ml-2">
                      {job.compensation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center md:justify-end">
                  <a
                    href={`mailto:careers@nexusai.io?subject=Application:%20${encodeURIComponent(job.title)}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
