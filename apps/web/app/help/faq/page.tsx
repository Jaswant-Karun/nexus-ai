'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';

const helpSubnav = [
  { label: 'Help Center', href: '/help' },
  { label: 'FAQ', href: '/help/faq' },
  { label: 'Contact Support', href: '/help/support' },
  { label: 'Report Bug', href: '/help/report-bug' },
  { label: 'Feature Request', href: '/help/feature-request' },
];

const faqs = [
  {
    q: 'How does NEXUS AI coordinate autonomous agent fleets?',
    a: 'NEXUS AI utilizes a stateful DAG (Directed Acyclic Graph) orchestration engine coupled with decentralized memory stores. Agents pass typed schema payloads to downstream sub-agents, monitoring execution status and automatically retrying failed sub-tasks with deterministic backoff strategies.'
  },
  {
    q: 'Can I bring my own OpenAI, Anthropic, or HuggingFace API keys?',
    a: 'Yes! In your Profile or Organization Settings under API Keys / LLM Configuration, you can toggle between NEXUS Managed Cloud Inference and Bring-Your-Own-Key (BYOK). When BYOK is enabled, tokens are routed straight through your corporate enterprise credentials without markup.'
  },
  {
    q: 'How does document indexing and vector search work in NEXUS Storage?',
    a: 'When you upload files (PDFs, Markdown, DOCX, Codebases) into NEXUS Storage, documents undergo asynchronous optical parsing, chunking with recursive boundary overlap, and multi-modal embedding generation via OpenAI text-embedding-3 or local BGE models stored in pgvector.'
  },
  {
    q: 'What is the SLA and uptime guarantee for Enterprise plans?',
    a: 'Enterprise subscriptions include a 99.99% monthly availability Service Level Agreement, multi-region failover, dedicated Kubernetes cluster provisioning, and 15-minute response times from our senior systems engineering team.'
  },
  {
    q: 'How do I integrate n8n workflows into NEXUS AI?',
    a: 'NEXUS features native bi-directional webhooks with n8n. In the Workflows module or Integrations panel, paste your n8n webhook URL and trigger complex microservices straight from chat prompts or automated agent actions.'
  },
  {
    q: 'Is my data used to train public foundational AI models?',
    a: 'No. All customer data, embeddings, chat transcripts, agent memories, and uploaded documents are strictly private to your isolated tenant and are never used for model pre-training or fine-tuning.'
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModuleLayout
      title="Frequently Asked Questions"
      subtitle="Detailed technical answers to common queries regarding security, deployment, billing, and agents"
      subnav={helpSubnav}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g., API keys, vector embeddings, n8n, privacy)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 text-xs text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ModuleLayout>
  );
}
