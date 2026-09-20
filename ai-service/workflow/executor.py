"""
NEXUS AI Service — Workflow Executor
Executes workflow DAGs (nodes + edges) by running each node's
configured agent or action in topological order.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any


@dataclass
class WorkflowNode:
    id:          str
    kind:        str     # trigger | agent | action | condition | output
    label:       str
    config:      dict[str, Any] = field(default_factory=dict)
    position:    dict[str, int] = field(default_factory=dict)


@dataclass
class WorkflowEdge:
    id:     str
    source: str
    target: str
    label:  str = ""


@dataclass
class NodeExecution:
    node_id:    str
    node_label: str
    status:     str       # pending | running | completed | failed | skipped
    output:     Any       = None
    error:      str       = ""
    started_at: float     = 0.0
    ended_at:   float     = 0.0

    @property
    def duration_ms(self) -> float:
        return (self.ended_at - self.started_at) * 1000 if self.ended_at else 0.0


class WorkflowExecutor:
    """Execute a workflow DAG given nodes and edges."""

    def __init__(self, nodes: list[WorkflowNode], edges: list[WorkflowEdge]):
        self.nodes  = {n.id: n for n in nodes}
        self.edges  = edges
        self._graph = self._build_graph()
        self._results: dict[str, NodeExecution] = {}

    def _build_graph(self) -> dict[str, list[str]]:
        """Build adjacency list: node_id → [next_node_ids]."""
        graph: dict[str, list[str]] = {nid: [] for nid in self.nodes}
        for e in self.edges:
            if e.source in graph:
                graph[e.source].append(e.target)
        return graph

    def _topo_sort(self) -> list[str]:
        """Kahn's algorithm for topological ordering."""
        in_degree = {nid: 0 for nid in self.nodes}
        for targets in self._graph.values():
            for t in targets:
                in_degree[t] = in_degree.get(t, 0) + 1

        queue  = [nid for nid, deg in in_degree.items() if deg == 0]
        order: list[str] = []
        while queue:
            nid = queue.pop(0)
            order.append(nid)
            for next_id in self._graph.get(nid, []):
                in_degree[next_id] -= 1
                if in_degree[next_id] == 0:
                    queue.append(next_id)
        return order

    def execute(self, initial_payload: dict[str, Any] | None = None) -> dict:
        """Execute the workflow and return results for each node."""
        order   = self._topo_sort()
        context = initial_payload or {}

        for node_id in order:
            node = self.nodes[node_id]
            exec_result = NodeExecution(node_id=node_id, node_label=node.label,
                                        status="running", started_at=time.time())
            try:
                output = self._execute_node(node, context)
                exec_result.output   = output
                exec_result.status   = "completed"
                context[node_id]     = output    # pass output to downstream nodes
            except Exception as exc:
                exec_result.status = "failed"
                exec_result.error  = str(exc)
            exec_result.ended_at = time.time()
            self._results[node_id] = exec_result

        return {
            "status":  "completed" if all(r.status == "completed" for r in self._results.values()) else "partial",
            "nodes":   {nid: {"status": r.status, "duration_ms": r.duration_ms,
                               "error": r.error} for nid, r in self._results.items()},
            "outputs": {nid: r.output for nid, r in self._results.items() if r.output},
        }

    def _execute_node(self, node: WorkflowNode, context: dict) -> Any:
        """Execute a single node based on its kind."""
        kind = node.kind.lower()
        if kind == "trigger":
            return {"event": "triggered", "payload": context, "node": node.label}
        elif kind == "agent":
            # Placeholder — real impl calls the agent registry
            return {"agent_response": f"Agent '{node.label}' processed context.", "node": node.label}
        elif kind == "action":
            return {"action": node.label, "status": "executed", "node": node.label}
        elif kind == "condition":
            condition = node.config.get("condition", "true")
            result    = bool(context)    # simplified evaluation
            return {"condition": condition, "result": result, "node": node.label}
        elif kind == "output":
            return {"output": node.label, "final": True, "context_keys": list(context.keys())}
        else:
            return {"node": node.label, "kind": kind, "status": "executed"}
