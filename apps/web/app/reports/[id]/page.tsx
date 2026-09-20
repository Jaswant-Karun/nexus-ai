'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  ArrowLeft, Download, FileBarChart2, CheckCircle2,
  Calendar, User, Tag, Share2, Printer, BookOpen,
  BarChart3, Shield, DollarSign, Server, ChevronDown, ChevronRight
} from 'lucide-react';

const reportsSubnav = [
  { label: 'All Reports', href: '/reports' },
  { label: 'Create Report', href: '/reports/create' },
  { label: 'Export Engine', href: '/reports/export' },
  { label: 'Archive History', href: '/reports/history' },
];

interface ReportSection {
  heading: string;
  content: string;
  metrics?: { label: string; value: string; trend?: string }[];
}

interface Report {
  title: string;
  type: string;
  author: string;
  date: string;
  status: string;
  summary: string;
  tags: string[];
  sections: ReportSection[];
}

const reportData: Record<string, Report> = {
  'rep-cluster-perf-aug': {
    title: 'Enterprise Cluster Performance & SLA Audit (August 2026)',
    type: 'Infrastructure & SLA',
    author: 'Nexus Telemetry Engine',
    date: 'Sep 1, 2026',
    status: 'Published',
    summary: '99.98% cluster availability, 312ms average latency, and zero data breaches recorded across 4 active microservices.',
    tags: ['Infrastructure', 'SLA', 'Performance', 'August 2026'],
    sections: [
      {
        heading: 'Executive Summary',
        content: 'The NEXUS AI infrastructure maintained exceptional availability during August 2026, with all four active microservices operating within defined SLA parameters. Zero critical incidents were recorded, and proactive autoscaling prevented any capacity-related degradation during peak usage windows.',
        metrics: [
          { label: 'Cluster Uptime', value: '99.98%', trend: '+0.02%' },
          { label: 'Avg API Latency', value: '312ms', trend: '-18ms' },
          { label: 'Error Rate', value: '0.02%', trend: '-0.01%' },
          { label: 'Data Breaches', value: '0', trend: '—' },
        ]
      },
      {
        heading: 'Service-Level Agreement Compliance',
        content: 'All four microservices (AI Inference, Storage, Authentication, Analytics) met or exceeded their contractual SLA thresholds. The AI Inference service briefly approached its 350ms P95 latency ceiling on August 14th due to a 3x spike in concurrent agent requests, but autoscaling resolved the condition within 90 seconds without breaching the SLA.',
        metrics: [
          { label: 'AI Inference SLA', value: '99.97%', trend: 'Compliant' },
          { label: 'Storage Service SLA', value: '99.99%', trend: 'Compliant' },
          { label: 'Auth Service SLA', value: '100%', trend: 'Compliant' },
          { label: 'Analytics SLA', value: '99.95%', trend: 'Compliant' },
        ]
      },
      {
        heading: 'Incident Log',
        content: 'No P0 or P1 incidents were recorded in August 2026. Two P2 incidents were raised and resolved within the same business day: (1) A temporary spike in vector embedding generation latency on Aug 14th caused by an unoptimized batch job. Resolved by query plan optimization. (2) A minor misconfiguration in the CDN cache-control headers affecting static asset delivery. Resolved within 4 hours.',
      },
      {
        heading: 'Recommendations',
        content: 'Based on August telemetry, the following optimizations are recommended for Q4 2026: (1) Increase pgvector HNSW index ef_construction parameter from 64 to 128 to improve recall quality at marginal latency cost. (2) Implement request coalescing for batch embedding requests to reduce per-token billing costs by an estimated 18%. (3) Consider deploying a read replica for the analytics database to offload reporting queries.',
      }
    ]
  },
  'rep-food-delivery-spec': {
    title: 'Food Delivery Multi-Agent Architecture Specification',
    type: 'System Architecture',
    author: 'Jaswant Karun & Orchestrator',
    date: 'Sep 5, 2026',
    status: 'Verified',
    summary: 'Complete technical breakdown of asynchronous event queues, driver geo-dispatch, and consensus verification.',
    tags: ['Architecture', 'Multi-Agent', 'Food Delivery', 'PostgreSQL'],
    sections: [
      {
        heading: 'Architecture Overview',
        content: 'The Food Delivery Platform leverages a 4-agent autonomous pipeline to handle order processing, driver dispatch, and real-time status tracking. The master orchestrator decomposes each order event into parallel workstreams assigned to specialized sub-agents, enabling sub-200ms end-to-end order acknowledgment.',
        metrics: [
          { label: 'Agent Pipeline Stages', value: '4 Stages' },
          { label: 'Avg Order Latency', value: '180ms' },
          { label: 'Concurrent Orders', value: '10,000+' },
          { label: 'DB Schema Tables', value: '18 Tables' },
        ]
      },
      {
        heading: 'PostgreSQL Schema Design',
        content: 'The database schema uses pgvector for driver-restaurant proximity matching, partitioned tables for order history (range-partitioned by month), and a JSONB column for flexible order metadata. The geo-dispatch index uses an HNSW index on the driver location embeddings column for sub-10ms nearest-neighbour lookups across 50,000 active drivers.',
      },
      {
        heading: 'Consensus Verification Layer',
        content: 'The Critic Agent (Agent 3) performs post-hoc verification on all generated code and schema definitions. In this project, it identified and corrected 3 N+1 query vulnerabilities in the initial schema design, reducing estimated database load by 67% under peak conditions.',
        metrics: [
          { label: 'Issues Identified', value: '3 N+1 bugs' },
          { label: 'DB Load Reduction', value: '67%' },
          { label: 'Verification Time', value: '2.3s avg' },
        ]
      },
    ]
  },
  'rep-token-spend-q3': {
    title: 'Q3 Enterprise Token Spend & Cost Attribution',
    type: 'Financial & Billing',
    author: 'Billing Service',
    date: 'Sep 3, 2026',
    status: 'Published',
    summary: 'Detailed model spend across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro with cost optimization suggestions.',
    tags: ['Billing', 'Q3', 'Cost', 'Token Usage'],
    sections: [
      {
        heading: 'Q3 Token Spend Summary',
        content: 'Total token expenditure for Q3 2026 reached 847M tokens across all model providers, representing a 34% increase over Q2 driven primarily by the launch of the Autonomous Agent Fleet feature. Gemini 2.5 Flash emerged as the most cost-efficient provider at $0.0001/1K tokens for standard inference tasks.',
        metrics: [
          { label: 'Total Tokens (Q3)', value: '847M tokens' },
          { label: 'Total Cost (Q3)', value: '$1,240.80' },
          { label: 'QoQ Growth', value: '+34%' },
          { label: 'Cost per 1K tokens', value: '$0.0015 avg' },
        ]
      },
      {
        heading: 'Provider Breakdown',
        content: 'GPT-4o accounted for 42% of total spend due to its use in orchestration tasks requiring high reasoning capability. Claude 3.5 Sonnet contributed 31% primarily for research and long-document synthesis tasks. Gemini 2.5 Flash represented 27% of spend but handled 58% of total request volume, indicating its strong cost efficiency for high-frequency agent calls.',
        metrics: [
          { label: 'GPT-4o Spend', value: '$521.14 (42%)' },
          { label: 'Claude 3.5 Spend', value: '$384.65 (31%)' },
          { label: 'Gemini Flash Spend', value: '$335.01 (27%)' },
        ]
      },
      {
        heading: 'Optimization Recommendations',
        content: 'Three strategies are projected to reduce Q4 spend by 22-28%: (1) Route all sub-1000 token classification tasks from GPT-4o to Gemini 2.5 Flash — estimated saving $140/month. (2) Implement prompt caching for repeated system prompts across the 13 agent fleet — estimated saving $60/month. (3) Enable batch inference for non-real-time analytics tasks — estimated saving $80/month.',
      }
    ]
  }
};

