"""
NEXUS AI Service — Scenario Runner
Runs multi-agent simulations, what-if analyses, and stress tests.
"""

from __future__ import annotations

import json
import os
import time
from typing import Any

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM = """You are a simulation engine. Simulate a multi-agent scenario step-by-step.
Return JSON: {
  "events": [{"step": 1, "agent": "...", "action": "...", "outcome": "...", "state_delta": {}}],
  "final_state": {},
  "analysis": "summary of simulation"
}"""


class ScenarioRunner:
    """Run simulations and what-if analyses using GPT-4o."""

    def __init__(self, model: str = "gpt-4o"):
        self.model = model

    def run(self, scenario_name: str, description: str,
            agents: list[dict], initial_state: dict,
            num_steps: int = 5, constraints: list[str] | None = None) -> dict:
        """Run a simulation scenario."""
        agent_desc = "\n".join(
            f"- {a.get('name', f'agent_{i}')}: {a.get('role', 'general')}"
            for i, a in enumerate(agents)
        )
        constraint_txt = "\n".join(f"- {c}" for c in (constraints or []))

        user_msg = (
            f"Scenario: {scenario_name}\n"
            f"Description: {description}\n"
            f"Initial state: {json.dumps(initial_state)}\n"
            f"Agents:\n{agent_desc}\n"
            f"Constraints:\n{constraint_txt or 'None'}\n"
            f"Simulate {num_steps} steps."
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": SYSTEM},
                      {"role": "user",   "content": user_msg}],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        data   = json.loads(resp.choices[0].message.content or "{}")
        tokens = resp.usage.total_tokens if resp.usage else 0

        return {
            "scenario":    scenario_name,
            "events":      data.get("events", []),
            "final_state": data.get("final_state", {}),
            "analysis":    data.get("analysis", ""),
            "tokens_used": tokens,
            "model":       self.model,
            "ran_at":      time.time(),
        }

    def what_if(self, base_scenario: dict, changes: dict[str, Any]) -> dict:
        """Run a what-if analysis by modifying the initial state."""
        modified_state = {**base_scenario.get("initial_state", {}), **changes}
        return self.run(
            scenario_name=base_scenario.get("name", "What-If") + " [Modified]",
            description=base_scenario.get("description", ""),
            agents=base_scenario.get("agents", []),
            initial_state=modified_state,
        )
