'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  ArrowLeft, Play, GitFork, CheckCircle2, Clock, Activity,
  Zap, Settings, Terminal, BarChart3, RefreshCw, Pause,
  AlertCircle, ArrowRight, Database, Bot, Code2
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
];

interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'agent' | 'transform' | 'output';
  status: 'completed' | 'running' | 'pending' | 'error';
  duration?: string;
  description: string;
}

interface WorkflowRun {
  id: string;
  startedAt: string;
  duration: string;
  status: 'success' | 'failed' | 'running';
  tokensUsed: number;
  triggeredBy: string;
}

interface Workflow {
  name: string;
  description: string;
  status: string;
  trigger: string;
  lastRun: string;
  successRate: string;
  author: string;
  nodes: WorkflowNode[];
  recentRuns: WorkflowRun[];
  stats: { label: string; value: string; color: string }[];
}

const workflowData: Record<string, Workflow> = {
  'wf-food-delivery': {
    name: 'Food Delivery System Architecture',
    description: 'Autonomous 4-agent pipeline for backend, schema, consensus verification, and API contracts.',
    status: 'Active',
    trigger: 'Webhook / Manual',
    lastRun: '12 minutes ago',
    successRate: '100%',
    author: 'Jaswant Karun',
    stats: [
      { label: 'Total Runs', value: '142', color: 'text-white' },
      { label: 'Success Rate', value: '100%', color: 'text-emerald-400' },
      { label: 'Avg Duration', value: '18.4s', color: 'text-indigo-400' },
      { label: 'Total Tokens', value: '2.1M', color: 'text-amber-400' },
    ],
    nodes: [
      { id: 'n1', name: 'Webhook Trigger', type: 'trigger', status: 'completed', duration: '0ms', description: 'Receives HTTP POST payload with user task description' },
      { id: 'n2', name: 'Orchestrator Agent', type: 'agent', status: 'completed', duration: '2.4s', description: 'Decomposes task into sub-goals and assigns to specialist agents' },
      { id: 'n3', name: 'Research Agent', type: 'agent', status: 'completed', duration: '6.1s', description: 'Gathers domain knowledge and architectural patterns' },
      { id: 'n4', name: 'Code Synthesizer', type: 'agent', status: 'running', duration: '—', description: 'Generates PostgreSQL schema, API routes, and service code' },
      { id: 'n5', name: 'Critic Verifier', type: 'agent', status: 'pending', description: 'Cross-verifies generated code for bugs and security issues' },
      { id: 'n6', name: 'Report Output', type: 'output', status: 'pending', description: 'Synthesizes all outputs into final deliverable report' },
    ],
    recentRuns: [
      { id: 'run-001', startedAt: '12 min ago', duration: '18.2s', status: 'success', tokensUsed: 14800, triggeredBy: 'Manual' },
      { id: 'run-002', startedAt: '2 hrs ago', duration: '21.4s', status: 'success', tokensUsed: 17200, triggeredBy: 'Webhook' },
      { id: 'run-003', startedAt: '5 hrs ago', duration: '19.8s', status: 'success', tokensUsed: 15600, triggeredBy: 'Manual' },
      { id: 'run-004', startedAt: 'Yesterday', duration: '22.1s', status: 'success', tokensUsed: 18100, triggeredBy: 'Webhook' },
    ]
  },
  'wf-multi-agent-collab': {
    name: 'Nexus Multi-Agent Collaboration',
    description: 'Integrated pipeline: Ingest -> Researcher -> Agent 3 Critic -> Code Synthesizer.',
    status: 'Active',
    trigger: 'Cron (Every 2h)',
    lastRun: '1 hour ago',
    successRate: '98.8%',
    author: 'System',
    stats: [
      { label: 'Total Runs', value: '348', color: 'text-white' },
      { label: 'Success Rate', value: '98.8%', color: 'text-emerald-400' },
      { label: 'Avg Duration', value: '34.2s', color: 'text-indigo-400' },
      { label: 'Total Tokens', value: '8.4M', color: 'text-amber-400' },
    ],
    nodes: [
      { id: 'n1', name: 'Cron Trigger', type: 'trigger', status: 'completed', duration: '0ms', description: 'Fires every 2 hours on schedule' },
      { id: 'n2', name: 'Data Ingest', type: 'transform', status: 'completed', duration: '1.2s', description: 'Fetches latest data from configured sources' },
      { id: 'n3', name: 'Research Agent', type: 'agent', status: 'completed', duration: '8.4s', description: 'Analyses ingested data and generates insights' },
      { id: 'n4', name: 'Critic Agent', type: 'agent', status: 'completed', duration: '3.1s', description: 'Verifies research outputs for factual accuracy' },
      { id: 'n5', name: 'Code Synthesizer', type: 'agent', status: 'completed', duration: '12.3s', description: 'Generates implementation from verified specs' },
    ],
    recentRuns: [
      { id: 'run-010', startedAt: '1 hr ago', duration: '33.8s', status: 'success', tokensUsed: 28400, triggeredBy: 'Cron' },
      { id: 'run-011', startedAt: '3 hrs ago', duration: '35.2s', status: 'success', tokensUsed: 31200, triggeredBy: 'Cron' },
      { id: 'run-012', startedAt: '5 hrs ago', duration: '31.9s', status: 'failed', tokensUsed: 12100, triggeredBy: 'Cron' },
    ]
  },
  'wf-vector-sync': {
    name: 'PostgreSQL pgvector Continuous Sync',
    description: 'Watches storage folder, extracts semantic chunks, and regenerates vector embeddings.',
    status: 'Scheduled',
    trigger: 'Storage Event',
    lastRun: '3 hours ago',
    successRate: '100%',
    author: 'Data Engine',
    stats: [
      { label: 'Total Runs', value: '1,204', color: 'text-white' },
      { label: 'Success Rate', value: '100%', color: 'text-emerald-400' },
      { label: 'Avg Duration', value: '4.8s', color: 'text-indigo-400' },
      { label: 'Vectors Created', value: '48.2K', color: 'text-amber-400' },
    ],
    nodes: [
      { id: 'n1', name: 'Storage Event Trigger', type: 'trigger', status: 'completed', duration: '0ms', description: 'Fires when a file is uploaded to the storage service' },
      { id: 'n2', name: 'Text Extractor', type: 'transform', status: 'completed', duration: '0.8s', description: 'Extracts and chunks text from PDF/DOCX/TXT files' },
      { id: 'n3', name: 'Embedding Generator', type: 'transform', status: 'completed', duration: '1.9s', description: 'Calls Gemini embedding API to generate dense vectors' },
      { id: 'n4', name: 'pgvector Upsert', type: 'output', status: 'completed', duration: '0.3s', description: 'Inserts or updates vector records in PostgreSQL' },
    ],
    recentRuns: [
      { id: 'run-020', startedAt: '3 hrs ago', duration: '4.6s', status: 'success', tokensUsed: 3200, triggeredBy: 'Storage Event' },
      { id: 'run-021', startedAt: '5 hrs ago', duration: '5.1s', status: 'success', tokensUsed: 4100, triggeredBy: 'Storage Event' },
      { id: 'run-022', startedAt: '8 hrs ago', duration: '4.8s', status: 'success', tokensUsed: 3800, triggeredBy: 'Storage Event' },
    ]
  }
};

