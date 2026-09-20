"use client";

import { useState } from "react";
import { NavBar, Sidebar, WorkflowCanvas } from "@nexus/ui";
import { generateWorkflow } from "@/lib/ai-client";
import { cn } from "@/lib/utils";
import type { WorkflowNode } from "@nexus/types";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",  href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder", href: "/workflow",  icon: "⚡", active: true },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
  { id: "storage",   label: "Storage",          href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings",href: "/settings",  icon: "⚙️" },
];

const DEFAULT_NODES: WorkflowNode[] = [
  { id: "node_1", kind: "trigger", label: "HTTP Webhook Trigger",     config: {}, position: { x: 0, y: 0 } },
  { id: "node_2", kind: "agent",   label: "GPT-4o Data Extractor",    config: {}, position: { x: 1, y: 0 } },
  { id: "node_3", kind: "action",  label: "Store in Vector Database", config: {}, position: { x: 2, y: 0 } },
];

export default function WorkflowPage() {
  const [nodes,         setNodes]         = useState<WorkflowNode[]>(DEFAULT_NODES);
  const [goal,          setGoal]          = useState("");
  const [generating,    setGenerating]    = useState(false);
  const [generatedInfo, setGeneratedInfo] = useState<{ name: string; description: string; reasoning: string } | null>(null);
  const [error,         setError]         = useState("");

  const handleAddNode = (kind: WorkflowNode["kind"]) => {
    const newNode: WorkflowNode = {
      id:       `node_${nodes.length + 1}`,
      kind,
      label:    `New ${kind.toUpperCase()} Node`,
      config:   {},
      position: { x: nodes.length, y: 0 },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleGenerate = async () => {
    if (!goal.trim() || generating) return;
    setGenerating(true);
    setError("");
    setGeneratedInfo(null);

    try {
      const result = await generateWorkflow({
        goal:              goal.trim(),
        available_agents:  ["analyst", "researcher", "coder", "critic", "summarizer"],
        available_tools:   ["vector_search", "code_interpreter", "web_search", "file_read"],
        max_nodes:         8,
        model:             "gpt-4o",
      });

      // Convert AI-generated nodes to WorkflowNode type
      const aiNodes: WorkflowNode[] = result.workflow.nodes.map((n) => ({
        id:       n.id,
        kind:     (n.kind as WorkflowNode["kind"]) || "action",
        label:    n.label,
        config:   n.config ?? {},
        position: n.position ?? { x: 0, y: 0 },
      }));

      setNodes(aiNodes);
      setGeneratedInfo({
        name:        result.workflow.name,
        description: result.workflow.description,
        reasoning:   result.workflow.reasoning,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate workflow");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} currentPath="/workflow"
          onNavigate={(href) => { window.location.href = href; }} />

        <main className="flex-1 p-8 flex flex-col space-y-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Workflow Orchestrator</h1>
              <p className="text-gray-400 mt-1">
                Visually model multi-agent pipelines — or let GPT-4o generate one from your goal.
              </p>
            </div>
          </div>

          {/* AI Workflow Generator */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-sm font-bold text-white">AI Workflow Generator</h2>
              <span className="rounded-full bg-brand-500/15 text-brand-400 text-[10px] font-bold px-2 py-0.5 border border-brand-500/20">
                GPT-4o Powered
              </span>
            </div>
            <div className="flex gap-3">
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Describe your workflow goal… e.g. 'Process customer support tickets, classify them, and generate AI responses'"
                className="flex-1 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition"
                disabled={generating}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !goal.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Generate Workflow
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>
            )}

            {generatedInfo && (
              <div className="rounded-xl bg-brand-500/5 border border-brand-500/20 p-4 space-y-1">
                <p className="text-sm font-semibold text-white">{generatedInfo.name}</p>
                <p className="text-xs text-dark-300">{generatedInfo.description}</p>
                <p className="text-xs text-dark-400 mt-1">
                  <span className="font-medium text-brand-400">AI reasoning:</span> {generatedInfo.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 min-h-[480px]">
            <WorkflowCanvas nodes={nodes} onAddNode={handleAddNode} />
          </div>
        </main>
      </div>
    </div>
  );
}
