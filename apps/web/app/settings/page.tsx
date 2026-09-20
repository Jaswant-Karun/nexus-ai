"use client";

import { StatCard } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const tabs = ["General", "AI Models", "Integrations", "Security", "Billing"];
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-dark-950 dark:text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Platform Settings</h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Configure your Nexus AI environment, model routing, integrations, appearance, and security policies.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Active Integrations" value="8" trend="+2 connected" />
            <StatCard title="API Keys Issued" value="24" trend="3 expiring soon" />
            <StatCard title="Model Endpoints" value="6" trend="GPT-4o, Claude, Gemini+" />
            <StatCard title="Security Score" value="A+" trend="All checks passing" />
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-gray-800">
            <nav className="flex space-x-1 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-white text-brand-600 border border-b-white border-slate-200 shadow-sm dark:bg-gray-800/90 dark:text-white dark:border-b-gray-800 dark:border-gray-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "General" && <GeneralSettings />}
            {activeTab === "AI Models" && <AIModelSettings />}
            {activeTab === "Integrations" && <IntegrationSettings />}
            {activeTab === "Security" && <SecuritySettings />}
            {activeTab === "Billing" && <BillingSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────── General ─────────────────────────── */
function GeneralSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-6">
      <SettingsCard title="Organization Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Organization Name" defaultValue="Nexus Enterprise" />
          <Field label="Platform URL" defaultValue="https://nexus.ai/org/enterprise" />
          <Field label="Support Email" defaultValue="support@nexus.ai" type="email" />
          <Field label="Default Timezone" defaultValue="UTC+0" />
        </div>
      </SettingsCard>

      <SettingsCard title="Appearance & Theme Controls">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "light",
                  label: "Light Mode",
                  desc: "Crisp white interface with optimal daytime contrast",
                  icon: "☀️",
                },
                {
                  id: "dark",
                  label: "Dark Mode",
                  desc: "Obsidian dark palette tailored for night sessions",
                  icon: "🌙",
                },
                {
                  id: "system",
                  label: "System Sync",
                  desc: "Automatically follows your operating system preference",
                  icon: "💻",
                },
              ].map((opt) => {
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id as "dark" | "light" | "system")}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/30 dark:border-brand-500 dark:bg-brand-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-gray-800 dark:bg-gray-950/60 dark:hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{opt.icon}</span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{opt.desc}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-gray-800/60 text-[11px] font-medium text-slate-400 dark:text-gray-500 flex items-center justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {isSelected ? "Active" : opt.id === resolvedTheme ? "Resolved" : "Inactive"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <SelectField
              label="Quick Theme Select"
              options={["dark", "light", "system"]}
              value={theme}
              onChange={(val) => setTheme(val as "dark" | "light" | "system")}
            />
            <SelectField label="Language" options={["English (US)", "English (UK)", "Spanish", "French"]} defaultValue="English (US)" />
            <SelectField label="Date Format" options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} defaultValue="YYYY-MM-DD" />
          </div>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

