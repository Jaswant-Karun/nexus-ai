"""Chain-of-Thought, Tree-of-Thought, and ReAct reasoning engine."""

from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from schemas.reasoning import (
    ReasoningRequest, ReasoningResponse, ReasoningStep, ReasoningStrategy,
)

def _get_client() -> OpenAI:
    from config import settings
    return OpenAI(api_key=settings.openai_api_key or os.getenv("OPENAI_API_KEY", ""))


def _cot(req: ReasoningRequest) -> tuple[list[ReasoningStep], str, int]:
    """Standard chain-of-thought."""
    ctx = "\n".join(req.context) if req.context else ""
    sys = (
        "Think through this problem step by step. "
        "Label each step clearly: Step 1, Step 2, etc. "
        "End with a clear CONCLUSION."
    )
    msgs: list[dict] = [{"role": "system", "content": sys}]
    if ctx:
        msgs.append({"role": "system", "content": f"Context:\n{ctx}"})
    msgs.append({"role": "user", "content": req.question})

    try:
        resp   = _get_client().chat.completions.create(
            model=req.model, messages=msgs, temperature=req.temperature)
        raw    = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0
    except Exception as exc:
        err_str = str(exc)
        if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str or "invalid_api_key" in err_str:
            raw = (
                f"Step 1: Analyzed question '{req.question}'.\n"
                f"Step 2: Note: OpenAI API key quota is limited/exhausted.\n"
                f"CONCLUSION: Fallback reasoning step complete for '{req.question}'."
            )
            tokens = 0
        else:
            raise exc

    steps: list[ReasoningStep] = []
    lines  = raw.split("\n")
    buffer = ""
    step_n = 0
    for line in lines:
        if line.lower().startswith("step ") or line.lower().startswith("conclusion"):
            if buffer and step_n > 0:
                steps.append(ReasoningStep(step_number=step_n, type="thought",
                                           content=buffer.strip()))
            step_n += 1
            buffer  = line
        else:
            buffer += " " + line

    if buffer:
        stype = "conclusion" if "conclusion" in buffer.lower() else "thought"
        steps.append(ReasoningStep(step_number=step_n or 1, type=stype,
                                   content=buffer.strip()))

    final = next((s.content for s in reversed(steps)
                  if s.type == "conclusion"), raw.strip()[-400:])
    return steps, final, tokens


def _react(req: ReasoningRequest) -> tuple[list[ReasoningStep], str, int]:
    """ReAct: Thought → Action → Observation loops."""
    system = (
        "You follow the ReAct pattern strictly:\n"
        "Thought: <reasoning>\nAction: <what to look up or do>\nObservation: <result>\n"
        "...repeat up to 5 times...\nFinal Answer: <answer>"
    )
    ctx = "\n".join(req.context) if req.context else "No additional context."
    try:
        resp = _get_client().chat.completions.create(
            model=req.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "system", "content": f"Context:\n{ctx}"},
                {"role": "user",   "content": req.question},
            ],
            temperature=req.temperature,
        )
        raw    = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0
    except Exception as exc:
        err_str = str(exc)
        if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str or "invalid_api_key" in err_str:
            raw = (
                f"Thought: Process question '{req.question}'\n"
                f"Action: Lookup context\n"
                f"Observation: OpenAI quota/key limited\n"
                f"Final Answer: Fallback ReAct answer for '{req.question}'"
            )
            tokens = 0
        else:
            raise exc

    steps: list[ReasoningStep] = []
    i, n = 0, 0
    for line in raw.split("\n"):
        line = line.strip()
        if not line:
            continue
        n += 1
        if line.startswith("Thought:"):
            steps.append(ReasoningStep(step_number=n, type="thought",
                                       content=line[8:].strip()))
        elif line.startswith("Action:"):
            steps.append(ReasoningStep(step_number=n, type="action",
                                       content=line[7:].strip()))
        elif line.startswith("Observation:"):
            steps.append(ReasoningStep(step_number=n, type="observation",
                                       content=line[12:].strip()))
        elif line.startswith("Final Answer:"):
            steps.append(ReasoningStep(step_number=n, type="conclusion",
                                       content=line[13:].strip()))

    final = next((s.content for s in reversed(steps)
                  if s.type == "conclusion"), raw[-400:])
    return steps, final, tokens


def _self_consistency(req: ReasoningRequest) -> tuple[list[ReasoningStep], str, int, list[str]]:
    """Run N CoT passes, pick majority answer."""
    all_finals: list[str] = []
    all_steps:  list[ReasoningStep] = []
    total_tokens = 0

    for run in range(req.num_paths):
        steps, final, tokens = _cot(req)
        all_steps.extend(steps)
        all_finals.append(final)
        total_tokens += tokens

    # pick the most common final answer (by substring overlap)
    from collections import Counter
    words = [f.split()[-1] if f.split() else "" for f in all_finals]
    majority = Counter(words).most_common(1)[0][0]
    best = next((f for f in all_finals if majority in f), all_finals[-1])
    return all_steps, best, total_tokens, all_finals


def reason(req: ReasoningRequest) -> ReasoningResponse:
    alternatives: list[str] = []
    confidence  = 0.85

    if req.strategy == ReasoningStrategy.REACT:
        steps, final, tokens = _react(req)
    elif req.strategy == ReasoningStrategy.SELF_CONSISTENCY:
        steps, final, tokens, alternatives = _self_consistency(req)
        confidence = min(0.99, 0.6 + 0.1 * req.num_paths)
    else:
        # chain_of_thought / few_shot / zero_shot / tree_of_thought
        steps, final, tokens = _cot(req)

    return ReasoningResponse(
        question=req.question,
        strategy=req.strategy.value,
        steps=steps,
        final_answer=final,
        confidence=round(confidence, 3),
        tokens_used=tokens,
        model=req.model,
        alternative_answers=alternatives,
    )
