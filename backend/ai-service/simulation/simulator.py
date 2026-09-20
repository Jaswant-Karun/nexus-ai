"""Agent behaviour simulation — multi-step environment simulation with GPT-4o."""

from __future__ import annotations

import json
import os
import uuid

from openai import OpenAI

from schemas.simulation import (
    SimulationEvent, SimulationRequest, SimulationResponse, WhatIfRequest,
)

def _get_client() -> OpenAI:
    from config import settings
    return OpenAI(api_key=settings.openai_api_key or os.getenv("OPENAI_API_KEY", ""))

_SYSTEM = """You are a simulation engine for NEXUS AI.
Simulate a multi-agent scenario step by step.
Return JSON: {
  "events": [
    {"step": 1, "agent_id": "...", "action": "...", "outcome": "...",
     "state_delta": {"key": "value"}}
  ],
  "final_state": {"key": "value"},
  "analysis": "summary of what happened and key insights"
}"""


def simulate(req: SimulationRequest) -> SimulationResponse:
    agent_desc = "\n".join(
        f"- Agent '{a.get('name', f'agent_{i}')}': {a.get('role', 'general')} agent"
        for i, a in enumerate(req.agents)
    )
    user_msg = (
        f"Scenario: {req.scenario.name}\n"
        f"Description: {req.scenario.description}\n"
        f"Initial state: {json.dumps(req.scenario.initial_state)}\n"
        f"Constraints: {', '.join(req.scenario.constraints) or 'None'}\n"
        f"Agents:\n{agent_desc}\n"
        f"Simulate {req.num_steps} steps."
    )

    try:
        resp   = _get_client().chat.completions.create(
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
                "events": [
                    {"step": 1, "agent_id": "a1", "action": "Initialize simulation", "outcome": "Success", "state_delta": {"status": "started"}},
                    {"step": 2, "agent_id": "a2", "action": "Process scenario steps", "outcome": "Success (Offline mode)", "state_delta": {"status": "completed"}}
                ],
                "final_state": {"status": "completed", "mode": "fallback"},
                "analysis": f"Simulation of scenario '{req.scenario.name}' completed in fallback mode."
            })
            raise exc
    data   = json.loads(raw)

    events = [
        SimulationEvent(
            step=e["step"], agent_id=e.get("agent_id", "unknown"),
            action=e.get("action", ""), outcome=e.get("outcome", ""),
            state_delta=e.get("state_delta", {}),
        )
        for e in data.get("events", [])
    ]

    return SimulationResponse(
        scenario=req.scenario.name,
        events=events,
        final_state=data.get("final_state", {}),
        analysis=data.get("analysis", ""),
        tokens_used=tokens,
        model=req.model,
    )


def what_if(req: WhatIfRequest) -> SimulationResponse:
    modified = req.base_scenario.model_copy(deep=True)
    modified.initial_state.update(req.what_if_changes)
    modified.name = f"{req.base_scenario.name} [What-If]"
    sim_req = SimulationRequest(
        scenario=modified, agents=[], num_steps=5, model=req.model
    )
    return simulate(sim_req)