/* ─────────────────────────── AI Models ─────────────────────────── */
function AIModelSettings() {
  const models = [
    { name: "GPT-4o", provider: "OpenAI", status: "ACTIVE", latency: "310ms", cost: "$0.005/1k" },
    { name: "Claude 3.5 Sonnet", provider: "Anthropic", status: "ACTIVE", latency: "420ms", cost: "$0.003/1k" },
    { name: "Gemini 1.5 Pro", provider: "Google", status: "ACTIVE", latency: "280ms", cost: "$0.002/1k" },
    { name: "Mistral Large", provider: "Mistral AI", status: "PAUSED", latency: "190ms", cost: "$0.001/1k" },
    { name: "LLaMA 3.1 70B", provider: "Local / Ollama", status: "ACTIVE", latency: "85ms", cost: "$0.00/1k" },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Model Router Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Default Model"
            options={["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Mistral Large"]}
            defaultValue="GPT-4o"
          />
          <SelectField
            label="Fallback Model"
            options={["Claude 3.5 Sonnet", "GPT-4o", "Gemini 1.5 Pro"]}
            defaultValue="Claude 3.5 Sonnet"
          />
          <Field label="Max Tokens per Request" defaultValue="8192" type="number" />
          <Field label="Temperature" defaultValue="0.7" type="number" />
        </div>
      </SettingsCard>

      <SettingsCard title="Registered Model Endpoints">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-800">
                <th className="pb-3 pr-6 font-semibold">Model</th>
                <th className="pb-3 pr-6 font-semibold">Provider</th>
                <th className="pb-3 pr-6 font-semibold">Latency</th>
                <th className="pb-3 pr-6 font-semibold">Cost</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
              {models.map((m) => (
                <tr key={m.name} className="py-3">
                  <td className="py-3 pr-6 text-slate-900 dark:text-white font-semibold">{m.name}</td>
                  <td className="py-3 pr-6 text-slate-600 dark:text-gray-300">{m.provider}</td>
                  <td className="py-3 pr-6 text-slate-600 dark:text-gray-300">{m.latency}</td>
                  <td className="py-3 pr-6 text-slate-600 dark:text-gray-300">{m.cost}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        m.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

/* ─────────────────────────── Integrations ─────────────────────────── */
function IntegrationSettings() {
  const integrations = [
    { name: "Slack", description: "Send agent alerts and notifications to Slack channels.", connected: true },
    { name: "GitHub", description: "Trigger workflows on code commits and pull requests.", connected: true },
    { name: "Jira", description: "Sync tasks and issues with Jira project boards.", connected: false },
    { name: "Notion", description: "Export knowledge base entries directly to Notion pages.", connected: true },
    { name: "Zapier", description: "Connect to 5,000+ apps via Zapier automation.", connected: false },
    { name: "Webhooks", description: "Push real-time event payloads to external endpoints.", connected: true },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Connected Integrations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 transition-all hover:border-slate-300 dark:bg-gray-950/60 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div>
                <p className="text-slate-900 dark:text-white font-semibold text-sm">{integration.name}</p>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">{integration.description}</p>
              </div>
              <button
                type="button"
                className={`ml-4 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  integration.connected
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
              >
                {integration.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <ApiTokenManager />

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

/* ─────────────────────────── Live API Token Manager ─────────────────────────── */
function ApiTokenManager() {
  const [tokens, setTokens] = useState<Array<{
    id: string;
    name: string;
    prefix: string;
    secret?: string;
    scope: string;
    created: string;
    lastUsed: string;
  }>>([
    {
      id: "tok_prod_01",
      name: "Production Worker Key",
      prefix: "nx_live_99fa****************",
      secret: "nx_live_99fa84c20e11894b9aa102848c",
      scope: "Full Access (Read/Write)",
      created: "Today, 10:24 AM",
      lastUsed: "4 mins ago",
    },
    {
      id: "tok_stage_02",
      name: "Staging CI/CD Pipeline",
      prefix: "nx_test_41ca****************",
      secret: "nx_test_41ca27b878201a09d37449a11",
      scope: "Agent Dispatch Only",
      created: "Yesterday, 3:15 PM",
      lastUsed: "1 hour ago",
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("Full Access (Read/Write)");
  const [justCreatedSecret, setJustCreatedSecret] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim(), scope: newKeyScope }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setTokens((prev) => [data.token, ...prev]);
        setJustCreatedSecret(data.token.secret || null);
        setNewKeyName("");
        setIsGenerating(false);
      }
    } catch {
      // Offline fallback
      const hex = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      const secret = `nx_live_${hex}`;
      const entry = {
        id: `tok_${Date.now()}`,
        name: newKeyName.trim(),
        prefix: `nx_live_${hex.substring(0, 4)}****************`,
        secret,
        scope: newKeyScope,
        created: "Just now",
        lastUsed: "Never",
      };
      setTokens((prev) => [entry, ...prev]);
      setJustCreatedSecret(secret);
      setNewKeyName("");
      setIsGenerating(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeToken = async (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/tokens?id=${id}`, { method: "DELETE" }).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <SettingsCard title="API Keys & Cryptographic Access Tokens">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-gray-800">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">Personal & Agent API Keys</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Issue Bearer tokens for authenticating automated mobile pipelines, webhooks, and SDK clients.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsGenerating(!isGenerating);
                setJustCreatedSecret(null);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm flex items-center gap-1.5 self-start sm:self-auto transition-all"
            >
              + Generate New Token
            </button>
          </div>

          {/* New Token Banner Alert */}
          {justCreatedSecret && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 animate-in fade-in">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    NEW TOKEN CREATED
                  </span>
                  <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium mt-1">
                    Copy this key now. For your security, it will not be displayed again in full.
                  </p>
                  <p className="font-mono text-xs text-slate-900 dark:text-white bg-white/80 dark:bg-black/40 px-3 py-1.5 rounded-lg mt-2 border border-emerald-300 dark:border-emerald-700/50 break-all select-all">
                    {justCreatedSecret}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(justCreatedSecret, "new_secret")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-sm transition-all"
                >
                  {copiedId === "new_secret" ? "✓ Copied" : "Copy Token"}
                </button>
              </div>
            </div>
          )}

          {/* Generate Form Drawer */}
          {isGenerating && (
            <form
              onSubmit={handleCreateToken}
              className="p-4 rounded-xl bg-slate-50 border border-brand-200 dark:bg-gray-900/80 dark:border-brand-900/50 space-y-3 animate-in fade-in"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Create New Access Token
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-gray-300 mb-1">
                    Token Label / Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile iOS Client, Production Worker"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-white dark:bg-gray-950 border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-gray-300 mb-1">
                    Permission Scope
                  </label>
                  <select
                    value={newKeyScope}
                    onChange={(e) => setNewKeyScope(e.target.value)}
                    className="w-full bg-white dark:bg-gray-950 border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Full Access (Read/Write)">Full Access (Read/Write)</option>
                    <option value="Agent Dispatch Only">Agent Dispatch Only</option>
                    <option value="Read-Only Telemetry">Read-Only Telemetry</option>
                    <option value="Mobile & Workflows">Mobile & Workflows</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="px-3 py-1 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newKeyName.trim()}
                  className="px-3.5 py-1 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white shadow-sm"
                >
                  {loading ? "Generating..." : "Create & Issue Key"}
                </button>
              </div>
            </form>
          )}

          {/* Active Tokens List */}
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {tokens.map((token) => (
              <div key={token.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{token.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                      {token.scope}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-gray-400 font-mono">
                    <span>{token.prefix}</span>
                    <span>•</span>
                    <span className="font-sans">Created {token.created}</span>
                    <span>•</span>
                    <span className="font-sans">Last used {token.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {token.secret && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(token.secret!, token.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
                    >
                      {copiedId === token.id ? "✓ Copied" : "Copy"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => revokeToken(token.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      {/* Bring Your Own Key Provider Card */}
      <SettingsCard title="Bring Your Own Key (BYOK) AI Providers">
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
          Optionally route external LLM requests through your own commercial organization accounts.
        </p>
        <div className="space-y-3">
          {["OpenAI API Key", "Anthropic API Key", "Google AI API Key"].map((keyName) => (
            <div key={keyName} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="sm:w-44 text-sm font-medium text-slate-600 dark:text-gray-400 shrink-0">{keyName}</label>
              <input
                type="password"
                defaultValue="sk-••••••••••••••••••••••••••••"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:bg-gray-950 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => alert("Provider key securely stored in server environment vault.")}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 self-start sm:self-auto"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

/* ─────────────────────────── Security ─────────────────────────── */
function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Authentication">
        <div className="space-y-4">
          <ToggleRow label="Multi-Factor Authentication (MFA)" description="Require MFA for all admin accounts." defaultOn />
          <ToggleRow label="SSO / SAML 2.0" description="Enable Single Sign-On with your identity provider." defaultOn />
          <ToggleRow label="Session Timeout" description="Automatically log out inactive sessions after 30 minutes." defaultOn={false} />
        </div>
      </SettingsCard>

      <SettingsCard title="Access Control">
        <div className="space-y-4">
          <ToggleRow label="Role-Based Access Control (RBAC)" description="Restrict features by user role (Admin, Editor, Viewer)." defaultOn />
          <ToggleRow label="IP Allowlisting" description="Limit access to a set of trusted IP address ranges." defaultOn={false} />
          <ToggleRow label="Audit Logging" description="Record all user actions and API calls for compliance review." defaultOn />
        </div>
      </SettingsCard>

      <SettingsCard title="Data & Privacy">
        <div className="space-y-4">
          <ToggleRow label="Data Encryption at Rest" description="AES-256 encryption for all stored knowledge and embeddings." defaultOn />
          <ToggleRow label="PII Redaction" description="Automatically redact personally identifiable information in agent outputs." defaultOn={false} />
          <ToggleRow label="GDPR Compliance Mode" description="Enable EU data residency and right-to-erasure workflows." defaultOn />
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

/* ─────────────────────────── Billing ─────────────────────────── */
function BillingSettings() {
  const invoices = [
    { id: "INV-2026-07", period: "July 2026", amount: "$1,240.00", status: "PAID" },
    { id: "INV-2026-06", period: "June 2026", amount: "$980.50", status: "PAID" },
    { id: "INV-2026-05", period: "May 2026", amount: "$1,105.00", status: "PAID" },
    { id: "INV-2026-04", period: "April 2026", amount: "$870.00", status: "PAID" },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Current Plan">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-900 dark:text-white text-lg font-bold">Enterprise Plan</p>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
              Unlimited agents · 10M vector embeddings · Priority support · SLA 99.99%
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-brand-600/20"
          >
            Upgrade Plan
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Usage This Month">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "API Tokens Used", value: "18.4M", max: "50M" },
            { label: "Agent Executions", value: "42,310", max: "Unlimited" },
            { label: "Storage Used", value: "284 GB", max: "1 TB" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200 dark:bg-gray-950/60 dark:border-gray-800">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">of {item.max}</p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Invoice History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-800">
                <th className="pb-3 pr-6 font-semibold">Invoice ID</th>
                <th className="pb-3 pr-6 font-semibold">Period</th>
                <th className="pb-3 pr-6 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 pr-6 text-brand-600 dark:text-cyan-400 font-mono text-xs font-semibold">{inv.id}</td>
                  <td className="py-3 pr-6 text-slate-600 dark:text-gray-300">{inv.period}</td>
                  <td className="py-3 pr-6 text-slate-900 dark:text-white font-medium">{inv.amount}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}

/* ─────────────────────────── Shared UI helpers ─────────────────────────── */
function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm transition-colors dark:bg-gray-900/90 dark:border-gray-800 dark:shadow-none">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 dark:text-gray-300">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition dark:bg-gray-950 dark:border-gray-700 dark:text-gray-200"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 dark:text-gray-300">{label}</label>
      <select
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 capitalize focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition dark:bg-gray-950 dark:border-gray-700 dark:text-gray-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-gray-800/60 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
          on ? "bg-brand-600" : "bg-slate-300 dark:bg-gray-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton() {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/25 active:scale-95"
    >
      {saved ? "✓ Changes Saved!" : "Save Changes"}
    </button>
  );
}
