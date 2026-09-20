'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Bot, 
  Plus, 
  Search, 
  Sliders, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  Cpu, 
  Database,
  Trash2,
  Edit
} from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Marketplace', href: '/agents/marketplace' },
  { label: 'Agent Memory', href: '/agents/memory' },
  { label: 'Performance', href: '/agents/performance' },
  { label: 'Audit Logs', href: '/agents/logs' },
  { label: 'Fleet Settings', href: '/agents/settings' },
];

const mockAgents = [
  {
    id: 'agent-orchestrator',
    name: 'NEXUS Master Orchestrator',
    role: 'Decomposes complex requests into task graphs and directs worker agents.',
    model: 'GPT-4o',
    status: 'Online',
    successRate: '99.8%',
    tasksCount: '4,120',
    memoryAttached: 'Vector Store (pgvector)',
    tools: ['Workflow Dispatcher', 'Code Sandbox', 'Consensus Verifier']
  },
  {
    id: 'agent-researcher',
    name: 'Deep Research & Analysis Agent',
    role: 'Scrapes live web data, queries scholarly sources, and compiles factual briefs.',
    model: 'Claude 3.5 Sonnet',
    status: 'Online',
    successRate: '99.4%',
    tasksCount: '2,890',
    memoryAttached: 'Semantic Knowledge Graph',
    tools: ['Google Search API', 'PDF Parser', 'ArXiv Search']
  },
  {
    id: 'agent-critic',
    name: 'OpenAI Consensus Critic (Agent 3)',
    role: 'Cross-verifies code, detects logic bugs, and prevents hallucinated statements.',
    model: 'OpenAI Chat Model',
    status: 'Online',
    successRate: '98.9%',
    tasksCount: '1,750',
    memoryAttached: 'Working Session Memory',
    tools: ['AST Linter', 'Security Analyzer', 'Unit Test Runner']
  },
  {
    id: 'agent-coder',
    name: 'Full-Stack Code Synthesizer',
    role: 'Generates TypeScript, Python, and SQL with automated type verification.',
    model: 'Gemini 1.5 Pro',
    status: 'Standby',
    successRate: '99.1%',
    tasksCount: '1,420',
    memoryAttached: 'Repository Codebase Vector',
    tools: ['Git CLI', 'Terminal Runner', 'Docker Runtime']
  }
];

export default function AgentsHubPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [search, setSearch] = useState('');

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    a.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Autonomous Agent Fleet"
      subtitle="Configure, monitor, and coordinate specialized autonomous agents across enterprise workflows"
      subnav={agentsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/agents/marketplace"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Marketplace
          </Link>
          <Link
            href="/agents/create"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Deploy New Agent
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Fleet Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Fleet Health</div>
            <div className="text-2xl font-bold text-white">4 Online / 0 Faulted</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% active availability
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Completed Inferences</div>
            <div className="text-2xl font-bold text-white">10,180 Tasks</div>
            <div className="text-xs text-indigo-400 mt-1">Average response time: 240ms</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Consensus Resolution Rate</div>
            <div className="text-2xl font-bold text-white">99.4%</div>
            <div className="text-xs text-emerald-400 mt-1">Critic Agent 3 active verification</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter agents by name, model, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {filtered.length} Agents Configured
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(agent => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {agent.model}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {agent.role}
                </p>

                {/* Tool Badges */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Attached Capabilities
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map(tool => (
                      <span key={tool} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> {agent.memoryAttached}
                  </span>
                  <span className="font-semibold text-white">{agent.tasksCount} runs</span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/agents/edit/${agent.id}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Agent"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/agents/${agent.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      Inspect Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <Link
                    href={`/workflow?agent=${agent.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-white" /> Run Agent
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