const defaultWorkflow: Workflow = {
  name: 'Workflow Not Found',
  description: 'This workflow does not exist or has been removed.',
  status: 'Unknown',
  trigger: '—',
  lastRun: '—',
  successRate: '—',
  author: '—',
  nodes: [],
  recentRuns: [],
  stats: []
};

const nodeTypeColors: Record<WorkflowNode['type'], string> = {
  trigger: 'bg-violet-600/20 border-violet-500/30 text-violet-400',
  agent: 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400',
  transform: 'bg-amber-600/20 border-amber-500/30 text-amber-400',
  output: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400',
};

const nodeStatusIcons: Record<WorkflowNode['status'], React.ReactNode> = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  running: <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />,
  pending: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  error: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
};

const nodeTypeIcons: Record<WorkflowNode['type'], React.ReactNode> = {
  trigger: <Zap className="w-4 h-4" />,
  agent: <Bot className="w-4 h-4" />,
  transform: <Code2 className="w-4 h-4" />,
  output: <Database className="w-4 h-4" />,
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const workflow = workflowData[id] || defaultWorkflow;
  const [activeTab, setActiveTab] = useState<'dag' | 'history' | 'config'>('dag');

  return (
    <ModuleLayout
      title={workflow.name}
      subtitle={workflow.description}
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/workflows"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Workflows
          </Link>
          <button className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Configure
          </button>
          <Link
            href="/workflow"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Run Now
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {workflow.stats.map(s => (
            <div key={s.label} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="flex border-b border-slate-800">
            {(['dag', 'history', 'config'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-indigo-500 bg-slate-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'dag' ? 'DAG Pipeline' : tab === 'history' ? `Run History (${workflow.recentRuns.length})` : 'Configuration'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* DAG View */}
            {activeTab === 'dag' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">
                  {workflow.nodes.length} nodes in pipeline — arrows show execution flow
                </p>
                {workflow.nodes.map((node, idx) => (
                  <div key={node.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${nodeTypeColors[node.type]}`}>
                        {nodeTypeIcons[node.type]}
                      </div>
                      {idx < workflow.nodes.length - 1 && (
                        <div className="w-px h-6 bg-slate-700 my-1" />
                      )}
                    </div>
                    <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {nodeStatusIcons[node.status]}
                          <span className="text-sm font-semibold text-white">{node.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border capitalize ${nodeTypeColors[node.type]}`}>
                            {node.type}
                          </span>
                        </div>
                        {node.duration && (
                          <span className="text-[11px] font-mono text-slate-400">{node.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{node.description}</p>
                    </div>
                  </div>
                ))}
                {workflow.nodes.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">No pipeline nodes configured.</p>
                )}
              </div>
            )}

            {/* Run History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {workflow.recentRuns.map(run => (
                  <div key={run.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      run.status === 'success' ? 'bg-emerald-400' :
                      run.status === 'running' ? 'bg-indigo-400 animate-pulse' :
                      'bg-red-400'
                    }`} />
                    <div className="flex-1 grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-slate-500 mb-0.5">Run ID</div>
                        <div className="text-white font-mono">{run.id}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Started</div>
                        <div className="text-slate-300">{run.startedAt}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Duration</div>
                        <div className="text-white font-mono">{run.duration}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Tokens</div>
                        <div className="text-indigo-400 font-mono">{run.tokensUsed.toLocaleString()}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold capitalize px-2 py-1 rounded-lg border ${
                      run.status === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      run.status === 'running' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' :
                      'text-red-400 bg-red-500/10 border-red-500/20'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                ))}
                {workflow.recentRuns.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">No runs recorded yet.</p>
                )}
              </div>
            )}

            {/* Config */}
            {activeTab === 'config' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Workflow ID', value: id },
                  { label: 'Status', value: workflow.status },
                  { label: 'Trigger', value: workflow.trigger },
                  { label: 'Author', value: workflow.author },
                  { label: 'Last Run', value: workflow.lastRun },
                  { label: 'Success Rate', value: workflow.successRate },
                  { label: 'Total Nodes', value: `${workflow.nodes.length} nodes` },
                ].map(conf => (
                  <div key={conf.label} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="text-[11px] text-slate-500 mb-1">{conf.label}</div>
                    <div className="text-sm text-white font-mono">{conf.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
