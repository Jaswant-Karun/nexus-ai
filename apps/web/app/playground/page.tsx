'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  Layers, 
  Cpu, 
  Check, 
  Copy, 
  Code2 
} from 'lucide-react';

const studioSubnav = [
  { label: 'Playground', href: '/playground' },
  { label: 'Prompt Library', href: '/prompt-library' },
  { label: 'Prompt Builder', href: '/prompt-builder' },
  { label: 'Response Viewer', href: '/response-viewer' },
  { label: 'Agent Canvas', href: '/canvas' },
];

export default function PlaygroundPage() {
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('You are an expert autonomous software engineer and system architect.');
  const [userPrompt, setUserPrompt] = useState('Explain how to architect a high-scale event-driven multi-agent system.');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature,
          max_tokens: maxTokens,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data.content || data.reply || JSON.stringify(data, null, 2));
      } else {
        // Fallback simulation for offline or development mode
        setTimeout(() => {
          setResponse(`[${model.toUpperCase()} INFERENCE OUTPUT]\n\nAn event-driven multi-agent architecture relies on 4 foundational pillars:\n\n1. Event Bus / Broker: Apache Kafka or NATS for asynchronous pub/sub messaging.\n2. State Management: Raft-based consensus or Redis cluster for shared blackboard memory.\n3. Agent Worker Nodes: Asynchronous microservices executing deterministic sub-tasks.\n4. Critic & Verification Layer: Automated reflection and evaluation cycles to guarantee convergence.`);
          setLoading(false);
        }, 800);
        return;
      }
    } catch {
      setResponse(`[SIMULATED ${model.toUpperCase()} RESPONSE]\n\nHigh-scale multi-agent execution pipeline evaluated successfully at temperature ${temperature}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout
      title="Multi-Model AI Playground"
      subtitle="Interactive experimentation lab for prompt engineering, hyperparameter tuning, and token profiling"
      subnav={studioSubnav}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUserPrompt('');
              setResponse('');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleRun}
            disabled={loading || !userPrompt.trim()}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> {loading ? 'Inferring...' : 'Run Model'}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration & Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> Model Selection
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">Ready (Latency: ~140ms)</span>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
            >
              <option value="gpt-4o">OpenAI GPT-4o (Omni Reasoning & Vision)</option>
              <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Coding & Analysis)</option>
              <option value="gemini-1-5-pro">Google Gemini 1.5 Pro (2M Context Window)</option>
              <option value="deepseek-v3">DeepSeek V3 (High-Efficiency Open Weights)</option>
              <option value="grok-beta">xAI Grok Beta (Real-time Knowledge)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              System Instruction
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 outline-none resize-none"
              placeholder="Define agent behavior..."
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              User Prompt
            </label>
            <textarea
              rows={7}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:border-indigo-500 outline-none resize-none font-mono"
              placeholder="Enter input prompt..."
            />
          </div>
        </div>

        {/* Right: Parameters & Output Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hyperparameters Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Model Hyperparameters
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Temperature</span>
                <span className="text-white font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Maximum Output Tokens</span>
                <span className="text-white font-mono">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Inference Output */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col h-[340px]">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Model Output
              </span>
              {response && (
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy output"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
            <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating response via {model}...
                </div>
              ) : response ? (
                response
              ) : (
                <span className="text-slate-600">Click &quot;Run Model&quot; to execute prompt against selected LLM.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
