"use client";

import { ActivityChart } from "@/components/charts/ActivityChart";
import { UsageBar } from "@/components/charts/UsageBar";
import { StatCard } from "@/components/cards/StatCard";

const weekData = [
  { label: "Mon", value: 4200 },
  { label: "Tue", value: 6800 },
  { label: "Wed", value: 5300 },
  { label: "Thu", value: 9100 },
  { label: "Fri", value: 7400 },
  { label: "Sat", value: 3200 },
  { label: "Sun", value: 2100 },
];

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="API Requests (7d)"   value="38.2k"  trend="+18% vs last week" trendUp accent="brand"  />
        <StatCard title="Avg Response Time"   value="310ms"  trend="-22ms improved"    trendUp accent="green"  />
        <StatCard title="Error Rate"          value="0.04%"  trend="-0.01% this week"  trendUp accent="purple" />
      </div>

      {/* Chart + usage bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityChart
          title="Daily API Requests (This Week)"
          data={weekData}
          color="brand"
        />

        <div className="glass-dark rounded-2xl p-5 border border-white/[0.06] space-y-5">
          <p className="text-sm font-semibold text-white">Resource Usage</p>
          <UsageBar label="API Token Quota"      used={18400000} total={50000000} unit=" tok" />
          <UsageBar label="Agent Executions"     used={42310}    total={100000}   />
          <UsageBar label="Vector Storage"       used={284}      total={1024}     unit=" GB" />
          <UsageBar label="Knowledge Documents"  used={482}      total={5000}     />
        </div>
      </div>
    </div>
  );
}
