"""
Router — Agent orchestration endpoints.
Wires the FastAPI service to the real Python agents in /agents/.
Each agent uses Gemini 2.5 Flash (primary) with OpenAI/Anthropic fallback.
"""

from __future__ import annotations

import importlib.util
import os
import sys
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/agents", tags=["Agents"])

# ── Resolve the agents/ directory ────────────────────────────────────────────
# backend/ai-service/routers/ → up 3 levels → project root → agents/
_PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
_AGENTS_DIR   = _PROJECT_ROOT / "agents"

sys.path.insert(0, str(_AGENTS_DIR))   # so `from shared.llm_client import ...` works


def _load_agent(agent_name: str):
    """Dynamically load an agent module from agents/<agent_name>/agent.py"""
    agent_path = _AGENTS_DIR / agent_name / "agent.py"
    if not agent_path.exists():
        raise ImportError(f"Agent not found: {agent_path}")
    module_name = agent_name.replace("-", "_")
    spec   = importlib.util.spec_from_file_location(module_name, str(agent_path))
    module = importlib.util.module_from_spec(spec)           # type: ignore[arg-type]
    spec.loader.exec_module(module)                           # type: ignore[union-attr]
    return module


# ── Schemas ───────────────────────────────────────────────────────────────────
class AgentRunRequest(BaseModel):
    agent_type:   str   = "analytics"
    task:         str
    context:      str   = ""
    documents:    list[str]      = Field(default_factory=list)
    data:         dict[str, Any] = Field(default_factory=dict)
    model:        str   = "gpt-4o"        # mapped to Gemini internally
    temperature:  float = 0.4
    strategy:     str   = "chain_of_thought"
    top_k:        int   = 5
    max_steps:    int   = 8


class AgentRunResponse(BaseModel):
    agent:        str
    agent_type:   str
    task:         str
    answer:       str
    extra:        dict[str, Any] = Field(default_factory=dict)
    tokens_used:  int
    model_used:   str
    success:      bool


# ── Agent type → folder name mapping ─────────────────────────────────────────
_AGENT_MAP: dict[str, str] = {
    "analytics":      "analytics-agent",
    "code":           "code-agent",
    "critic":         "critic-agent",
    "knowledge":      "knowledge-agent",
    "memory":         "memory-agent",
    "planner":        "planner-agent",
    "reasoning":      "reasoning-agent",
    "recommendation": "recommendation-agent",
    "report":         "report-agent",
    "research":       "research-agent",
    "search":         "search-agent",
    "summarizer":     "summarizer-agent",
    "validator":      "validator-agent",
}


# ── Endpoint ──────────────────────────────────────────────────────────────────
@router.post("/run", response_model=AgentRunResponse,
             summary="Run a NEXUS AI agent by type")
