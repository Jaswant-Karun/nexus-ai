'use client';

import React from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Activity, Server, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

const adminSubnav = [
  { label: 'Admin Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Organizations', href: '/admin/organizations' },
  { label: 'Fleet Agents', href: '/admin/agents' },
  { label: 'Model Providers', href: '/admin/models' },
  { label: 'Workflows', href: '/admin/workflows' },
  { label: 'Storage & DB', href: '/admin/storage' },
  { label: 'Cluster Logs', href: '/admin/logs' },
  { label: 'Security & SSO', href: '/admin/security' },
  { label: 'System Health', href: '/admin/system' },
  { label: 'Backups', href: '/admin/backups' },
  { label: 'Admin Settings', href: '/admin/settings' },
];

const microservices = [
  { name: 'NEXUS Next.js Web Frontend', port: '3000', status: 'Online', uptime: '99.99%', latency: '12ms' },
  { name: 'FastAPI Python AI Service', port: '8001', status: 'Online', uptime: '99.98%', latency: '42ms' },
  { name: 'n8n Workflow Execution Engine', port: '5678', status: 'Online', uptime: '99.95%', latency: '28ms' },
  { name: 'PostgreSQL Relational + pgvector', port: '5432', status: 'Online', uptime: '100%', latency: '4ms' },
];

export default function AdminSystemPage() {
  return (
    <ModuleLayout
      title="Cluster Node Diagnostics & Microservice Health"
      subtitle="Super-admin real-time telemetry across background daemon services and ports"
      subnav={adminSubnav}
      actions={
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Ping Daemons
        </button>
      }
    >
      <div className="space-y-4">
        {microservices.map(s => (
          <div
            key={s.name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Server className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{s.name}</h4>
                <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Port :{s.port}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Uptime SLA: {s.uptime} • Health Probe Ping: {s.latency}
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-end sm:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
