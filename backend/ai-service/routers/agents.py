"""Router — Agent orchestration endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.agent import (
    AgentConfig, AgentRunRequest, AgentRunResponse,
    MultiAgentRequest, MultiAgentResponse,
)
from agents.specialist_agents import create_agent
from agents.multi_agent import orchestrator

router = APIRouter(prefix="/agents", tags=["Agents"])


@router.post("/run", response_model=AgentRunResponse, summary="Run a single AI agent")
def run_agent(request: AgentRunRequest) -> AgentRunResponse:
    """
    Execute a single specialised agent on a task.
    Supports roles: analyst, researcher, coder, critic, summarizer, orchestrator.
    Uses real OpenAI / Anthropic API calls.
    """
    try:
        agent = create_agent(request.agent)
        return agent.run(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/multi-run", response_model=MultiAgentResponse,
             summary="Run multiple agents (sequential / parallel / hierarchical)")
def run_multi_agent(request: MultiAgentRequest) -> MultiAgentResponse:
    """
    Orchestrate multiple agents on a shared task.
    - sequential: each agent's output feeds into the next
    - parallel:   all agents run concurrently, outputs synthesised
    - hierarchical: orchestrator delegates to workers, then synthesises
    """
    try:
        return orchestrator.run(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/roles", summary="List available agent roles and their descriptions")
def list_roles() -> dict:
    return {
        "roles": [
            {"role": "analyst",      "description": "Data analysis, statistics, and insights"},
            {"role": "researcher",   "description": "Document search and synthesis"},
            {"role": "coder",        "description": "Code writing, review, and debugging"},
            {"role": "critic",       "description": "Quality review and improvement suggestions"},
            {"role": "summarizer",   "description": "Concise summarisation of content"},
            {"role": "orchestrator", "description": "Task delegation and multi-agent coordination"},
            {"role": "planner",      "description": "Goal decomposition into executable subtasks"},
        ]
    }
