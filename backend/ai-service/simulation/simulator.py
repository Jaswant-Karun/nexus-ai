"""Agent behaviour simulation — multi-step environment simulation with GPT-4o."""

from __future__ import annotations

import json
import os
import uuid

from openai import OpenAI

from schemas.simulation import (
    SimulationEvent, SimulationRequest, SimulationResponse, WhatIfRequest,
)

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

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

    resp   = _client.chat.completions.create(
        model=req.model,
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user",   "content": user_msg},
        ],
        temperature=req.temperature,
        response_format={"type": "json_object"},
    )
    tokens = resp.usage.total_tokens if resp.usage else 0
    data   = json.loads(resp.choices[0].message.content or "{}")

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
