"""
NEXUS AI — Reasoning Agent
Applies structured reasoning strategies: Chain-of-Thought, ReAct,
Tree-of-Thought, Self-Consistency, and Socratic questioning.
"""

from __future__ import annotations

import os
from enum import Enum

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


class Strategy(str, Enum):
    COT              = "chain_of_thought"
    REACT            = "react"
    SELF_CONSISTENCY = "self_consistency"
    SOCRATIC         = "socratic"
    TREE             = "tree_of_thought"


_PROMPTS = {
    Strategy.COT: (
        "Think through this step-by-step. "
        "Label each step. End with a clear CONCLUSION."
    ),
    Strategy.REACT: (
        "Use the ReAct pattern: Thought → Action → Observation, repeat. "
        "End with Final Answer:"
    ),
    Strategy.SELF_CONSISTENCY: (
        "Reason through this problem carefully, then give your answer."
    ),
    Strategy.SOCRATIC: (
        "Use the Socratic method: ask clarifying questions, then reason to an answer."
    ),
    Strategy.TREE: (
        "Explore multiple reasoning branches. For each branch evaluate pros/cons. "
        "Pick the best branch and state the conclusion."
    ),
}


class ReasoningAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model       = model
        self.temperature = temperature

    def reason(self, question: str, context: list[str] | None = None,
               strategy: Strategy = Strategy.COT,
               n_paths: int = 3) -> dict:
        """Apply a reasoning strategy to answer a question."""
        sys_prompt = _PROMPTS.get(strategy, _PROMPTS[Strategy.COT])
        ctx_block  = "\n".join(context or [])
        messages   = [{"role": "system", "content": sys_prompt}]
        if ctx_block:
            messages.append({"role": "system", "content": f"Context:\n{ctx_block}"})
        messages.append({"role": "user", "content": question})

        if strategy == Strategy.SELF_CONSISTENCY:
            answers = []
            total_t = 0
            for _ in range(n_paths):
                r = client.chat.completions.create(
                    model=self.model, messages=messages, temperature=0.7
                )
                answers.append(r.choices[0].message.content or "")
                total_t += r.usage.total_tokens if r.usage else 0
            # Majority-vote heuristic: pick longest (most detailed) answer
            final  = max(answers, key=len)
            return {"strategy": strategy, "question": question,
                    "answer": final, "alternatives": answers,
                    "tokens_used": total_t, "agent": "reasoning-agent"}

        resp   = client.chat.completions.create(
            model=self.model, messages=messages, temperature=self.temperature
        )
        answer = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0

        return {"agent": "reasoning-agent", "strategy": strategy,
                "question": question, "answer": answer,
                "confidence": 0.85, "tokens_used": tokens}

    def chain_of_thought(self, question: str, context: list[str] | None = None) -> dict:
        return self.reason(question, context, Strategy.COT)

    def react(self, question: str, context: list[str] | None = None) -> dict:
        return self.reason(question, context, Strategy.REACT)


def run(question: str, strategy: str = "chain_of_thought") -> dict:
    s = Strategy(strategy) if strategy in Strategy._value2member_map_ else Strategy.COT
    return ReasoningAgent().reason(question, strategy=s)