def run_agent(req: AgentRunRequest) -> AgentRunResponse:
    """
    Run any of the 13 NEXUS AI agents.

    Agent types:
    - **analytics**      — data insights, KPI analysis, SQL generation
    - **code**           — code generation, review, debug, refactor
    - **critic**         — quality scoring (accuracy/clarity/safety 1-10)
    - **knowledge**      — RAG Q&A with citations from documents
    - **memory**         — store/recall short & long-term memories
    - **planner**        — decompose goals into ordered subtasks
    - **reasoning**      — Chain-of-Thought, ReAct, Self-Consistency
    - **recommendation** — semantic embedding-based item ranking
    - **report**         — structured business report generation
    - **research**       — deep research synthesis with follow-ups
    - **search**         — hybrid BM25 + semantic document search
    - **summarizer**     — stuff / map-reduce / refine summarisation
    - **validator**      — factual validation, JSON schema, safety check

    All agents use **Gemini 2.5 Flash** (primary) with automatic
    fallback to Anthropic / OpenAI when credits are available.
    """
    agent_folder = _AGENT_MAP.get(req.agent_type)
    if not agent_folder:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown agent type '{req.agent_type}'. "
                   f"Valid: {sorted(_AGENT_MAP.keys())}"
        )

    try:
        mod = _load_agent(agent_folder)
    except ImportError as exc:
        raise HTTPException(status_code=500,
                            detail=f"Failed to load agent: {exc}") from exc

    try:
        # ── Call the appropriate agent method based on type ──────────────────
        if req.agent_type == "analytics":
            result = mod.run(req.task, req.data or None)

        elif req.agent_type == "code":
            lang = req.data.get("language", "python")
            result = mod.run(req.task, str(lang))

        elif req.agent_type == "critic":
            result = mod.run(req.task, req.context)

        elif req.agent_type == "knowledge":
            docs = req.documents or (list(req.data.values()) if req.data else [])
            result = mod.run(req.task, docs)

        elif req.agent_type == "memory":
            # Memory agent: store if context given, else recall
            ma = mod.MemoryAgent()
            if req.context:
                mem_id = ma.store(req.context, importance=0.7)
                result = {"answer": f"Stored memory: '{req.context}' (id: {mem_id})",
                          "tokens_used": 0}
            else:
                recalled = ma.recall(req.task, top_k=5)
                answer   = "\n".join(f"- [{r['type']}] {r['content']}" for r in recalled) or "No memories found."
                result   = {"answer": answer, "memories": recalled, "tokens_used": 0}

        elif req.agent_type == "planner":
            result = mod.run(req.task, req.context, max_steps=req.max_steps)

        elif req.agent_type == "reasoning":
            ctx    = [req.context] if req.context else []
            result = mod.run(req.task, strategy=req.strategy)

        elif req.agent_type == "recommendation":
            items = req.documents or list(req.data.keys())
            result = mod.run(req.task, items, top_k=req.top_k)

        elif req.agent_type == "report":
            result = mod.run(req.task, req.data or req.context)

        elif req.agent_type == "research":
            srcs = [{"content": d, "title": f"Source {i+1}"}
                    for i, d in enumerate(req.documents)] if req.documents else None
            result = mod.run(req.task, srcs, depth=req.data.get("depth", "standard"))

        elif req.agent_type == "search":
            docs = req.documents or []
            result = mod.run(req.task, docs, top_k=req.top_k)

        elif req.agent_type == "summarizer":
            result = mod.run(req.task, max_words=int(req.data.get("max_words", 200)))

        elif req.agent_type == "validator":
            result = mod.run(req.task, req.context)

        else:
            raise HTTPException(status_code=400, detail=f"No handler for '{req.agent_type}'")

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    # ── Normalise response ────────────────────────────────────────────────────
    answer = ""
    for key in ("answer", "summary", "research", "review", "code",
                "comparison", "feedback", "content"):
        val = result.get(key, "")
        if val:
            answer = str(val)
            break

    # For planner — show subtasks as readable text
    if req.agent_type == "planner" and not answer:
        subtasks = result.get("subtasks", [])
        if subtasks:
            lines = [f"{i+1}. [{t.get('agent_role','?').upper()}] {t.get('title','')} — {t.get('description','')}"
                     for i, t in enumerate(subtasks)]
            answer = "Execution Plan:\n" + "\n".join(lines)

    # For recommendations — format as readable list
    if req.agent_type == "recommendation":
        recs = result.get("recommendations", [])
        if recs:
            answer = "\n".join(f"{r['rank']}. {r['text']} (score: {r['score']:.3f})" for r in recs)

    # Determine which model was actually used
    from shared.llm_client import provider_info
    pinfo      = provider_info()
    model_used = pinfo["active_model"]

    return AgentRunResponse(
        agent=agent_folder,
        agent_type=req.agent_type,
        task=req.task,
        answer=answer,
        extra={k: v for k, v in result.items()
               if k not in ("answer","summary","research","review","code","comparison","feedback","content")},
        tokens_used=result.get("tokens_used", 0),
        model_used=model_used,
        success=bool(answer),
    )