const defaultReport: Report = {
  title: 'Report Not Found',
  type: 'Unknown',
  author: '—',
  date: '—',
  status: 'Unknown',
  summary: 'This report does not exist or has been removed.',
  tags: [],
  sections: []
};

const typeIcons: Record<string, React.ReactNode> = {
  'Infrastructure & SLA': <Server className="w-4 h-4 text-indigo-400" />,
  'System Architecture': <BookOpen className="w-4 h-4 text-violet-400" />,
  'Financial & Billing': <DollarSign className="w-4 h-4 text-emerald-400" />,
  'Security': <Shield className="w-4 h-4 text-red-400" />,
};

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const report = reportData[id] || defaultReport;
  const [expandedSection, setExpandedSection] = useState<number>(0);

  const typeIcon = typeIcons[report.type] || <FileBarChart2 className="w-4 h-4 text-indigo-400" />;

  return (
    <ModuleLayout
      title="Report Viewer"
      subtitle={report.title}
      subnav={reportsSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Reports
          </Link>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Body */}
        <div className="lg:col-span-3 space-y-5">
          {/* Report Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                {typeIcon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white leading-snug mb-2">{report.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{report.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {report.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {report.sections.map((section, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-800/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-white">{section.heading}</span>
                  </div>
                  {expandedSection === idx
                    ? <ChevronDown className="w-4 h-4 text-slate-400" />
                    : <ChevronRight className="w-4 h-4 text-slate-400" />
                  }
                </button>
                {expandedSection === idx && (
                  <div className="px-5 pb-5 border-t border-slate-800">
                    {section.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-4">
                        {section.metrics.map(m => (
                          <div key={m.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                            <div className="text-[11px] text-slate-400 mb-1">{m.label}</div>
                            <div className="text-base font-bold text-white">{m.value}</div>
                            {m.trend && <div className="text-[10px] text-emerald-400 mt-0.5">{m.trend}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-slate-300 leading-relaxed mt-3">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
            {report.sections.length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-sm text-slate-500">No report content available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Metadata */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileBarChart2 className="w-4 h-4 text-indigo-400" /> Report Details
            </h3>
            <div className="space-y-3">
              {[
                { icon: <Tag className="w-3.5 h-3.5 text-indigo-400" />, label: 'Type', value: report.type },
                { icon: <User className="w-3.5 h-3.5 text-slate-400" />, label: 'Author', value: report.author },
                { icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />, label: 'Published', value: report.date },
                { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, label: 'Status', value: report.status },
                { icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />, label: 'Sections', value: `${report.sections.length} sections` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {item.icon} {item.label}
                  </div>
                  <span className="text-xs text-white font-medium text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white mb-3">Export</h3>
            {[
              { label: 'Download as PDF', icon: <Download className="w-3.5 h-3.5" /> },
              { label: 'Export to Markdown', icon: <FileBarChart2 className="w-3.5 h-3.5" /> },
              { label: 'Share Report Link', icon: <Share2 className="w-3.5 h-3.5" /> },
            ].map(action => (
              <button
                key={action.label}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700"
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>

          {/* Related Reports */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Related Reports</h3>
            <div className="space-y-2">
              {Object.entries(reportData)
                .filter(([key]) => key !== id)
                .slice(0, 2)
                .map(([key, r]) => (
                  <Link
                    key={key}
                    href={`/reports/${key}`}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 transition-colors"
                  >
                    <FileBarChart2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 line-clamp-2">{r.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
