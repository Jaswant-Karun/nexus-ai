"use client";

import { useState } from "react";
import { NavBar, Sidebar } from "@nexus/ui";
import { Avatar } from "@/components/common/Avatar";
import { StatCard } from "@/components/cards/StatCard";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",   href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder",  href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine",  href: "/workspace", icon: "🧠" },
  { id: "settings",  label: "Platform Settings", href: "/settings",  icon: "⚙️" },
];

const TABS = ["Profile", "Security", "API Keys", "Sessions"];

export default function ProfilePage() {
  const [tab, setTab] = useState("Profile");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/profile"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header card */}
          <div className="flex items-center gap-6 rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6">
            <Avatar name="Jaswant Karun" size="xl" />
            <div>
              <h1 className="text-2xl font-extrabold text-white">Jaswant Karun</h1>
              <p className="text-gray-400 text-sm mt-0.5">admin@nexus.ai · Administrator</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full bg-brand-500/15 px-3 py-0.5 text-xs font-semibold text-brand-400">Enterprise Plan</span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 text-xs font-semibold">Active</span>
              </div>
            </div>
            <div className="ml-auto">
              <button type="button" className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatCard title="Agents Deployed"    value="14"    trend="Last 30 days"  accent="brand"  />
            <StatCard title="Workflows Created"  value="23"    trend="6 active"      accent="purple" />
            <StatCard title="API Requests (mo)"  value="38.2k" trend="+18% growth"   trendUp accent="green"  />
            <StatCard title="Avg Response Time"  value="310ms" trend="-22ms improved" trendUp accent="amber"  />
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-white/[0.06] mb-6">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    tab === t
                      ? "text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Profile" && (
              <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-5">
                <h2 className="text-base font-semibold text-white">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name",      value: "Jaswant Karun" },
                    { label: "Email",          value: "admin@nexus.ai" },
                    { label: "Role",           value: "Administrator"  },
                    { label: "Organization",   value: "Nexus Enterprise" },
                    { label: "Joined",         value: "January 15, 2026" },
                    { label: "Last Login",     value: "July 29, 2026 — 10:32 PM IST" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-400">{f.label}</label>
                      <div className="rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm text-white">
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="button" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-brand-600 hover:from-cyan-400 hover:to-brand-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-brand-600/20">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {tab === "Security" && (
              <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-5">
                <h2 className="text-base font-semibold text-white">Security Settings</h2>
                {[
                  { label: "Current Password",    type: "password", placeholder: "Enter current password" },
                  { label: "New Password",         type: "password", placeholder: "Enter new password" },
                  { label: "Confirm New Password", type: "password", placeholder: "Confirm new password" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-400">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition" />
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button type="button" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-brand-600 hover:from-cyan-400 hover:to-brand-500 text-white font-medium text-sm rounded-xl transition-all">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {tab === "API Keys" && (
              <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Your API Keys</h2>
                  <button type="button" className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 transition-colors">
                    + Generate Key
                  </button>
                </div>
                {[
                  { name: "Production Key",  key: "nxs_live_••••••••••••••••••••••••••", created: "Jan 15, 2026", lastUsed: "2 min ago" },
                  { name: "Development Key", key: "nxs_test_••••••••••••••••••••••••••", created: "Mar 1, 2026",  lastUsed: "1 hr ago"  },
                ].map((k) => (
                  <div key={k.name} className="flex items-center justify-between rounded-xl bg-gray-950/80 border border-white/[0.06] px-4 py-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{k.name}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{k.key}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Created {k.created} · Last used {k.lastUsed}</p>
                    </div>
                    <button type="button" className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">Revoke</button>
                  </div>
                ))}
              </div>
            )}

            {tab === "Sessions" && (
              <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Active Sessions</h2>
                {[
                  { device: "Chrome / Windows 11", location: "Mumbai, India",  ip: "49.36.x.x",  current: true,  lastActive: "Active now" },
                  { device: "Safari / macOS",       location: "Bengaluru, India",ip: "103.21.x.x", current: false, lastActive: "3 hr ago"  },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-gray-950/80 border border-white/[0.06] px-4 py-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{s.device}</p>
                        {s.current && <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold">Current</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{s.location} · {s.ip}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{s.lastActive}</p>
                    </div>
                    {!s.current && (
                      <button type="button" className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
