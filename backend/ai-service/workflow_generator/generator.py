"""Automated workflow DAG generation using GPT-4o + structured output."""

from __future__ import annotations

import json
import os
import uuid

from openai import OpenAI

from schemas.workflow import (
    GeneratedWorkflow, NodeKind, WorkflowEdge, WorkflowGenerateRequest,
    WorkflowGenerateResponse, WorkflowNode, WorkflowOptimizeRequest,
)

def _get_client() -> OpenAI:
    from config import settings
    return OpenAI(api_key=settings.openai_api_key or os.getenv("OPENAI_API_KEY", ""))

_SYSTEM = """You are a workflow architect for NEXUS AI platform.
Design optimal multi-agent workflow DAGs.

Return ONLY valid JSON:
{
  "name": "Workflow name",
  "description": "What it does",
  "reasoning": "Why this structure",
  "estimated_duration": "e.g. 5-10 minutes",
  "nodes": [
    {
      "id": "n1",
      "kind": "trigger|agent|action|condition|output|transform|api_call",
      "label": "Short label",
      "description": "What this node does",
      "config": {"key": "value"},
      "position": {"x": 0, "y": 0}
    }
  ],
  "edges": [
    {"id": "e1", "source": "n1", "target": "n2", "label": "", "condition": ""}
  ]
}"""


def generate_workflow(req: WorkflowGenerateRequest) -> WorkflowGenerateResponse:
    agents_info = (
        f"Available agents: {', '.join(req.available_agents)}"
        if req.available_agents else "Use any appropriate agent types."
    )
    tools_info = (
        f"Available tools: {', '.join(req.available_tools)}"
        if req.available_tools else ""
    )
    constraints = (
        "\nConstraints:\n" + "\n".join(f"- {c}" for c in req.constraints)
        if req.constraints else ""
    )

    user_msg = (
        f"Goal: {req.goal}\n"
        f"Context: {req.context or 'General enterprise workflow'}\n"
        f"{agents_info}\n{tools_info}{constraints}\n"
        f"Max nodes: {req.max_nodes}"
    )

    try:
        resp = _get_client().chat.completions.create(
            model=req.model,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw    = resp.choices[0].message.content or "{}"
        tokens = resp.usage.total_tokens if resp.usage else 0
    except Exception as exc:
        err_str = str(exc)
        if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str or "invalid_api_key" in err_str:
            raw = json.dumps({
                "name": f"Workflow for {req.goal[:20]}...",
                "description": f"Automated pipeline for '{req.goal}' [Offline/fallback mode]",
                "reasoning": "Standard 3-stage trigger-process-output architecture",
                "estimated_duration": "2-5 minutes",
                "nodes": [
                    {
                        "id": "n1",
                        "kind": "trigger",
                        "label": "Input Event",
                        "description": "Trigger on user request or web hook",
                        "config": {"source": "api"},
                        "position": {"x": 100, "y": 200}
                    },
                    {
                        "id": "n2",
                        "kind": "agent",
                        "label": "AI Processing Agent",
                        "description": "Executes core task processing",
                        "config": {"role": "analyst"},
                        "position": {"x": 350, "y": 200}
                    },
                    {
                        "id": "n3",
                        "kind": "output",
                        "label": "Results Output",
                        "description": "Formats and dispatches response",
                        "config": {"destination": "ui"},
                        "position": {"x": 600, "y": 200}
                    }
                ],
                "edges": [
                    {"id": "e1", "source": "n1", "target": "n2", "label": "Start", "condition": ""},
                    {"id": "e2", "source": "n2", "target": "n3", "label": "Complete", "condition": ""}
                ]
            })
        else:
            raise exc
    data   = json.loads(raw)

    nodes = [
        WorkflowNode(
            id=n["id"],
            kind=NodeKind(n.get("kind", "action")),
            label=n.get("label", ""),
            description=n.get("description", ""),
            config=n.get("config", {}),
            position=n.get("position", {"x": i * 150, "y": 0}),
        )
        for i, n in enumerate(data.get("nodes", []))
    ]
    edges = [
        WorkflowEdge(
            id=e.get("id", f"e{i}"),
            source=e["source"], target=e["target"],
            label=e.get("label", ""), condition=e.get("condition", ""),
        )
        for i, e in enumerate(data.get("edges", []))
    ]

    workflow = GeneratedWorkflow(
        name=data.get("name", f"Workflow_{uuid.uuid4().hex[:6]}"),
        description=data.get("description", ""),
        nodes=nodes, edges=edges,
        reasoning=data.get("reasoning", ""),
        estimated_duration=data.get("estimated_duration", "Unknown"),
    )
    return WorkflowGenerateResponse(workflow=workflow, model=req.model,
                                    tokens_used=tokens)


def optimize_workflow(req: WorkflowOptimizeRequest) -> WorkflowGenerateResponse:
    """Ask LLM to restructure an existing workflow for a given goal."""
    wf_summary = (
        f"Name: {req.workflow.name}\n"
        f"Nodes: {[n.label for n in req.workflow.nodes]}\n"
        f"Edges: {[(e.source, e.target) for e in req.workflow.edges]}"
    )
    opt_req = WorkflowGenerateRequest(
        goal=f"Optimise this workflow for {req.optimization_goal}:\n{wf_summary}",
        constraints=[f"Optimise for {req.optimization_goal}"],
        max_nodes=max(len(req.workflow.nodes), 3),
        model=req.model,
    )
    return generate_workflow(opt_req)
