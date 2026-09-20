"use client";

import { useState } from "react";
import type { WorkflowNode, WorkflowEdge } from "@nexus/types";

export interface WorkflowCanvasProps {
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  onAddNode?: (kind: WorkflowNode["kind"]) => void;
  selectedNodeId?: string | null;
  onSelectNode?: (node: WorkflowNode | null) => void;
  activeExecutingStep?: number | null;
}

const KIND_META: Record<string, { label: string; icon: string; bg: string; border: string; text: string; ring: string }> = {
  trigger: {
    label: "Trigger",
    icon: "⚡",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30 hover:border-amber-400",
    text: "text-amber-400",
    ring: "ring-amber-500/30",
  },
  agent: {
    label: "AI Agent",
    icon: "🤖",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30 hover:border-indigo-400",
    text: "text-indigo-400",
    ring: "ring-indigo-500/30",
  },
  action: {
    label: "Action",
    icon: "⚙️",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30 hover:border-emerald-400",
    text: "text-emerald-400",
    ring: "ring-emerald-500/30",
  },
};

export function WorkflowCanvas({
  nodes = [],
  edges = [],
  onAddNode,
  selectedNodeId,
  onSelectNode,
  activeExecutingStep,
}: WorkflowCanvasProps) {
  const [activeNode, setActiveNode] = useState<string | null>(selectedNodeId ?? null);
  const [viewMode, setViewMode] = useState<"flow" | "grid">("flow");

  const handleSelect = (node: WorkflowNode) => {
    const next = activeNode === node.id ? null : node.id;
    setActiveNode(next);
    onSelectNode?.(next ? node : null);
  };

  return (
    <div className="w-full h-full bg-gray-950 border border-gray-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 z-10 bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-white text-base tracking-tight">Visual Workflow Pipeline Diagram</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
              DAG Flow
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Sequential multi-agent execution pipeline. Click any node to inspect parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-xl bg-gray-800 p-0.5 border border-gray-700">
            <button
              type="button"
              onClick={() => setViewMode("flow")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === "flow" ? "bg-cyan-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              Diagram Flow
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-cyan-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              Grid View
            </button>
          </div>

          {/* Add node triggers */}
          <div className="flex items-center gap-1.5 border-l border-gray-800 pl-3">
            <button
              onClick={() => onAddNode?.("trigger")}
              type="button"
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 border border-amber-500/30 rounded-lg transition-all"
            >
              + Trigger
            </button>
            <button
              onClick={() => onAddNode?.("agent")}
              type="button"
              className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 border border-indigo-500/30 rounded-lg transition-all"
            >
              + Agent
            </button>
            <button
              onClick={() => onAddNode?.("action")}
              type="button"
              className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 border border-emerald-500/30 rounded-lg transition-all"
            >
              + Action
            </button>
          </div>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 my-6 relative z-10 overflow-x-auto overflow-y-hidden py-4">
        {viewMode === "flow" ? (
          <div className="min-w-full inline-flex items-center gap-4 py-8 px-4">
            {nodes.map((node, index) => {
              const meta = KIND_META[node.kind] ?? KIND_META.action;
              const isSelected = activeNode === node.id;
              const isExecuting = activeExecutingStep === index;
              const isPassed = activeExecutingStep !== null && activeExecutingStep !== undefined && activeExecutingStep > index;

              // Find edge connecting this node to the next
              const nextNode = nodes[index + 1];
              const edgeToNext = edges.find(
                (e) => (e.source === node.id && (!nextNode || e.target === nextNode.id)) ||
                       (nextNode && e.target === nextNode.id)
              ) ?? (index < nodes.length - 1 ? edges[index] : null);

              return (
                <div key={node.id} className="flex items-center shrink-0">
                  {/* Node Card */}
                  <div
                    onClick={() => handleSelect(node)}
                    className={`relative w-64 rounded-2xl bg-gray-900/90 backdrop-blur-sm border p-4 shadow-xl transition-all duration-200 cursor-pointer select-none group ${
                      isSelected
                        ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-105 shadow-cyan-500/20"
                        : meta.border
                    } ${
                      isExecuting
                        ? "ring-2 ring-amber-400 border-amber-400 shadow-amber-500/30 animate-pulse"
                        : ""
                    }`}
                  >
                    {/* Step indicator pill */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${meta.bg} ${meta.text}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isExecuting ? (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                        ) : isPassed ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                            ✓ Done
                          </span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                        )}
                      </div>
                    </div>

                    {/* Node title */}
                    <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {node.label}
                    </h4>

                    {/* Node description or config */}
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 font-sans">
                      {node.config?.description as string ||
                        (node.kind === "trigger"
                          ? "Listens for incoming webhooks or triggers"
                          : node.kind === "agent"
                          ? "Performs AI reasoning and analysis"
                          : "Executes automated system action")}
                    </p>

                    {/* Node footer */}
                    <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center justify-between text-[10px] font-mono text-gray-500">
                      <span>{node.id}</span>
                      <span className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                        {isSelected ? "Selected" : "Click to view"}
                      </span>
                    </div>
                  </div>

                  {/* Connecting Arrow / Edge */}
                  {index < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center px-2 shrink-0">
                      {edgeToNext?.label && (
                        <span className="text-[10px] font-medium text-cyan-400/90 bg-gray-900/90 border border-cyan-500/20 px-2 py-0.5 rounded-full mb-1 max-w-[130px] truncate">
                          {edgeToNext.label}
                        </span>
                      )}
                      <div className="flex items-center">
                        <div className={`h-0.5 w-10 sm:w-14 ${isPassed ? "bg-emerald-400" : "bg-gradient-to-r from-cyan-500 to-indigo-500"}`} />
                        <svg
                          className={`w-4 h-4 -ml-1.5 ${isPassed ? "text-emerald-400" : "text-indigo-400 animate-pulse"}`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch p-2">
            {nodes.map((node, index) => {
              const meta = KIND_META[node.kind] ?? KIND_META.action;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleSelect(node)}
                  className={`p-4 rounded-xl bg-gray-900/90 border shadow-xl transition-all cursor-pointer group ${
                    isSelected ? "border-cyan-400 ring-2 ring-cyan-400/30" : meta.border
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${meta.text}`}>
                      Step {index + 1}: {meta.icon} {meta.label}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {node.label}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">ID: {node.id}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="z-10 text-xs text-gray-400 flex flex-wrap justify-between items-center border-t border-gray-800/80 pt-3 gap-2">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-white font-semibold">Nodes: {nodes.length}</span>
          <span className="text-gray-600">|</span>
          <span className="text-cyan-400 font-semibold">Connections: {Math.max(0, nodes.length - 1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-gray-300">Execution Status: Ready to Run</span>
        </div>
      </div>
    </div>
  );
}

