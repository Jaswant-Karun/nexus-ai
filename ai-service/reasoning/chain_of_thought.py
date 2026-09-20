"""
NEXUS AI Service — Chain-of-Thought Reasoning
Implementation of CoT, ReAct, and Tree-of-Thought reasoning patterns.
"""

from __future__ import annotations

import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def chain_of_thought(question: str, context: str = "",
                     model: str = "gpt-4o",
                     temperature: float = 0.2) -> dict:
    """Standard chain-of-thought prompting."""
    system = (
        "Think through this step-by-step. "
        "Label each step clearly (Step 1, Step 2…). "
        "End with a clear CONCLUSION."
    )
    messages = [{"role": "system", "content": system}]
    if context:
        messages.append({"role": "system", "content": f"Context:\n{context}"})
    messages.append({"role": "user", "content": question})

    resp   = client.chat.completions.create(model=model, messages=messages, temperature=temperature)
    answer = resp.choices[0].message.content or ""
    tokens = resp.usage.total_tokens if resp.usage else 0

    # Parse steps
    steps = [
        {"step": i + 1, "content": line.strip()}
        for i, line in enumerate(answer.split("\n"))
        if line.strip().lower().startswith("step")
    ]
    conclusion = next(
        (line for line in answer.split("\n") if "conclusion" in line.lower()), answer[-200:]
    )

    return {
        "strategy":    "chain_of_thought",
        "question":    question,
        "full_answer": answer,
        "steps":       steps,
        "conclusion":  conclusion,
        "tokens_used": tokens,
    }


def react(question: str, tools: list[str] | None = None,
          model: str = "gpt-4o",
          max_steps: int = 5) -> dict:
    """ReAct: Thought → Action → Observation loop."""
    available = ", ".join(tools) if tools else "web_search, calculate, knowledge_base"
    system    = (
        f"Available tools: {available}\n"
        "Use the ReAct pattern:\n"
        "Thought: <reasoning>\nAction: <tool_name>(<args>)\nObservation: <result>\n"
        "...repeat up to 5 times...\n"
        "Final Answer: <answer>"
    )
    messages = [{"role": "system", "content": system},
                {"role": "user",   "content": question}]

    resp   = client.chat.completions.create(model=model, messages=messages, temperature=0.1)
    answer = resp.choices[0].message.content or ""
    tokens = resp.usage.total_tokens if resp.usage else 0

    # Parse steps
    steps = []
    for line in answer.split("\n"):
        line = line.strip()
        if line.startswith("Thought:"):
            steps.append({"type": "thought",     "content": line[8:].strip()})
        elif line.startswith("Action:"):
            steps.append({"type": "action",      "content": line[7:].strip()})
        elif line.startswith("Observation:"):
            steps.append({"type": "observation", "content": line[12:].strip()})
        elif line.startswith("Final Answer:"):
            steps.append({"type": "conclusion",  "content": line[13:].strip()})

    final = next((s["content"] for s in reversed(steps) if s["type"] == "conclusion"), answer)

    return {
        "strategy":    "react",
        "question":    question,
        "full_answer": answer,
        "steps":       steps,
        "final_answer": final,
        "tokens_used": tokens,
    }


def self_consistency(question: str, context: str = "",
                     n_paths: int = 3, model: str = "gpt-4o") -> dict:
    """Run N CoT passes and pick the majority answer."""
    answers, total = [], 0
    for _ in range(n_paths):
        r = chain_of_thought(question, context, model, temperature=0.7)
        answers.append(r["conclusion"])
        total += r["tokens_used"]

    # Majority vote — pick most common final token as heuristic
    from collections import Counter
    words   = [a.split()[-1] if a.split() else "" for a in answers]
    top     = Counter(words).most_common(1)[0][0]
    best    = max((a for a in answers if top in a), key=len, default=answers[-1])

    return {
        "strategy":     "self_consistency",
        "question":     question,
        "paths":        n_paths,
        "final_answer": best,
        "alternatives": answers,
        "tokens_used":  total,
    }
