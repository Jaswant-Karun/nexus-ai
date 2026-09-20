"""Schemas for Workflow Generator module."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class NodeKind(str, Enum):
    TRIGGER   = "trigger"
    AGENT     = "agent"
    ACTION    = "action"
    CONDITION = "condition"
    OUTPUT    = "output"
    TRANSFORM = "transform"
    API_CALL  = "api_call"


class WorkflowNode(BaseModel):
    id:          str
    kind:        NodeKind
    label:       str
    description: str = ""
    config:      dict[str, Any] = Field(default_factory=dict)
    position:    dict[str, int] = Field(default_factory=lambda: {"x": 0, "y": 0})


class WorkflowEdge(BaseModel):
    id:     str
    source: str
    target: str
    label:  str = ""
    condition: str = ""


class WorkflowGenerateRequest(BaseModel):
    goal:        str
    context:     str = ""
    constraints: list[str] = Field(default_factory=list)
    available_agents: list[str] = Field(default_factory=list)
    available_tools:  list[str] = Field(default_factory=list)
    max_nodes:   int  = 10
    model:       str  = "gpt-4o"


class GeneratedWorkflow(BaseModel):
    name:        str
    description: str
    nodes:       list[WorkflowNode]
    edges:       list[WorkflowEdge]
    reasoning:   str
    estimated_duration: str


class WorkflowGenerateResponse(BaseModel):
    workflow:    GeneratedWorkflow
    model:       str
    tokens_used: int


class WorkflowOptimizeRequest(BaseModel):
    workflow:    GeneratedWorkflow
    optimization_goal: str = "speed"    # "speed" | "cost" | "accuracy"
    model:       str = "gpt-4o"
