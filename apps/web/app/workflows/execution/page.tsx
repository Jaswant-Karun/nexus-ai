'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Bot, 
  FileCode, 
  Terminal, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react';

const workflowsSubnav = [
  { label: 'Workflows Hub', href: '/workflows' },
  { label: 'New Workflow', href: '/workflows/create' },
  { label: 'DAG Editor', href: '/workflows/editor' },
  { label: 'Templates', href: '/workflows/templates' },
  { label: 'Live Execution', href: '/workflows/execution' },
  { label: 'Run History', href: '/workflows/history' },
  { label: 'Scheduler', href: '/workflows/scheduler' },
  { label: 'Analytics', href: '/workflows/analytics' },
];

export default function WorkflowExecutionPage() {
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    { id: 1, name: 'Customer Goal Ingestion', agent: 'Orchestrator', status: 'completed', duration: '2.4s', tokens: 180 },
    { id: 2, name: 'Deep Research & Schema Mapping', agent: 'Claude 3.5 Sonnet', status: 'completed', duration: '12.1s', tokens: 840 },
    { id: 3, name: 'Consensus & Critic Evaluation', agent: 'Agent 3 Critic (OpenAI)', status: 'running', duration: '8.3s', tokens: 490 },
    { id: 4, name: 'Code & Artifact Synthesis', agent: 'Full-Stack Synthesizer', status: 'pending', duration: '--', tokens: 0 },
  ];

  const handleRerun = () => {
    setRunning(true);
    setActiveStep(1);
    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setRunning(false);
      }, 1000);
    }, 1000);
  };

  return (
    <ModuleLayout
      title="Live Workflow Execution Stream"
      subtitle="Real-time multi-agent DAG runner, consensus telemetry, and artifact generation"
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleRerun}
            disabled={running}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Executing Nodes...' : 'Rerun Pipeline'}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Run Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <h3 className="text-base font-bold text-white">Food Delivery System Pipeline #1094</h3>
            </div>
            <p className="text-xs text-slate-400">
              Execution initiated by <strong className="text-slate-200">Jaswant Karun</strong> • Step 3 of 4 in progress
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Total Elapsed</span>
              <span className="text-white font-bold">22.8s</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Tokens</span>
              <span className="text-indigo-400 font-bold">1,510</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cost Incurred</span>
              <span className="text-emerald-400 font-bold">$0.014</span>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="space-y-3">
          {steps.map(step => (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                step.status === 'completed' ? 'bg-slate-900/60 border-slate-800 text-slate-300' :
                step.status === 'running' ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10' :
                'bg-slate-950 border-slate-900 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  step.status === 'running' ? 'bg-indigo-600 text-white animate-pulse' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>
                <div>
                  <div className="text-sm font-semibold">{step.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Agent: <span className="font-mono text-indigo-300">{step.agent}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span>{step.duration}</span>
                <span>{step.tokens} tokens</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium capitalize ${
                  step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  step.status === 'running' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Output Log Stream */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs text-slate-300 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Terminal className="w-3.5 h-3.5" /> Intermediate Agent Inferences & Thought Stream
            </span>
            <span className="text-[11px] text-emerald-400">Streaming Live</span>
          </div>
          <p className="text-slate-400">[00:14] Agent 3 Critic: Inspecting schema for food dispatch spatial index...</p>
          <p className="text-slate-300">[00:18] Agent 3 Critic: Verifying consensus between Node 1 and Node 2. Agreement score: 0.984.</p>
          <p className="text-indigo-400">[00:22] Agent 3 Critic: Emitting approval signature. Handoff to Node 4 scheduled.</p>
        </div>
      </div>
    </ModuleLayout>
  );
}
