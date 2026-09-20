"""Schemas for Simulation module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class SimulationScenario(BaseModel):
    name:        str
    description: str
    initial_state: dict[str, Any] = Field(default_factory=dict)
    constraints:   list[str]      = Field(default_factory=list)


class SimulationRequest(BaseModel):
    scenario:    SimulationScenario
    agents:      list[dict[str, Any]]
    num_steps:   int  = 5
    model:       str  = "gpt-4o"
    temperature: float = 0.7


class SimulationEvent(BaseModel):
    step:        int
    agent_id:    str
    action:      str
    outcome:     str
    state_delta: dict[str, Any] = Field(default_factory=dict)


class SimulationResponse(BaseModel):
    scenario:    str
    events:      list[SimulationEvent]
    final_state: dict[str, Any]
    analysis:    str
    tokens_used: int
    model:       str


class WhatIfRequest(BaseModel):
    base_scenario:   SimulationScenario
    what_if_changes: dict[str, Any]
    model:           str = "gpt-4o"
