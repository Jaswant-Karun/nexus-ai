"use client";

import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  _count: {
    conversations: number;
    agents: number;
    workflows: number;
    uploadedFiles: number;
  };
}

const AVATAR_PRESETS = [
  { id: "architect", label: "Nexus Architect", icon: "⚡", bg: "from-brand-600 to-indigo-600" },
  { id: "synthesizer", label: "Neural Synthesizer", icon: "🧠", bg: "from-purple-600 to-pink-600" },
  { id: "quantum", label: "Quantum Engineer", icon: "🌌", bg: "from-cyan-600 to-blue-600" },
  { id: "sentinel", label: "Cyber Sentinel", icon: "🛡️", bg: "from-emerald-600 to-teal-600" },
  { id: "visionary", label: "AI Strategist", icon: "🔮", bg: "from-amber-500 to-orange-600" },
  { id: "pioneer", label: "Autonomous Pioneer", icon: "🚀", bg: "from-rose-600 to-red-600" },
];

const TABS = [
  { id: "identity", label: "Identity & Bio", icon: "👤" },
  { id: "copilot", label: "AI Co-Pilot Persona", icon: "🤖" },
  { id: "atmosphere", label: "Theme & Atmosphere", icon: "🎨" },
  { id: "agents", label: "Agent Fleet & Quotas", icon: "⚡" },
  { id: "security", label: "Security & Sessions", icon: "🔒" },
  { id: "apikeys", label: "API Keys & Webhooks", icon: "🔑" },
];

// Mock 30-day activity telemetry matrix
const ACTIVITY_DAYS = Array.from({ length: 30 }, (_, i) => {
  const count = Math.floor(Math.sin(i * 0.7 + 1) * 18) + 12 + ((i % 5 === 0) ? 15 : 0);
  return {
    day: i + 1,
    date: `Day ${i + 1}`,
    operations: Math.max(4, count),
  };
});

