"""Schemas for Agent orchestration module."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class AgentRole(str, Enum):
    ORCHESTRATOR  = "orchestrator"
    ANALYST       = "analyst"
    RESEARCHER    = "researcher"
    CODER         = "coder"
    CRITIC        = "critic"
    SUMMARIZER    = "summarizer"
    PLANNER       = "planner"


class AgentTool(BaseModel):
    name:        str
    description: str
    parameters:  dict[str, Any] = Field(default_factory=dict)


class AgentConfig(BaseModel):
    agent_id:    str = ""
    name:        str
    role:        AgentRole = AgentRole.ANALYST
    model:       str       = "gpt-4o"
    temperature: float     = 0.3
    max_steps:   int       = 10
    tools:       list[AgentTool] = Field(default_factory=list)
    system_prompt: str     = ""


class AgentMessage(BaseModel):
    role:    str          # "user" | "assistant" | "system" | "tool"
    content: str
    tool_calls: list[dict[str, Any]] | None = None
    tool_call_id: str | None = None


class AgentRunRequest(BaseModel):
    task:        str
    agent:       AgentConfig
    history:     list[AgentMessage] = Field(default_factory=list)
    context_docs: list[str]         = Field(default_factory=list)
    max_tokens:  int = 4096


class AgentStep(BaseModel):
    step:        int
    thought:     str
    action:      str
    observation: str
    tool_used:   str | None = None


class AgentRunResponse(BaseModel):
    agent_id:   str
    task:       str
    answer:     str
    steps:      list[AgentStep]
    tokens_used: int
    model:      str
    success:    bool


class MultiAgentRequest(BaseModel):
    task:    str
    agents:  list[AgentConfig]
    strategy: str = "sequential"   # "sequential" | "parallel" | "hierarchical"
    context_docs: list[str] = Field(default_factory=list)


class MultiAgentResponse(BaseModel):
    task:        str
    results:     list[AgentRunResponse]
    final_answer: str
    total_tokens: int
