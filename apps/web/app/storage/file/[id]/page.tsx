'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '@/components/layout/ModuleLayout';
import {
  ArrowLeft, Download, File, FileText, Image, Code2,
  Database, Shield, Clock, HardDrive, Tag, Sparkles,
  CheckCircle2, AlertCircle, Activity, Eye, Share2,
  Trash2, Copy, ChevronRight, BarChart3
} from 'lucide-react';

const storageSubnav = [
  { label: 'Storage Home', href: '/storage' },
  { label: 'All Files', href: '/storage/files' },
  { label: 'Upload', href: '/storage/upload' },
  { label: 'AI Analysis', href: '/storage/ai' },
  { label: 'Versions', href: '/storage/versions' },
];

interface FileVersion {
  version: string;
  date: string;
  size: string;
  author: string;
}

interface AIAnalysis {
  summary: string;
  keywords: string[];
  sentiment?: string;
  language?: string;
  topics: string[];
  readingTime?: string;
}

interface StorageFileDetail {
  name: string;
  type: string;
  mimeType: string;
  size: string;
  rawSize: number;
  uploadedAt: string;
  updatedAt: string;
  uploader: string;
  path: string;
  status: string;
  versions: FileVersion[];
  aiAnalysis: AIAnalysis | null;
  metadata: Record<string, string>;
  tags: string[];
}

const fileData: Record<string, StorageFileDetail> = {
  'file-001': {
    name: 'Architecture-Spec-v3.pdf',
    type: 'PDF',
    mimeType: 'application/pdf',
    size: '2.4 MB',
    rawSize: 2516582,
    uploadedAt: 'Sep 3, 2026 14:22',
    updatedAt: '2 days ago',
    uploader: 'Jaswant Karun',
    path: '/Projects/Food-Delivery/',
    status: 'Processed',
    tags: ['Architecture', 'Food Delivery', 'Specification'],
    versions: [
      { version: 'v3.0', date: 'Sep 3, 2026', size: '2.4 MB', author: 'Jaswant Karun' },
      { version: 'v2.1', date: 'Aug 28, 2026', size: '2.1 MB', author: 'Jaswant Karun' },
      { version: 'v1.0', date: 'Aug 20, 2026', size: '1.8 MB', author: 'Jaswant Karun' },
    ],
    aiAnalysis: {
      summary: 'A comprehensive 48-page technical specification detailing a multi-agent food delivery platform. Covers database schema design, real-time driver dispatch algorithms, API contract definitions, and microservices architecture patterns.',
      keywords: ['pgvector', 'microservices', 'dispatch', 'WebSocket', 'PostgreSQL', 'multi-agent', 'REST API'],
      topics: ['System Architecture', 'Database Design', 'Real-time Systems', 'API Design', 'AI Integration'],
      readingTime: '18 minutes',
      language: 'English',
    },
    metadata: {
      'Pages': '48',
      'Word Count': '12,400',
      'Author': 'Jaswant Karun',
      'Created': 'Aug 20, 2026',
      'PDF Version': '1.7',
      'Encrypted': 'No',
      'Embeddings': '124 vectors stored',
    }
  },
  'file-002': {
    name: 'nexus-db-schema.sql',
    type: 'SQL',
    mimeType: 'text/plain',
    size: '48 KB',
    rawSize: 49152,
    uploadedAt: 'Sep 5, 2026 09:15',
    updatedAt: '5 hours ago',
    uploader: 'Code Synthesizer Agent',
    path: '/Projects/Enterprise-RAG/',
    status: 'Processed',
    tags: ['Database', 'PostgreSQL', 'Schema'],
    versions: [
      { version: 'v2.0', date: 'Sep 5, 2026', size: '48 KB', author: 'Code Agent' },
      { version: 'v1.0', date: 'Sep 1, 2026', size: '38 KB', author: 'Code Agent' },
    ],
    aiAnalysis: {
      summary: 'PostgreSQL schema defining 13 tables for the NEXUS AI platform including Users, Agents, Workflows, StorageFiles, Embeddings, Projects, Reports, Conversations, Notifications, AuditLogs, Billing, Analytics, and Organizations with full foreign key constraints and pgvector extension.',
      keywords: ['CREATE TABLE', 'pgvector', 'REFERENCES', 'INDEX', 'JSONB', 'SERIAL', 'UUID'],
      topics: ['Database Schema', 'Data Modeling', 'PostgreSQL', 'pgvector', 'NEXUS Platform'],
      language: 'SQL',
    },
    metadata: {
      'Tables': '13',
      'Lines': '420',
      'DB Engine': 'PostgreSQL 16',
      'Extensions': 'pgvector, uuid-ossp',
      'Embeddings': '8 vectors stored',
    }
  },
  'file-003': {
    name: 'research-brief-rag.md',
    type: 'Markdown',
    mimeType: 'text/markdown',
    size: '18 KB',
    rawSize: 18432,
    uploadedAt: 'Sep 4, 2026 16:40',
    updatedAt: '1 week ago',
    uploader: 'Research Agent',
    path: '/Research/RAG-Engine/',
    status: 'Processed',
    tags: ['RAG', 'Research', 'Embeddings', 'Knowledge Base'],
    versions: [
      { version: 'v1.2', date: 'Sep 4, 2026', size: '18 KB', author: 'Research Agent' },
    ],
    aiAnalysis: {
      summary: 'Research brief comparing hybrid RAG approaches combining dense vector search (pgvector HNSW) with sparse BM25 retrieval. Concludes that hybrid re-ranking improves recall@10 by 23% versus pure vector search on enterprise document corpora.',
      keywords: ['RAG', 'HNSW', 'BM25', 'embedding', 'recall', 'retrieval', 'hybrid'],
      topics: ['Retrieval-Augmented Generation', 'Vector Search', 'Information Retrieval', 'LLM Applications'],
      readingTime: '7 minutes',
      language: 'English',
    },
    metadata: {
      'Word Count': '3,200',
      'Sections': '6',
      'Citations': '14',
      'Embeddings': '32 vectors stored',
    }
  }
};

