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
  ArrowUpRight,
  Workflow,
  Sparkles
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
  const [activeStep, setActiveStep] = useState(4);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [engineUsed, setEngineUsed] = useState<'n8n' | 'nexus-internal'>('n8n');
  const [elapsedTime, setElapsedTime] = useState('22.8s');

  const [steps, setSteps] = useState([
    { id: 1, name: 'Goal Ingestion & Spec Decomposition', agent: 'Orchestrator', status: 'completed', duration: '2.4s', tokens: 180 },
    { id: 2, name: 'Data & Schema Architecture Mapping', agent: 'Data Analyst Agent', status: 'completed', duration: '12.1s', tokens: 840 },
    { id: 3, name: 'Security & Compliance Verification', agent: 'Security Auditor', status: 'completed', duration: '8.3s', tokens: 490 },
    { id: 4, name: 'Final Multi-Agent Consensus Synthesis', agent: 'Lead Synthesizer', status: 'completed', duration: '4.2s', tokens: 360 },
  ]);

  const handleRerun = async (useN8n: boolean = true) => {
    setRunning(true);
    setExecutionOutput(null);
    setActiveStep(1);

    setSteps(prev => prev.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'pending'
    })));

    try {
      // Step 1: Goal Ingestion
      await new Promise(r => setTimeout(r, 600));
      setActiveStep(2);
      setSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'completed' : idx === 1 ? 'running' : 'pending'
      })));

      // Step 2: Analyst
      await new Promise(r => setTimeout(r, 800));
      setActiveStep(3);
      setSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx < 2 ? 'completed' : idx === 2 ? 'running' : 'pending'
      })));

      // Step 3: Trigger backend / n8n workflow
      const res = await fetch('/api/workflows/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'multi-agent',
          goal: 'Enterprise Food Delivery System Architecture & Resilient Deployment Pipeline'
        })
      });
      const data = await res.json();

      setActiveStep(4);
      setSteps(prev => prev.map(s => ({
        ...s,
        status: 'completed'
      })));

      setEngineUsed(data.engine || 'n8n');
      setElapsedTime(`${((data.executionDurationMs || 1840) / 1000).toFixed(1)}s`);
      setExecutionOutput(typeof data.output === 'string' ? data.output : JSON.stringify(data, null, 2));
    } catch (err: any) {
      setExecutionOutput(`Execution Error: ${err.message || 'Workflow dispatch failed'}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <ModuleLayout
      title="Live Workflow Execution Stream"
      subtitle="Real-time multi-agent DAG runner, consensus telemetry, and artifact generation"
      subnav={workflowsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRerun(true)}
            disabled={running}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Executing Nodes...' : 'Rerun via n8n Engine'}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Run Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${running ? 'bg-indigo-500 animate-ping' : 'bg-emerald-400'}`} />
              <h3 className="text-base font-bold text-white">Food Delivery System Pipeline #1094</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Workflow className="w-3 h-3" />
                {engineUsed === 'n8n' ? 'n8n Headless Engine' : 'Nexus Neural Core'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Execution initiated by <strong className="text-slate-200">Jaswant Karun</strong> • {running ? 'Dispatching active nodes' : 'All steps completed successfully'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Total Elapsed</span>
              <span className="text-white font-bold">{elapsedTime}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Tokens</span>
              <span className="text-indigo-400 font-bold">1,870</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cost Incurred</span>
              <span className="text-emerald-400 font-bold">$0.016</span>
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
            <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Terminal className="w-3.5 h-3.5" /> Intermediate Agent Inferences & Execution Log
            </span>
            <span className="text-[11px] text-emerald-400">Stream Active</span>
          </div>
          {executionOutput ? (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
              {executionOutput}
            </div>
          ) : (
            <>
              <p className="text-slate-400">[00:02] Orchestrator: Parsing high-level goal into DAG execution graph.</p>
              <p className="text-slate-400">[00:14] Data Analyst: Inspecting schema for food dispatch spatial index...</p>
              <p className="text-slate-300">[00:18] Security Auditor: Verifying consensus between Node 1 and Node 2. Agreement score: 0.984.</p>
              <p className="text-emerald-400">[00:22] Synthesizer: Consolidated consensus report ready. Handoff to deployment gateway completed.</p>
            </>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
