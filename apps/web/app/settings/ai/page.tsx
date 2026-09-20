'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Cpu, Zap, Key, Save, CheckCircle2, Sliders, Shield } from 'lucide-react';

const settingsSubnav = [
  { label: 'All Settings', href: '/settings' },
  { label: 'General', href: '/settings/general' },
  { label: 'Theme & Display', href: '/settings/theme' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Privacy & Data', href: '/settings/privacy' },
  { label: 'AI Models', href: '/settings/ai' },
  { label: 'Storage Engine', href: '/settings/storage' },
  { label: 'Integrations', href: '/settings/integrations' },
  { label: 'Security & Auth', href: '/settings/security' },
];

export default function AiSettingsPage() {
  const [defaultChatModel, setDefaultChatModel] = useState('gpt-4o');
  const [fallbackModel, setFallbackModel] = useState('claude-3-5-sonnet');
  const [defaultTemperature, setDefaultTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <ModuleLayout
      title="AI Models & Inference Routing"
      subtitle="Default foundation models, temperature boundaries, token caps, and automated fallback tiers"
      subnav={settingsSubnav}
      actions={
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Save AI Configuration
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {saved && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            AI inference parameters saved successfully.
          </div>
        )}

        {/* Model Selection */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Default Model Routing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Primary Chat & Agent Engine</label>
              <select
                value={defaultChatModel}
                onChange={(e) => setDefaultChatModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Omni Reasoning)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (High-speed)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                <option value="meta-llama-3.1-70b">Meta Llama 3.1 70B (Local vLLM)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Automated Failover Engine</label>
              <select
                value={fallbackModel}
                onChange={(e) => setFallbackModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                <option value="mistral-large">Mistral Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hyperparameters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> Default Hyperparameters
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Default Temperature ({defaultTemperature})</span>
                <span className="text-slate-500">0.0 = Deterministic, 1.0 = Creative</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={defaultTemperature}
                onChange={(e) => setDefaultTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Max Token Limit ({maxTokens})</span>
                <span className="text-slate-500">Per response limit</span>
              </div>
              <input
                type="range"
                min="512"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Server-Sent Events (SSE) Streaming</span>
                  <span className="text-slate-400">Stream response tokens in real-time as they generate.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableStreaming}
                  onChange={(e) => setEnableStreaming(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