const defaultFile: StorageFileDetail = {
  name: 'File Not Found',
  type: 'Unknown',
  mimeType: 'application/octet-stream',
  size: '0 B',
  rawSize: 0,
  uploadedAt: '—',
  updatedAt: '—',
  uploader: '—',
  path: '/',
  status: 'Unknown',
  tags: [],
  versions: [],
  aiAnalysis: null,
  metadata: {}
};

const fileIconMap: Record<string, React.ReactNode> = {
  'PDF': <FileText className="w-6 h-6 text-red-400" />,
  'SQL': <Database className="w-6 h-6 text-blue-400" />,
  'Markdown': <FileText className="w-6 h-6 text-indigo-400" />,
  'Python': <Code2 className="w-6 h-6 text-yellow-400" />,
  'Image': <Image className="w-6 h-6 text-emerald-400" />,
};

export default function StorageFileDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const file = fileData[id] || defaultFile;
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'versions'>('overview');
  const [copied, setCopied] = useState(false);

  const fileIcon = fileIconMap[file.type] || <File className="w-6 h-6 text-slate-400" />;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(file.path + file.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleLayout
      title="File Viewer"
      subtitle={`${file.path}${file.name}`}
      subnav={storageSubnav}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/storage/files"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Files
          </Link>
          <button className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">
          {/* File Header */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {fileIcon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1">{file.name}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400">{file.path}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-400">{file.size}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {file.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {file.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-800">
              {(['overview', 'ai', 'versions'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-indigo-500 bg-slate-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'overview' ? 'File Metadata' :
                   tab === 'ai' ? '✨ AI Analysis' :
                   `Versions (${file.versions.length})`}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Metadata */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(file.metadata).map(([key, val]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-[11px] text-slate-500 mb-1">{key}</div>
                      <div className="text-sm text-white font-mono">{val}</div>
                    </div>
                  ))}
                  {Object.keys(file.metadata).length === 0 && (
                    <p className="text-xs text-slate-500 col-span-2 text-center py-6">No metadata extracted.</p>
                  )}
                </div>
              )}

              {/* AI Analysis */}
              {activeTab === 'ai' && (
                <div className="space-y-5">
                  {file.aiAnalysis ? (
                    <>
                      <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-indigo-400">AI-Generated Summary</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">{file.aiAnalysis.summary}</p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Topics Detected</div>
                        <div className="flex flex-wrap gap-2">
                          {file.aiAnalysis.topics.map(topic => (
                            <span key={topic} className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords</div>
                        <div className="flex flex-wrap gap-1.5">
                          {file.aiAnalysis.keywords.map(kw => (
                            <span key={kw} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {file.aiAnalysis.language && (
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                            <div className="text-[11px] text-slate-500 mb-1">Language</div>
                            <div className="text-sm text-white">{file.aiAnalysis.language}</div>
                          </div>
                        )}
                        {file.aiAnalysis.readingTime && (
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                            <div className="text-[11px] text-slate-500 mb-1">Reading Time</div>
                            <div className="text-sm text-white">{file.aiAnalysis.readingTime}</div>
                          </div>
                        )}
                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                          <div className="text-[11px] text-slate-500 mb-1">Topics Found</div>
                          <div className="text-sm text-white">{file.aiAnalysis.topics.length}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-400 mb-3">AI analysis not yet available for this file.</p>
                      <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all">
                        Run AI Analysis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Versions */}
              {activeTab === 'versions' && (
                <div className="space-y-3">
                  {file.versions.map((v, idx) => (
                    <div key={v.version} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                        idx === 0 ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {v.version}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-slate-500 mb-0.5">Date</div>
                          <div className="text-slate-200">{v.date}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 mb-0.5">Size</div>
                          <div className="text-white font-mono">{v.size}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 mb-0.5">Author</div>
                          <div className="text-slate-200">{v.author}</div>
                        </div>
                      </div>
                      {idx === 0 ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      ) : (
                        <button className="text-[11px] text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-slate-700">
                          Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick Info */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <File className="w-4 h-4 text-indigo-400" /> File Info
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Type', value: file.type },
                { label: 'MIME Type', value: file.mimeType },
                { label: 'Size', value: file.size },
                { label: 'Uploaded', value: file.uploadedAt },
                { label: 'Updated', value: file.updatedAt },
                { label: 'By', value: file.uploader },
              ].map(info => (
                <div key={info.label} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">{info.label}</span>
                  <span className="text-xs text-white font-medium text-right break-all">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white mb-3">Actions</h3>
            <button className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all">
              <Download className="w-3.5 h-3.5" /> Download File
            </button>
            <button
              onClick={handleCopyPath}
              className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Path'}
            </button>
            <Link
              href="/storage/ai"
              className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Analyse with AI
            </Link>
            <button className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-red-900/40 text-red-400 text-xs font-semibold transition-all border border-slate-700 hover:border-red-700/50">
              <Trash2 className="w-3.5 h-3.5" /> Delete File
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
