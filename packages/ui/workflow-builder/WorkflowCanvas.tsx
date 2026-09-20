"use client";

import type { WorkflowNode, WorkflowEdge } from "@nexus/types";

export interface WorkflowCanvasProps {
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  onAddNode?: (kind: WorkflowNode["kind"]) => void;
}

export function WorkflowCanvas({
  nodes = [],
  edges = [],
  onAddNode,
}: WorkflowCanvasProps) {
  return (
    <div className="w-full h-full bg-gray-950 border border-gray-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="flex items-center justify-between z-10 bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div>
          <h3 className="font-bold text-white text-base">Visual Workflow Designer</h3>
          <p className="text-xs text-gray-400">Drag and drop nodes to construct AI multi-agent pipelines</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddNode?.("trigger")}
            type="button"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-cyan-400 border border-cyan-500/30 rounded-md"
          >
            + Trigger Node
          </button>
          <button
            onClick={() => onAddNode?.("agent")}
            type="button"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-indigo-400 border border-indigo-500/30 rounded-md"
          >
            + AI Agent Node
          </button>
          <button
            onClick={() => onAddNode?.("action")}
            type="button"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-purple-400 border border-purple-500/30 rounded-md"
          >
            + Action Node
          </button>
        </div>
      </div>

      <div className="flex-1 my-6 relative z-10 grid grid-cols-3 gap-6 items-center">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {node.kind}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
              {node.label}
            </h4>
            <p className="text-xs text-gray-400 mt-1 font-mono">ID: {node.id}</p>
          </div>
        ))}
      </div>

      <div className="z-10 text-xs text-gray-500 flex justify-between items-center border-t border-gray-800/80 pt-3">
        <span>Nodes: {nodes.length} | Edges: {edges.length}</span>
        <span>Status: Ready to execute</span>
      </div>
    </div>
  );
}
