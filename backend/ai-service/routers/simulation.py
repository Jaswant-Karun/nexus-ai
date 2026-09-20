"""Router — Agent behaviour simulation endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.simulation import (
    SimulationRequest, SimulationResponse, WhatIfRequest,
)
from simulation.simulator import simulate, what_if

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/run", response_model=SimulationResponse,
             summary="Simulate a multi-agent scenario step by step")
def run_simulation(request: SimulationRequest) -> SimulationResponse:
    """
    Runs a configurable multi-step agent scenario simulation using GPT-4o.
    Returns:
    - Timeline of events (agent, action, outcome, state delta)
    - Final environment state
    - Analysis and insights
    """
    try:
        return simulate(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/what-if", response_model=SimulationResponse,
             summary="Run a what-if analysis on a modified scenario")
def run_what_if(request: WhatIfRequest) -> SimulationResponse:
    """
    Takes a base scenario, applies what-if changes to the initial state,
    and runs the simulation to see how outcomes differ.
    """
    try:
        return what_if(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
