'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Palette, Moon, Sun, Monitor, Check, Eye } from 'lucide-react';

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

export default function ThemeSettingsPage() {
  const [themeMode, setThemeMode] = useState<'DARK' | 'LIGHT' | 'SYSTEM'>('DARK');
  const [accentColor, setAccentColor] = useState('indigo');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);

  return (
    <ModuleLayout
      title="Theme, Appearance & Visual Display"
      subtitle="Customize workspace color palettes, dark mode luminance, canvas rendering, and UI density"
      subnav={settingsSubnav}
    >
      <div className="max-w-3xl space-y-6">
        {/* Mode Selector */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" /> Color Mode
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'DARK', label: 'Obsidian Dark', icon: Moon, desc: 'High-contrast slate dark theme' },
              { id: 'LIGHT', label: 'Daylight Light', icon: Sun, desc: 'High-luminance crisp interface' },
              { id: 'SYSTEM', label: 'System Default', icon: Monitor, desc: 'Sync automatically with OS' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = themeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setThemeMode(mode.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <div className="text-sm font-semibold text-white">{mode.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{mode.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Colors */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Accent Brand Tint</h3>
          <div className="flex items-center gap-3">
            {[
              { id: 'indigo', name: 'Electric Indigo', color: 'bg-indigo-600' },
              { id: 'purple', name: 'Cyber Violet', color: 'bg-purple-600' },
              { id: 'emerald', name: 'Matrix Emerald', color: 'bg-emerald-600' },
              { id: 'cyan', name: 'Quantum Cyan', color: 'bg-cyan-600' },
              { id: 'rose', name: 'Supernova Rose', color: 'bg-rose-600' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center transition-all ${
                  accentColor === c.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}
                title={c.name}
              >
                {accentColor === c.id && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Layout Density */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Interface Ergonomics</h3>
          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Compact Canvas Density</span>
                <span className="text-slate-400">Reduce padding and spacing in tables and workflow graphs.</span>
              </div>
              <input
                type="checkbox"
                checked={compactDensity}
                onChange={(e) => setCompactDensity(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Reduced Motion Mode</span>
                <span className="text-slate-400">Disable heavy GPU transitions and floating glow effects.</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
            </label>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
