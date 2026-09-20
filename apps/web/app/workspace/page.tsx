"use client";

import { NavBar, Sidebar, DataTable, StatCard } from "@nexus/ui";

export default function WorkspacePage() {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
    { id: "chat", label: "AI Agent Studio", href: "/chat", icon: "🤖" },
    { id: "workflow", label: "Workflow Builder", href: "/workflow", icon: "⚡" },
    { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠", active: true },
    { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️" },
  ];

  const documents = [
    { id: "doc_1", title: "Enterprise_API_Docs.pdf", mimeType: "application/pdf", chunks: "1,420", size: "12.4 MB", status: "INDEXED" },
    { id: "doc_2", title: "Customer_Knowledge_Base.md", mimeType: "text/markdown", chunks: "890", size: "4.2 MB", status: "INDEXED" },
    { id: "doc_3", title: "Quarterly_Financial_Report.docx", mimeType: "application/docx", chunks: "2,150", size: "18.9 MB", status: "INDEXED" },
    { id: "doc_4", title: "System_Architecture_Spec.txt", mimeType: "text/plain", chunks: "540", size: "1.8 MB", status: "INDEXED" },
  ];

  const columns = [
    { key: "title", header: "Document Title" },
    { key: "mimeType", header: "Format" },
    { key: "chunks", header: "Vector Chunks" },
    { key: "size", header: "File Size" },
    {
      key: "status",
      header: "Indexing Status",
      render: (item: (typeof documents)[0]) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/workspace"
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Knowledge Base & RAG Engine</h1>
              <p className="text-gray-400 mt-1">Manage knowledge stores, vector indexing pipelines, and semantic search collections.</p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-cyan-500/20"
            >
              + Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Indexed Documents" value="482" trend="+14 added today" />
            <StatCard title="Total Vector Chunks" value="1.24M" trend="1536-dim embeddings" />
            <StatCard title="Hybrid Search Recall" value="98.7%" trend="BM25 + Dense Vectors" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Indexed Knowledge Repositories</h2>
            <DataTable columns={columns} data={documents} keyExtractor={(item) => item.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
