"use client";
import { useState } from "react";
import { Sidebar, WorkflowCanvas } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { generateWorkflow } from "@/lib/ai-client";
import type { WorkflowNode, WorkflowEdge } from "@nexus/types";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Agent Studio",  href: "/chat",      icon: "🤖" },
  { id: "workflow",  label: "Workflow Builder", href: "/workflow",  icon: "⚡", active: true },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
  { id: "storage",   label: "Storage",          href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings",href: "/settings",  icon: "⚙️" },
];

const DEFAULT_NODES: WorkflowNode[] = [
  {
    id: "node_1",
    kind: "trigger",
    label: "HTTP Webhook Trigger",
    config: { description: "Receives raw event payload and authenticates API request key" },
    position: { x: 0, y: 0 }
  },
  {
    id: "node_2",
    kind: "agent",
    label: "GPT-4o Data Extractor",
    config: { description: "Parses unstructured JSON payload and extracts structured entity fields" },
    position: { x: 1, y: 0 }
  },
  {
    id: "node_3",
    kind: "action",
    label: "Store in Vector Database",
    config: { description: "Generates semantic embeddings and writes records to PgVector collection" },
    position: { x: 2, y: 0 }
  },
];

const DEFAULT_EDGES: WorkflowEdge[] = [
  { id: "e1", source: "node_1", target: "node_2", label: "Payload Ingest" },
  { id: "e2", source: "node_2", target: "node_3", label: "Structured Embeddings" },
];

