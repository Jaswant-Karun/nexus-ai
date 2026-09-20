"use client";

import { NavBar, Sidebar, WorkflowCanvas } from "@nexus/ui";
import { useState } from "react";
import type { WorkflowNode } from "@nexus/types";

export default function WorkflowPage() {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
    { id: "chat", label: "AI Agent Studio", href: "/chat", icon: "🤖" },
    { id: "workflow", label: "Workflow Builder", href: "/workflow", icon: "⚡", active: true },
    { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
    { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️" },
  ];

  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: "node_1", kind: "trigger", label: "HTTP Webhook Trigger", config: {}, position: { x: 0, y: 0 } },
    { id: "node_2", kind: "agent", label: "GPT-4o Data Extractor", config: {}, position: { x: 1, y: 0 } },
    { id: "node_3", kind: "action", label: "Store in Vector Database", config: {}, position: { x: 2, y: 0 } },
  ]);

  const handleAddNode = (kind: WorkflowNode["kind"]) => {
    const newNode: WorkflowNode = {
      id: `node_${nodes.length + 1}`,
      kind,
      label: `New ${kind.toUpperCase()} Node`,
      config: {},
      position: { x: nodes.length, y: 0 },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/workflow"
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />

        <main className="flex-1 p-8 flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Workflow Orchestrator</h1>
            <p className="text-gray-400 mt-1">Visually model, deploy, and monitor multi-agent autonomous pipelines.</p>
          </div>

          <div className="flex-1 min-h-[550px]">
            <WorkflowCanvas nodes={nodes} onAddNode={handleAddNode} />
          </div>
        </main>
      </div>
    </div>
  );
}