@router.get("/list", summary="List all available agents with descriptions")
def list_agents() -> dict:
    from shared.llm_client import provider_info
    pinfo = provider_info()
    return {
        "active_provider": pinfo["active_provider"],
        "active_model":    pinfo["active_model"],
        "agents": [
            {
                "type":        "analytics",
                "name":        "Data Analyst Agent",
                "description": "Analyses data, generates statistical insights, detects anomalies, writes SQL queries",
                "icon":        "📊",
                "use_in":      ["/chat", "/analytics"],
                "example_task": "What are the top 3 insights from: Revenue +28%, Churn 5%, NPS 72?",
            },
            {
                "type":        "code",
                "name":        "Code Assistant Agent",
                "description": "Generates, reviews, debugs, and refactors code in Python, TypeScript, SQL, Go",
                "icon":        "💻",
                "use_in":      ["/chat"],
                "example_task": "Write a Python function to parse JSON and handle errors gracefully",
            },
            {
                "type":        "critic",
                "name":        "Code Reviewer Agent",
                "description": "Scores content 1-10 on accuracy, completeness, clarity, safety, actionability",
                "icon":        "🔎",
                "use_in":      ["/chat"],
                "example_task": "Review this API design and rate it",
            },
            {
                "type":        "knowledge",
                "name":        "Knowledge Agent",
                "description": "Answers questions grounded strictly in provided documents with inline citations",
                "icon":        "📚",
                "use_in":      ["/workspace", "/chat"],
                "example_task": "What does this document say about authentication?",
            },
            {
                "type":        "memory",
                "name":        "Memory Agent",
                "description": "Stores and recalls short-term and long-term memories for multi-turn sessions",
                "icon":        "🧠",
                "use_in":      ["/chat"],
                "example_task": "Remember that the user prefers Python over TypeScript",
            },
            {
                "type":        "planner",
                "name":        "Task Planner Agent",
                "description": "Decomposes complex goals into ordered subtasks with dependencies and agent roles",
                "icon":        "📋",
                "use_in":      ["/workflow", "/chat"],
                "example_task": "Plan how to build a customer support chatbot with RAG",
            },
            {
                "type":        "reasoning",
                "name":        "Reasoning Agent",
                "description": "Applies Chain-of-Thought, ReAct, or Self-Consistency reasoning to answer questions",
                "icon":        "🤔",
                "use_in":      ["/chat", "/storage/ai"],
                "example_task": "Should we use monolith or microservices for a startup?",
            },
            {
                "type":        "recommendation",
                "name":        "Recommendation Agent",
                "description": "Ranks items by semantic similarity to a query using embedding-based scoring",
                "icon":        "⭐",
                "use_in":      ["/chat"],
                "example_task": "Recommend the most relevant feature for an AI platform user",
            },
            {
                "type":        "report",
                "name":        "Report Generator Agent",
                "description": "Creates structured business reports with Executive Summary, Analysis, and Recommendations",
                "icon":        "📄",
                "use_in":      ["/chat", "/analytics"],
                "example_task": "Write a Q3 performance report from this data",
            },
            {
                "type":        "research",
                "name":        "Research Agent",
                "description": "Deep research synthesis from multiple sources with follow-up questions and citations",
                "icon":        "🔍",
                "use_in":      ["/chat", "/workspace"],
                "example_task": "Research the latest trends in LLM fine-tuning",
            },
            {
                "type":        "search",
                "name":        "Smart Search Agent",
                "description": "Hybrid BM25 + semantic search over documents with synthesised answers",
                "icon":        "🔎",
                "use_in":      ["/storage/search", "/workspace"],
                "example_task": "Find all mentions of RAG in these documents",
            },
            {
                "type":        "summarizer",
                "name":        "Summarizer Agent",
                "description": "Summarises text using stuff, map-reduce, or refine strategies with keyword extraction",
                "icon":        "✍️",
                "use_in":      ["/workspace", "/storage/ai", "/chat"],
                "example_task": "Summarise this 50-page document in 200 words",
            },
            {
                "type":        "validator",
                "name":        "Validator Agent",
                "description": "Validates content for factual accuracy, hallucinations, safety, and schema compliance",
                "icon":        "✅",
                "use_in":      ["/chat"],
                "example_task": "Check if this product description is accurate and safe",
            },
        ],
    }


@router.get("/roles", summary="Legacy — same as /list")
def list_roles() -> dict:
    return list_agents()
