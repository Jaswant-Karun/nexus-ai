'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  Bot, ArrowLeft, Play, Edit, Activity, CheckCircle2,
  Clock, Cpu, Database, Zap, Terminal, BarChart3,
  AlertCircle, RefreshCw, Settings, ChevronDown, ChevronRight
} from 'lucide-react';

const agentsSubnav = [
  { label: 'Agent Fleet', href: '/agents' },
  { label: 'Create Agent', href: '/agents/create' },
  { label: 'Marketplace', href: '/agents/marketplace' },
  { label: 'Performance', href: '/agents/performance' },
  { label: 'Audit Logs', href: '/agents/logs' },
];

const agentData: Record<string, {
  name: string;
  role: string;
  model: string;
  status: string;
  successRate: string;
  tasksCount: string;
  memoryAttached: string;
  tools: string[];
  avgLatency: string;
  contextWindow: string;
  temperature: string;
  maxTokens: string;
  description: string;
  capabilities: string[];
  recentRuns: { id: string; task: string; status: string; duration: string; time: string; tokens: number }[];
}> = {
  'agent-orchestrator': {
    name: 'NEXUS Master Orchestrator',
    role: 'Decomposes complex requests into task graphs and directs worker agents.',
    model: 'GPT-4o',
    status: 'Online',
    successRate: '99.8%',
    tasksCount: '4,120',
    memoryAttached: 'Vector Store (pgvector)',
    tools: ['Workflow Dispatcher', 'Code Sandbox', 'Consensus Verifier'],
    avgLatency: '240ms',
    contextWindow: '128K tokens',
    temperature: '0.2',
    maxTokens: '4096',
    description: 'The master orchestrator decomposes user-defined tasks into a directed acyclic graph, assigns work to specialized agents, monitors execution progress, and synthesizes final outputs via consensus verification.',
    capabilities: ['Multi-agent task decomposition', 'DAG workflow generation', 'Consensus-based verification', 'Error recovery & retry', 'Parallel agent coordination'],
    recentRuns: [
      { id: 'run-001', task: 'Decompose food delivery architecture spec into 6 agent sub-tasks', status: 'Success', duration: '2.4s', time: '12 min ago', tokens: 3241 },
      { id: 'run-002', task: 'Coordinate research + critic + coder for RAG pipeline implementation', status: 'Success', duration: '18.1s', time: '1 hr ago', tokens: 12480 },
      { id: 'run-003', task: 'Generate enterprise workflow DAG from natural language description', status: 'Success', duration: '4.9s', time: '3 hrs ago', tokens: 4120 },
    ]
  },
  'agent-researcher': {
    name: 'Deep Research & Analysis Agent',
    role: 'Scrapes live web data, queries scholarly sources, and compiles factual briefs.',
    model: 'Claude 3.5 Sonnet',
    status: 'Online',
    successRate: '99.4%',
    tasksCount: '2,890',
    memoryAttached: 'Semantic Knowledge Graph',
    tools: ['Google Search API', 'PDF Parser', 'ArXiv Search'],
    avgLatency: '1.2s',
    contextWindow: '200K tokens',
    temperature: '0.3',
    maxTokens: '8192',
    description: 'Performs deep web and academic research, synthesizes multi-source findings into structured briefs, and maintains a semantic knowledge graph for long-term recall across sessions.',
    capabilities: ['Live web search & scraping', 'Academic database access', 'Multi-document synthesis', 'Citation tracking', 'Knowledge graph updates'],
    recentRuns: [
      { id: 'run-004', task: 'Research latest pgvector vs Pinecone benchmarks', status: 'Success', duration: '6.2s', time: '30 min ago', tokens: 7800 },
      { id: 'run-005', task: 'Compile competitive analysis for AI code generation tools', status: 'Success', duration: '14.5s', time: '2 hrs ago', tokens: 19200 },
      { id: 'run-006', task: 'Find research papers on LLM hallucination reduction techniques', status: 'Success', duration: '8.8s', time: '5 hrs ago', tokens: 9400 },
    ]
  },
  'agent-critic': {
    name: 'OpenAI Consensus Critic (Agent 3)',
    role: 'Cross-verifies code, detects logic bugs, and prevents hallucinated statements.',
    model: 'OpenAI Chat Model',
    status: 'Online',
    successRate: '98.9%',
    tasksCount: '1,750',
    memoryAttached: 'Working Session Memory',
    tools: ['AST Linter', 'Security Analyzer', 'Unit Test Runner'],
    avgLatency: '890ms',
    contextWindow: '128K tokens',
    temperature: '0.1',
    maxTokens: '4096',
    description: 'Acts as the verification layer in the multi-agent pipeline. Reviews all generated code and text outputs, identifies logical flaws and security vulnerabilities, and ensures factual accuracy before delivery.',
    capabilities: ['Static code analysis', 'Security vulnerability detection', 'Factual cross-verification', 'Unit test generation', 'Logic consistency checking'],
    recentRuns: [
      { id: 'run-007', task: 'Verify PostgreSQL schema for N+1 query vulnerabilities', status: 'Success', duration: '1.1s', time: '45 min ago', tokens: 2100 },
      { id: 'run-008', task: 'Audit authentication flow for JWT security issues', status: 'Success', duration: '2.3s', time: '3 hrs ago', tokens: 3400 },
      { id: 'run-009', task: 'Cross-check RAG implementation for hallucination risk', status: 'Success', duration: '3.8s', time: '6 hrs ago', tokens: 5200 },
    ]
  },
  'agent-coder': {
    name: 'Full-Stack Code Synthesizer',
    role: 'Generates TypeScript, Python, and SQL with automated type verification.',
    model: 'Gemini 1.5 Pro',
    status: 'Standby',
    successRate: '99.1%',
    tasksCount: '1,420',
    memoryAttached: 'Repository Codebase Vector',
    tools: ['Git CLI', 'Terminal Runner', 'Docker Runtime'],
    avgLatency: '1.8s',
    contextWindow: '1M tokens',
    temperature: '0.25',
    maxTokens: '8192',
    description: 'Generates production-grade TypeScript, Python, SQL and shell scripts from natural language specs. Includes automated type checking, linting, and integration with the project repository.',
    capabilities: ['Full-stack code generation', 'Multi-language support', 'Automated type checking', 'Git integration', 'Docker containerization'],
    recentRuns: [
      { id: 'run-010', task: 'Generate Next.js 15 API route for user authentication with JWT', status: 'Success', duration: '3.2s', time: '1 hr ago', tokens: 4500 },
      { id: 'run-011', task: 'Write FastAPI endpoint with Pydantic validation for agent execution', status: 'Success', duration: '2.8s', time: '4 hrs ago', tokens: 3800 },
      { id: 'run-012', task: 'Generate Prisma schema with 13 models and seed script', status: 'Success', duration: '5.1s', time: '8 hrs ago', tokens: 6200 },
    ]
  },
};

