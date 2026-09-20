"use client";

import { NavBar, Sidebar } from "@nexus/ui";
import { StatCard } from "@/components/cards/StatCard";
import { UsageBar } from "@/components/charts/UsageBar";
import { StatusBadge } from "@/components/common/StatusBadge";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",   href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder",  href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine",  href: "/workspace", icon: "🧠" },
  { id: "settings",  label: "Platform Settings", href: "/settings",  icon: "⚙️", active: true },
];

const plans = [
  { name: "Starter",    price: "$49/mo",   highlight: false },
  { name: "Pro",        price: "$149/mo",  highlight: false },
  { name: "Enterprise", price: "Custom",   highlight: true  },
];

const invoices = [
  { id: "INV-2026-07", period: "July 2026",  amount: "$1,240.00", status: "success" as const },
  { id: "INV-2026-06", period: "June 2026",  amount: "$980.50",   status: "success" as const },
  { id: "INV-2026-05", period: "May 2026",   amount: "$1,105.00", status: "success" as const },
  { id: "INV-2026-04", period: "April 2026", amount: "$870.00",   status: "success" as const },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/billing"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Billing & Usage</h1>
            <p className="text-gray-400 mt-1">Manage your subscription plan, invoices, and usage quotas.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatCard title="Current Plan"       value="Enterprise"   trend="Active subscription" accent="brand"  />
            <StatCard title="Next Billing Date"  value="Aug 1, 2026"  trend="29 days remaining"   accent="purple" />
            <StatCard title="Monthly Spend"      value="$1,240"       trend="+12% vs last month"  trendUp accent="amber" />
            <StatCard title="Cost per Request"   value="$0.002"       trend="-18% optimised"      trendUp={true} accent="green" />
          </div>

          {/* Plans */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all ${
                    plan.highlight
                      ? "border-brand-500/50 bg-brand-500/10 ring-1 ring-brand-500/30"
                      : "border-white/[0.06] bg-gray-900/60"
                  }`}
                >
                  {plan.highlight && (
                    <span className="self-start rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Current Plan
                    </span>
                  )}
                  <div>
                    <p className="text-lg font-bold text-white">{plan.name}</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{plan.price}</p>
                  </div>
                  <button
                    type="button"
                    className={`mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-brand-600 text-white hover:bg-brand-500"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.highlight ? "Manage Plan" : "Upgrade"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-5">
            <h2 className="text-base font-semibold text-white">Resource Usage — July 2026</h2>
            <UsageBar label="API Tokens"        used={18_400_000} total={50_000_000} unit=" tok" />
            <UsageBar label="Agent Executions"  used={42_310}     total={100_000} />
            <UsageBar label="Vector Storage"    used={284}        total={1024} unit=" GB" />
            <UsageBar label="Knowledge Docs"    used={482}        total={5000} />
          </div>

          {/* Invoices */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Invoice History</h2>
            <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Invoice</th>
                    <th className="px-5 py-3.5">Period</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-cyan-400">{inv.id}</td>
                      <td className="px-5 py-3.5 text-gray-300">{inv.period}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{inv.amount}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={inv.status} label="Paid" /></td>
                      <td className="px-5 py-3.5">
                        <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