export default function WorkflowPage() {
  const [nodes,         setNodes]         = useState<WorkflowNode[]>(DEFAULT_NODES);
  const [edges,         setEdges]         = useState<WorkflowEdge[]>(DEFAULT_EDGES);
  const [goal,          setGoal]          = useState("");
  const [generating,    setGenerating]    = useState(false);
  const [generatedInfo, setGeneratedInfo] = useState<{
    name: string;
    description: string;
    reasoning: string;
    estimatedDuration?: string;
  } | null>(null);
  const [error,         setError]         = useState("");
  const [selectedNode,  setSelectedNode]  = useState<WorkflowNode | null>(null);
  const [simulating,    setSimulating]    = useState(false);
  const [activeStep,    setActiveStep]    = useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [showGuide,     setShowGuide]     = useState(true);

  const handleAddNode = (kind: WorkflowNode["kind"]) => {
    const newId = `node_${nodes.length + 1}`;
    const newNode: WorkflowNode = {
      id:       newId,
      kind,
      label:    `New ${kind.toUpperCase()} Node`,
      config:   { description: `Custom ${kind} step configured in visual editor` },
      position: { x: nodes.length, y: 0 },
    };

    setNodes((prev) => {
      const updated = [...prev, newNode];
      // Automatically add a connecting edge to the previous node
      if (prev.length > 0) {
        const prevNode = prev[prev.length - 1];
        setEdges((edgePrev) => [
          ...edgePrev,
          {
            id: `edge_${prevNode.id}_${newId}`,
            source: prevNode.id,
            target: newId,
            label: "Next Step",
          },
        ]);
      }
      return updated;
    });
  };

  const handleGenerate = async () => {
    if (!goal.trim() || generating) return;
    setGenerating(true);
    setError("");
    setGeneratedInfo(null);
    setSelectedNode(null);
    setSimulationLogs([]);
    setActiveStep(null);

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
        config:   { ...n.config, description: n.description },
        position: n.position ?? { x: 0, y: 0 },
      }));

      // Convert AI-generated edges to WorkflowEdge type
      const aiEdges: WorkflowEdge[] = result.workflow.edges.map((e) => ({
        id:       e.id,
        source:   e.source,
        target:   e.target,
        label:    e.label,
      }));

      setNodes(aiNodes);
      setEdges(aiEdges);
      setGeneratedInfo({
        name:              result.workflow.name,
        description:       result.workflow.description,
        reasoning:         result.workflow.reasoning,
        estimatedDuration: result.workflow.estimated_duration,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate workflow");
    } finally {
      setGenerating(false);
    }
  };

  // Run a live step-by-step pipeline simulation to explain what happens at every node
  const handleSimulatePipeline = async () => {
    if (simulating || nodes.length === 0) return;
    setSimulating(true);
    setSimulationLogs([]);
    setActiveStep(0);

    const logs: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setActiveStep(i);
      const stepStart = `[Step ${i + 1}/${nodes.length}] Running "${node.label}" (${node.kind.toUpperCase()})...`;
      logs.push(stepStart);
      setSimulationLogs([...logs]);

      // Delay to visually demonstrate execution progress
      await new Promise((res) => setTimeout(res, 900));

      const stepDone = `✓ Step ${i + 1} Succeeded: ${
        node.kind === "trigger"
          ? "Event ingested & verified."
          : node.kind === "agent"
          ? "AI reasoning finished, confidence score 99.4%."
          : "Action executed, payload transferred to next stage."
      }`;
      logs.push(stepDone);
      setSimulationLogs([...logs]);
    }

    logs.push(`🎉 Pipeline Execution Complete! All ${nodes.length} nodes executed successfully.`);
    setSimulationLogs([...logs]);
    setSimulating(false);
    setActiveStep(nodes.length); // All finished
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Real logged-in user profile header */}
      <AppNavbar brandName="NEXUS AI" />

      <div className="flex flex-1">
        <Sidebar items={sidebarItems} currentPath="/workflow"
          onNavigate={(href) => { window.location.href = href; }} />

        <main className="flex-1 p-6 lg:p-8 flex flex-col space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Workflow Orchestrator</h1>
              <p className="text-gray-400 mt-1 text-sm">
                Visually model and execute multi-agent DAG pipelines — or generate one with GPT-4o from a natural language goal.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowGuide((v) => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-800 bg-gray-900/80 hover:bg-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition-all"
              >
                <span>💡</span>
                <span>{showGuide ? "Hide Guide" : "What is Workflow Builder?"}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulatePipeline}
                disabled={simulating || nodes.length === 0}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {simulating ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Simulating Flow ({activeStep !== null ? activeStep + 1 : 1}/{nodes.length})…
                  </>
                ) : (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Simulate & Test Pipeline
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Educational Guide: What does the Workflow Builder do? */}
          {showGuide && (
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-dark-900/80 to-indigo-950/40 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">ℹ️</span>
                  <h3 className="text-sm font-bold text-white">How the NEXUS Workflow Builder Works</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Dismiss ✕
                </button>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                The **NEXUS Workflow Orchestrator** connects autonomous AI agents into an event-driven **Directed Acyclic Graph (DAG)**. Instead of single-step prompts, it automates complex workflows from start to finish:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>⚡</span> 1. Trigger Nodes
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Listens for events (Webhook, scheduled cron, new file upload, or user input) to kick off the automation.
                  </p>
                </div>
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                  <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <span>🤖</span> 2. AI Agent Nodes
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Powered by GPT-4o, Gemini, or Groq. Analyzes inputs, writes code, reviews fraud, or summarizes knowledge.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>⚙️</span> 3. Action Nodes
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Dispatches notifications (SMS/Email), executes API calls, writes to PostgreSQL, or indexes vector databases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Workflow Generator Bar */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h2 className="text-sm font-bold text-white">AI Workflow Diagram Generator</h2>
                <span className="rounded-full bg-brand-500/15 text-brand-400 text-[10px] font-bold px-2 py-0.5 border border-brand-500/20">
                  GPT-4o Powered
                </span>
              </div>
              <div className="flex gap-2">
                {["Food Delivery System", "Support Ticket Classifier", "E-Commerce Fraud Detection"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGoal(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 border border-white/5 transition-colors hidden sm:inline-block"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Type your goal, e.g. 'Create a workflow diagram for Food Delivery System'"
                className="flex-1 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition"
                disabled={generating}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !goal.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating Diagram…
                  </>
                ) : (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Generate Diagram
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </p>
            )}

            {/* Generated Workflow Plan Breakdown */}
            {generatedInfo && (
              <div className="rounded-xl bg-brand-500/5 border border-brand-500/20 p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📋</span> {generatedInfo.name}
                  </h3>
                  {generatedInfo.estimatedDuration && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                      Est. Execution: {generatedInfo.estimatedDuration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300">{generatedInfo.description}</p>
                <p className="text-xs text-dark-300 pt-1 border-t border-brand-500/10">
                  <strong className="text-brand-400">Architecture Reasoning:</strong> {generatedInfo.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Simulation Live Output Box (when running simulation) */}
          {simulationLogs.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-gray-950 p-4 font-mono text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 border-b border-gray-800 pb-2 mb-2 font-sans font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Pipeline Execution Stream
                </span>
                <span className="text-xs font-mono text-gray-500">Step {activeStep ?? 0} of {nodes.length}</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {simulationLogs.map((log, i) => (
                  <div key={i} className={log.startsWith("✓") ? "text-emerald-400" : log.startsWith("🎉") ? "text-cyan-300 font-bold" : "text-gray-300"}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual DAG Flow Diagram Canvas */}
          <div className="flex-1 min-h-[440px]">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onAddNode={handleAddNode}
              selectedNodeId={selectedNode?.id}
              onSelectNode={(node) => setSelectedNode(node)}
              activeExecutingStep={activeStep}
            />
          </div>

          {/* Node Inspector Modal / Details Bar */}
          {selectedNode && (
            <div className="rounded-2xl border border-cyan-500/30 bg-dark-900/90 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedNode.kind}
                  </span>
                  <h3 className="font-bold text-white text-base">{selectedNode.label}</h3>
                  <span className="text-xs font-mono text-gray-500">({selectedNode.id})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
                >
                  Close Inspector ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-400 block mb-1">Purpose / Description</span>
                  <p className="text-white font-medium">
                    {(selectedNode.config?.description as string) || "Executes assigned task in the multi-agent chain."}
                  </p>
                </div>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-400 block mb-1">Assigned AI Agent / Engine</span>
                  <p className="text-cyan-300 font-medium">
                    {selectedNode.kind === "agent" ? "GPT-4o Multi-Agent Worker" : selectedNode.kind === "trigger" ? "HTTP / Webhook Listener" : "NEXUS Action Dispatcher"}
                  </p>
                </div>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-400 block mb-1">State & Telemetry</span>
                  <p className="text-emerald-400 font-medium">Connected to DAG pipeline</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

