"""Schemas for Planner module."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class TaskPriority(str, Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"
    CRITICAL = "critical"


class TaskStatus(str, Enum):
    PENDING    = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED  = "completed"
    FAILED     = "failed"
    BLOCKED    = "blocked"


class SubTask(BaseModel):
    id:          str
    title:       str
    description: str
    priority:    TaskPriority = TaskPriority.MEDIUM
    depends_on:  list[str]   = Field(default_factory=list)
    agent_role:  str          = "analyst"
    estimated_tokens: int    = 500
    tools_required:   list[str] = Field(default_factory=list)


class PlanRequest(BaseModel):
    goal:         str
    context:      str  = ""
    constraints:  list[str] = Field(default_factory=list)
    available_tools: list[str] = Field(default_factory=list)
    max_subtasks: int = 10
    model:        str = "gpt-4o"


class ExecutionPlan(BaseModel):
    plan_id:     str
    goal:        str
    subtasks:    list[SubTask]
    execution_order: list[str]     # ordered subtask IDs
    estimated_total_tokens: int
    strategy:    str
    reasoning:   str


class PlanResponse(BaseModel):
    plan:        ExecutionPlan
    model:       str
    tokens_used: int


class StepExecutionRequest(BaseModel):
    plan_id:   str
    subtask_id: str
    results_so_far: dict[str, Any] = Field(default_factory=dict)
