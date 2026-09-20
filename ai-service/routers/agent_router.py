"""FastAPI router for agent endpoints in the ai-service."""

from __future__ import annotations

import os
import sys
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any

# Add project root to path so agents/ package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

router = APIRouter(prefix="/agents", tags=["Agents"])


class AgentRunRequest(BaseModel):
    agent_type:  str
    task:        str
    context:     str       = ""
    data:        dict[str, Any] = Field(default_factory=dict)
    model:       str       = "gpt-4o"
    temperature: float     = 0.3


class AgentRunResponse(BaseModel):
    agent:       str
    task:        str
    answer:      str
    tokens_used: int
    success:     bool


@router.post("/run", response_model=AgentRunResponse, summary="Run a named agent")
def run_agent(req: AgentRunRequest) -> AgentRunResponse:
    """Run any registered NEXUS agent by type."""
    try:
        if req.agent_type == "analytics":
            from agents.analytics_agent.agent import AnalyticsAgent
            result = AnalyticsAgent(req.model, req.temperature).analyze(req.task, req.data or None)
        elif req.agent_type == "code":
            from agents.code_agent.agent import CodeAgent
            result = CodeAgent(req.model, req.temperature).generate(req.task)
        elif req.agent_type == "research":
            from agents.research_agent.agent import ResearchAgent
            result = ResearchAgent(req.model, req.temperature).research(req.task)
        elif req.agent_type == "summarizer":
            from agents.summarizer_agent.agent import SummarizerAgent
            result = SummarizerAgent(req.model).summarise(req.task)
        elif req.agent_type == "planner":
            from agents.planner_agent.agent import PlannerAgent
            result = PlannerAgent(req.model, req.temperature).plan(req.task, req.context)
        else:
            raise ValueError(f"Unknown agent type: {req.agent_type}")

        return AgentRunResponse(
            agent=req.agent_type,
            task=req.task,
            answer=str(result.get("answer") or result.get("research") or
                       result.get("summary") or result.get("code") or
                       result.get("reasoning") or ""),
            tokens_used=result.get("tokens_used", 0),
            success=True,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/types", summary="List all available agent types")
def list_agent_types() -> dict:
    return {
        "agents": [
            {"type": "analytics",       "description": "Data analysis and statistical insights"},
            {"type": "code",            "description": "Code generation, review, and debugging"},
            {"type": "research",        "description": "Deep research and synthesis"},
            {"type": "summarizer",      "description": "Multi-strategy text summarisation"},
            {"type": "planner",         "description": "Goal decomposition and task planning"},
            {"type": "reasoning",       "description": "Chain-of-Thought and ReAct reasoning"},
            {"type": "knowledge",       "description": "Knowledge base Q&A with citations"},
            {"type": "recommendation",  "description": "Semantic recommendation engine"},
            {"type": "critic",          "description": "Output quality review and scoring"},
            {"type": "validator",       "description": "Factual accuracy and safety validation"},
            {"type": "memory",          "description": "Short- and long-term memory management"},
            {"type": "search",          "description": "Hybrid semantic + keyword search"},
            {"type": "report",          "description": "Structured report generation"},
        ]
    }