export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("identity");

  // Form states
  const [name, setName] = useState("Jaswant Karun");
  const [email, setEmail] = useState("admin@nexus.ai");
  const [title, setTitle] = useState("Senior Autonomous Systems Architect");
  const [bio, setBio] = useState("Architecting adaptive intelligence graphs, swarm orchestrations, and deterministic LLM execution pipelines at scale.");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [copiedKey, setCopiedKey] = useState(false);

  // AI Co-pilot states
  const [copilotName, setCopilotName] = useState("AURA-7");
  const [copilotTone, setCopilotTone] = useState("Technical & Precise");
  const [copilotModel, setCopilotModel] = useState("GPT-4o");
  const [copilotSaved, setCopilotSaved] = useState(false);

  // Save states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
          setName(res.data.name || "Jaswant Karun");
          setEmail(res.data.email || "admin@nexus.ai");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(`NEXUS-${profile?.id || "USR-9842-X7"}`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (profile) {
          setProfile({ ...profile, name, email });
        }
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || "Failed to save profile changes.");
      }
    } catch {
      setErrorMessage("Network error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    setCopilotSaved(true);
    setTimeout(() => setCopilotSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-dark-950 dark:text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-5 md:p-8 lg:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* ─────────────────── 1. CYBER INTELLIGENCE IDENTITY HERO CARD ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 md:p-8 shadow-sm backdrop-blur-xl transition-all dark:border-white/[0.08] dark:bg-dark-900/75 dark:shadow-2xl dark:shadow-black/40"
          >
            {/* Ambient Aurora Background Accents */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Cyber Avatar Ring */}
                <div className="relative group">
                  <div className={`relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr ${selectedAvatar.bg} text-3xl shadow-xl shadow-brand-600/25 transition-transform group-hover:scale-105`}>
                    <span className="select-none">{selectedAvatar.icon}</span>
                    <span
                      className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-emerald-500/30 dark:border-dark-900 animate-pulse"
                      title="Neural Sync Active"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-700 dark:bg-brand-500/15 dark:border-brand-500/30 dark:text-brand-300">
                      Level 5 Nexus Architect
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400">
                      99.8% Sync Rate
                    </span>
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-dark-800 dark:border-white/10 dark:text-dark-300">
                      PostgreSQL Verified
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {name}
                  </h1>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-dark-300 mt-0.5">
                    {title} · <span className="text-brand-600 dark:text-brand-400 font-medium">{email}</span>
                  </p>

                  <p className="text-xs text-slate-500 dark:text-dark-400 mt-2 max-w-xl line-clamp-2">
                    {bio}
                  </p>
                </div>
              </div>

              {/* Quick Actions & Cyber Key */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-mono font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-dark-800/80 dark:text-gray-200 dark:hover:bg-dark-700"
                  title="Copy Public Neural Identifier"
                >
                  <span>🆔 {copiedKey ? "✓ Copied Key!" : `NEXUS-${(profile?.id || "USR-9842-X7").slice(0, 11)}...`}</span>
                </button>

                {/* Direct Live Theme Switcher */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-white/10 dark:bg-dark-800">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      theme === "light"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-dark-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-white"
                    }`}
                  >
                    <span>☀️ Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      theme === "dark"
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-white"
                    }`}
                  >
                    <span>🌙 Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      theme === "system"
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-dark-400 dark:hover:text-white"
                    }`}
                  >
                    <span>💻 Auto</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Archetype Quick Selector */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400">
                  Select Persona Archetype
                </span>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                  Active: {selectedAvatar.label}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedAvatar.id === preset.id
                        ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500/30 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-300"
                        : "border-slate-200 bg-white/60 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-dark-800/50 dark:text-dark-300 dark:hover:bg-dark-700"
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─────────────────── 2. REAL-TIME COGNITIVE TELEMETRY GAUGES ─────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Autonomous Fleets",
                value: profile?._count.agents ?? 6,
                unit: "Active Swarms",
                progress: 88,
                color: "text-brand-600 dark:text-brand-400",
                barColor: "bg-brand-600",
                icon: "🤖",
              },
              {
                label: "Neural Workflows",
                value: profile?._count.workflows ?? 4,
                unit: "Pipelines Live",
                progress: 76,
                color: "text-purple-600 dark:text-purple-400",
                barColor: "bg-purple-600",
                icon: "⚡",
              },
              {
                label: "Vector Memory Bank",
                value: "14.8M",
                unit: "Indexed Tokens",
                progress: 92,
                color: "text-cyan-600 dark:text-cyan-400",
                barColor: "bg-cyan-500",
                icon: "🧠",
              },
              {
                label: "Knowledge Files",
                value: profile?._count.uploadedFiles ?? 8,
                unit: "Cryptographic Docs",
                progress: 100,
                color: "text-emerald-600 dark:text-emerald-400",
                barColor: "bg-emerald-500",
                icon: "🛡️",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-white/[0.06] dark:bg-dark-900/70"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-400">
                    {stat.label}
                  </span>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-2xl lg:text-3xl font-black tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-dark-400">{stat.unit}</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-dark-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.barColor} transition-all duration-700`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─────────────────── 3. AI ACTIVITY HEATMAP (NEURAL PULSE GRID) ─────────────────── */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📈 Neural Activity Pulse</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                    🔥 24-Day Continuous Streak
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
                  Real-time cognitive operation telemetry over the last 30 billing cycles.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-dark-400">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm bg-slate-100 dark:bg-dark-800" />
                  <div className="h-3 w-3 rounded-sm bg-brand-200 dark:bg-brand-900/60" />
                  <div className="h-3 w-3 rounded-sm bg-brand-400 dark:bg-brand-700" />
                  <div className="h-3 w-3 rounded-sm bg-brand-600 dark:bg-brand-500" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-30 gap-1.5 pt-1">
              {ACTIVITY_DAYS.map((d) => {
                let bgClass = "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-400";
                if (d.operations > 25) {
                  bgClass = "bg-brand-600 text-white font-bold shadow-sm shadow-brand-600/30";
                } else if (d.operations > 18) {
                  bgClass = "bg-brand-400 text-white font-semibold dark:bg-brand-600";
                } else if (d.operations > 10) {
                  bgClass = "bg-brand-200 text-brand-900 dark:bg-brand-900/70 dark:text-brand-200";
                }

                return (
                  <div
                    key={d.day}
                    title={`${d.date}: ${d.operations} AI operations executed`}
                    className={`group relative flex h-10 flex-col items-center justify-center rounded-lg text-[10px] cursor-pointer transition-all hover:scale-110 ${bgClass}`}
                  >
                    <span>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─────────────────── 4. COMMAND CENTER NAVIGATION TABS ─────────────────── */}
          <div>
            <div className="flex border-b border-slate-200 dark:border-white/[0.08] gap-1 overflow-x-auto pb-px">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap rounded-t-xl ${
                    activeTab === tab.id
                      ? "text-brand-600 bg-white border border-b-white border-slate-200 shadow-sm dark:bg-dark-900 dark:text-brand-400 dark:border-white/[0.08] dark:border-b-dark-900"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 dark:text-dark-300 dark:hover:text-white dark:hover:bg-dark-800/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-6">
              <AnimatePresence mode="wait">
                
                {/* ─── TAB 1: IDENTITY & BIO ─── */}
                {activeTab === "identity" && (
                  <motion.div
                    key="tab-identity"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Identity & Records</h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                        Verified personal credentials connected directly to the PostgreSQL database.
                      </p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Full Legal Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-dark-950 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-dark-950 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Professional Role / Title
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-dark-950 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Timezone
                          </label>
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-dark-950 dark:text-white"
                          >
                            <option value="Asia/Kolkata (IST)">Asia/Kolkata (UTC+5:30)</option>
                            <option value="America/New_York (EST)">America/New_York (UTC-5)</option>
                            <option value="America/Los_Angeles (PST)">America/Los_Angeles (UTC-8)</option>
                            <option value="Europe/London (GMT)">Europe/London (UTC+0)</option>
                            <option value="Asia/Tokyo (JST)">Asia/Tokyo (UTC+9)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                          Bio & Architectural Statement
                        </label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-dark-950 dark:text-white"
                        />
                      </div>

                      {saveSuccess && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-2">
                          <span>✓</span> Profile updated successfully and synced to PostgreSQL!
                        </div>
                      )}

                      {errorMessage && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 flex items-center gap-2">
                          <span>✕</span> {errorMessage}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 active:scale-95"
                        >
                          {saving ? "Saving to Database…" : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ─── TAB 2: AI CO-PILOT PERSONA ─── */}
                {activeTab === "copilot" && (
                  <motion.div
                    key="tab-copilot"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal AI Co-Pilot Customizer</h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                        Tailor how your dedicated Nexus AI companion responds, reasons, and executes workflows on your behalf.
                      </p>
                    </div>

                    <form onSubmit={handleSaveCopilot} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Companion Codename
                          </label>
                          <input
                            type="text"
                            value={copilotName}
                            onChange={(e) => setCopilotName(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-dark-950 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Communication Tone
                          </label>
                          <select
                            value={copilotTone}
                            onChange={(e) => setCopilotTone(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-dark-950 dark:text-white"
                          >
                            <option value="Technical & Precise">Technical & Concise</option>
                            <option value="Visionary Architect">Visionary Architect</option>
                            <option value="Analytical Researcher">Analytical Researcher</option>
                            <option value="Socratic Mentor">Socratic Mentor</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                            Default Reasoning Model
                          </label>
                          <select
                            value={copilotModel}
                            onChange={(e) => setCopilotModel(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-dark-950 dark:text-white"
                          >
                            <option value="GPT-4o">GPT-4o (High Speed & Code)</option>
                            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Deep Reasoning)</option>
                            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (2M Context Window)</option>
                            <option value="LLaMA 3.1 70B">LLaMA 3.1 70B (Local Inference)</option>
                          </select>
                        </div>
                      </div>

                      {/* Capabilities Matrix */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/[0.06] dark:bg-dark-950/50 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-dark-300">
                          Activated Neural Directives
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {[
                            { name: "Autonomous Memory Graph Access", desc: "Allows retrieval of cross-session conversational memory." },
                            { name: "Code Execution Sandbox", desc: "Permits code testing and AST inspection in secure container." },
                            { name: "Vector Index Semantic Search", desc: "Prioritizes your indexed documents before querying external sources." },
                            { name: "Zero-Retention Privacy Enforced", desc: "Model inference providers receive zero training permissions." },
                          ].map((directive) => (
                            <label key={directive.name} className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-dark-900/60 cursor-pointer">
                              <input type="checkbox" defaultChecked className="mt-0.5 rounded text-brand-600" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{directive.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-dark-400 mt-0.5">{directive.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {copilotSaved && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                          ✓ AI Co-Pilot Persona preferences updated!
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-brand-600/30 hover:from-brand-500 hover:to-indigo-500 transition-all active:scale-95"
                        >
                          Save Co-Pilot Settings
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ─── TAB 3: THEME & ATMOSPHERE ─── */}
                {activeTab === "atmosphere" && (
                  <motion.div
                    key="tab-atmosphere"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Visual Atmosphere & Display</h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                        Select your preferred brightness level and interface styling. Applies instantaneously.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {[
                        {
                          id: "light",
                          title: "Daylight Light",
                          desc: "High-luminance crisp interface tuned for daytime productivity.",
                          icon: "☀️",
                          bgPreview: "bg-slate-100 border-slate-300",
                          innerBar: "bg-brand-600",
                        },
                        {
                          id: "dark",
                          title: "Obsidian Dark",
                          desc: "Deep contrast slate theme designed for extended focus and low eye strain.",
                          icon: "🌙",
                          bgPreview: "bg-dark-950 border-dark-800",
                          innerBar: "bg-brand-500",
                        },
                        {
                          id: "system",
                          title: "System Synchronization",
                          desc: "Automatically shifts between light and dark according to your OS schedule.",
                          icon: "💻",
                          bgPreview: "bg-gradient-to-r from-slate-200 to-dark-900 border-slate-300",
                          innerBar: "bg-brand-500",
                        },
                      ].map((item) => {
                        const isSelected = theme === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTheme(item.id as "dark" | "light" | "system")}
                            className={`p-5 rounded-2xl border text-left transition-all relative ${
                              isSelected
                                ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/30 dark:border-brand-500 dark:bg-brand-500/10"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-dark-950 dark:hover:border-white/20"
                            }`}
                          >
                            <div className={`h-20 w-full rounded-xl ${item.bgPreview} border p-3 mb-4 flex flex-col justify-between shadow-inner`}>
                              <div className={`h-2 w-12 rounded-full ${item.innerBar}`} />
                              <div className="space-y-1">
                                <div className="h-1.5 w-full rounded bg-slate-300 dark:bg-dark-700" />
                                <div className="h-1.5 w-2/3 rounded bg-slate-300 dark:bg-dark-700" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{item.icon}</span> {item.title}
                              </span>
                              {isSelected && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ─── TAB 4: AGENTS FLEET ─── */}
                {activeTab === "agents" && (
                  <motion.div
                    key="tab-agents"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Autonomous Agent Fleet</h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                        Agents configured and managed directly under your personal credentials.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: "Code Review & Refactor Daemon", role: "AST Analysis", status: "Active", latency: "180ms", icon: "⚡" },
                        { name: "Vector Knowledge Synthesizer", role: "RAG Ingestion", status: "Active", latency: "240ms", icon: "🧠" },
                        { name: "Continuous Compliance Auditor", role: "Security & PII", status: "Active", latency: "95ms", icon: "🛡️" },
                        { name: "API Webhook Dispatcher", role: "Event Streams", status: "Standby", latency: "50ms", icon: "📡" },
                      ].map((agent) => (
                        <div
                          key={agent.name}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-dark-950/60"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{agent.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</p>
                              <p className="text-xs text-slate-500 dark:text-dark-400">{agent.role} · Latency {agent.latency}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            agent.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─── TAB 5: SECURITY & SESSIONS ─── */}
                {activeTab === "security" && (
                  <motion.div
                    key="tab-security"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Sessions & Cryptographic Telemetry</h2>
                      <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                        Inspect verified JWT sessions and security boundaries.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { device: "Chrome 131 on Windows 11", location: "Active Session (Current)", status: "Verified", active: true },
                        { device: "Nexus CLI Daemon 0.9.4", location: "Local Development Terminal", status: "Token Active", active: false },
                        { device: "Nexus Mobile Companion", location: "iOS Device", status: "Idle", active: false },
                      ].map((sess) => (
                        <div
                          key={sess.device}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-dark-950/60"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{sess.device}</p>
                            <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">{sess.location}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            sess.active
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                              : "bg-slate-200 text-slate-700 border-slate-300 dark:bg-dark-800 dark:border-white/10 dark:text-dark-300"
                          }`}>
                            {sess.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─── TAB 6: API KEYS & WEBHOOKS ─── */}
                {activeTab === "apikeys" && (
                  <motion.div
                    key="tab-apikeys"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-dark-900/60 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal API Access Tokens</h2>
                        <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
                          Use these secure keys to authenticate CLI scripts and autonomous agent workflows.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/20"
                      >
                        + Generate Token
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: "Production CLI Key", prefix: "nx_live_9842a...", created: "Issued 3 days ago", access: "Full Platform" },
                        { name: "Automated Agent Worker", prefix: "nx_agent_3812f...", created: "Issued 12 days ago", access: "Read / Infer" },
                      ].map((key) => (
                        <div
                          key={key.name}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-dark-950/60"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{key.name}</p>
                            <p className="text-xs font-mono text-slate-500 dark:text-dark-400 mt-0.5">{key.prefix} · {key.created}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                              {key.access}
                            </span>
                            <button
                              type="button"
                              onClick={() => alert("Token copied to clipboard.")}
                              className="text-xs px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 dark:border-white/10 dark:hover:bg-dark-800 dark:text-dark-200"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
