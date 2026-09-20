"use client";

import { Sidebar, StatCard } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useState } from "react";

export default function SettingsPage() {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
    { id: "chat", label: "AI Agent Studio", href: "/chat", icon: "🤖" },
    { id: "workflow", label: "Workflow Builder", href: "/workflow", icon: "⚡" },
    { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
    { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️", active: true },
  ];

  const tabs = ["General", "AI Models", "Integrations", "Security", "Billing"];
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/settings"
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Settings</h1>
            <p className="text-gray-400 mt-1">
              Configure your Nexus AI environment, model routing, integrations, and security policies.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Active Integrations" value="8" trend="+2 connected" />
            <StatCard title="API Keys Issued" value="24" trend="3 expiring soon" />
            <StatCard title="Model Endpoints" value="6" trend="GPT-4o, Claude, Gemini+" />
            <StatCard title="Security Score" value="A+" trend="All checks passing" />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? "bg-gray-800 text-white border border-b-gray-800 border-gray-700"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
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

      <SettingsCard title="Appearance & Locale">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField label="Theme" options={["Dark", "Light", "System"]} defaultValue="Dark" />
          <SelectField label="Language" options={["English (US)", "English (UK)", "Spanish", "French"]} defaultValue="English (US)" />
          <SelectField label="Date Format" options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} defaultValue="YYYY-MM-DD" />
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
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3 pr-6 font-medium">Model</th>
                <th className="pb-3 pr-6 font-medium">Provider</th>
                <th className="pb-3 pr-6 font-medium">Latency</th>
                <th className="pb-3 pr-6 font-medium">Cost</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {models.map((m) => (
                <tr key={m.name} className="py-3">
                  <td className="py-3 pr-6 text-white font-medium">{m.name}</td>
                  <td className="py-3 pr-6 text-gray-300">{m.provider}</td>
                  <td className="py-3 pr-6 text-gray-300">{m.latency}</td>
                  <td className="py-3 pr-6 text-gray-300">{m.cost}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        m.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
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
              className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-gray-800"
            >
              <div>
                <p className="text-white font-semibold text-sm">{integration.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{integration.description}</p>
              </div>
              <button
                type="button"
                className={`ml-4 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  integration.connected
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                {integration.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="API Keys">
        <div className="space-y-3">
          {["OpenAI API Key", "Anthropic API Key", "Google AI API Key"].map((keyName) => (
            <div key={keyName} className="flex items-center gap-3">
              <label className="w-44 text-sm text-gray-400 shrink-0">{keyName}</label>
              <input
                type="password"
                defaultValue="sk-••••••••••••••••••••••••••••"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              />
              <button
                type="button"
                className="px-3 py-2 text-xs text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reveal
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-lg font-bold">Enterprise Plan</p>
            <p className="text-gray-400 text-sm mt-1">
              Unlimited agents · 10M vector embeddings · Priority support · SLA 99.99%
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-cyan-500/20"
          >
            Upgrade Plan
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Usage This Month">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "API Tokens Used", value: "18.4M", max: "50M" },
            { label: "Agent Executions", value: "42,310", max: "Unlimited" },
            { label: "Storage Used", value: "284 GB", max: "1 TB" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">of {item.max}</p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Invoice History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3 pr-6 font-medium">Invoice ID</th>
                <th className="pb-3 pr-6 font-medium">Period</th>
                <th className="pb-3 pr-6 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 pr-6 text-cyan-400 font-mono text-xs">{inv.id}</td>
                  <td className="py-3 pr-6 text-gray-300">{inv.period}</td>
                  <td className="py-3 pr-6 text-white font-medium">{inv.amount}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <h3 className="text-base font-semibold text-white">{title}</h3>
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
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
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
    <div className="flex items-center justify-between py-2 border-b border-gray-800/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
          on ? "bg-cyan-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-cyan-500/20"
    >
      Save Changes
    </button>
  );
}