const defaultAgent = {
  name: 'Unknown Agent',
  role: 'No description available.',
  model: 'Gemini 2.5 Flash',
  status: 'Standby',
  successRate: '—',
  tasksCount: '0',
  memoryAttached: 'None',
  tools: [],
  avgLatency: '—',
  contextWindow: '—',
  temperature: '0.7',
  maxTokens: '2048',
  description: 'Agent details not found. The agent may have been removed or the ID is incorrect.',
  capabilities: [],
  recentRuns: []
};

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const agent = agentData[id] || defaultAgent;
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const statusColor = agent.status === 'Online'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <ModuleLayout
      title={agent.name}
      subtitle={agent.role}
      subnav={agentsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/agents"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet
          </Link>
          <Link
            href={`/agents/edit/${id}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Config
          </Link>
          <Link
            href={`/workflow?agent=${id}`}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Run Agent
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Status', value: agent.status, icon: <Activity className="w-4 h-4" />, className: statusColor },
            { label: 'Total Runs', value: agent.tasksCount, icon: <BarChart3 className="w-4 h-4 text-indigo-400" />, className: 'text-white' },
            { label: 'Success Rate', value: agent.successRate, icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, className: 'text-emerald-400' },
            { label: 'Avg Latency', value: agent.avgLatency, icon: <Clock className="w-4 h-4 text-indigo-400" />, className: 'text-white' },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                {stat.icon} {stat.label}
              </div>
              <div className={`text-2xl font-bold ${stat.className}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Description + Capabilities */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" /> Agent Description
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{agent.description}</p>
            </div>

            {/* Capabilities */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" /> Core Capabilities
              </h3>
              <div className="space-y-2">
                {agent.capabilities.map(cap => (
                  <div key={cap} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Run History */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> Recent Executions
              </h3>
              <div className="space-y-3">
                {agent.recentRuns.length === 0 && (
                  <p className="text-xs text-slate-500">No run history available.</p>
                )}
                {agent.recentRuns.map(run => (
                  <div key={run.id} className="rounded-xl border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs text-slate-200 line-clamp-1">{run.task}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                        <span className="text-[11px] text-slate-500">{run.time}</span>
                        <span className="text-[11px] font-mono text-slate-400">{run.duration}</span>
                        {expandedRun === run.id
                          ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        }
                      </div>
                    </button>
                    {expandedRun === run.id && (
                      <div className="px-4 pb-3 pt-0 border-t border-slate-800 bg-slate-950/40">
                        <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                          <div>
                            <div className="text-slate-500 mb-1">Status</div>
                            <span className="text-emerald-400 font-semibold">{run.status}</span>
                          </div>
                          <div>
                            <div className="text-slate-500 mb-1">Duration</div>
                            <span className="text-white font-mono">{run.duration}</span>
                          </div>
                          <div>
                            <div className="text-slate-500 mb-1">Tokens Used</div>
                            <span className="text-indigo-400 font-mono">{run.tokens.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Config Panel */}
          <div className="space-y-5">
            {/* Model Config */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" /> Model Configuration
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Base Model', value: agent.model },
                  { label: 'Context Window', value: agent.contextWindow },
                  { label: 'Temperature', value: agent.temperature },
                  { label: 'Max Tokens', value: agent.maxTokens },
                ].map(conf => (
                  <div key={conf.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{conf.label}</span>
                    <span className="text-xs font-mono text-white bg-slate-800 px-2 py-1 rounded">{conf.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Memory Store
              </h3>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs font-semibold text-emerald-400">{agent.memoryAttached}</div>
                <div className="text-xs text-slate-400 mt-1">Persistent across sessions</div>
              </div>
            </div>

            {/* Tools */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" /> Attached Tools
              </h3>
              <div className="space-y-2">
                {agent.tools.map(tool => (
                  <div key={tool} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-xs text-slate-200">{tool}</span>
                  </div>
                ))}
                {agent.tools.length === 0 && (
                  <p className="text-xs text-slate-500">No tools attached.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
              <Link
                href={`/workflow?agent=${id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Run in Workflow
              </Link>
              <Link
                href="/chat"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> Open in Chat
              </Link>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Restart Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
