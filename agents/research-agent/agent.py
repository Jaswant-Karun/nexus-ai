"""
NEXUS AI — Research Agent
Deep research agent that synthesises information from multiple
context sources, generates follow-up questions, and produces
comprehensive research reports with citations.
"""

from __future__ import annotations

import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM = """You are the NEXUS AI Research Agent — a thorough academic and market researcher.
Your research methodology:
1. Analyse all provided source documents
2. Extract key facts, statistics, and claims
3. Identify conflicting information across sources
4. Synthesise a comprehensive answer with inline citations [Source N]
5. Highlight gaps in the research
6. Suggest follow-up questions

Always: be precise, cite sources, acknowledge uncertainty, distinguish facts from analysis."""


class ResearchAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model       = model
        self.temperature = temperature

    def research(self, topic: str, sources: list[dict] | None = None,
                 depth: str = "standard") -> dict:
        """Conduct research on a topic using provided sources."""
        src_block = ""
        if sources:
            parts = []
            for i, s in enumerate(sources[:8]):
                title = s.get("title", f"Source {i+1}")
                text  = s.get("content", s.get("text", ""))[:1200]
                parts.append(f"[Source {i+1}] {title}\n{text}")
            src_block = "\n\n".join(parts)

        depth_instr = {
            "brief":    "Provide a concise 2-3 paragraph summary.",
            "standard": "Provide a comprehensive analysis with all key points.",
            "deep":     "Provide an exhaustive research report with all details, nuances, and gaps.",
        }.get(depth, "Provide a comprehensive analysis.")

        messages = [{"role": "system", "content": SYSTEM + "\n" + depth_instr}]
        if src_block:
            messages.append({"role": "system", "content": f"Sources:\n{src_block}"})
        messages.append({"role": "user", "content": f"Research topic: {topic}"})

        resp = client.chat.completions.create(
            model=self.model, messages=messages, temperature=self.temperature
        )
        answer  = resp.choices[0].message.content or ""
        tokens  = resp.usage.total_tokens if resp.usage else 0

        # Generate follow-up questions
        fq_resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content":
                        f"Based on this research about '{topic}', list 5 important follow-up questions:\n{answer[:500]}"}],
            temperature=0.4,
        )
        follow_ups = [
            line.strip().lstrip("0123456789.-) ")
            for line in (fq_resp.choices[0].message.content or "").split("\n")
            if line.strip() and len(line.strip()) > 10
        ][:5]

        return {
            "agent":        "research-agent",
            "topic":        topic,
            "depth":        depth,
            "research":     answer,
            "follow_ups":   follow_ups,
            "source_count": len(sources or []),
            "tokens_used":  tokens,
        }

    def compare(self, topic: str, item_a: str, item_b: str) -> dict:
        """Compare two items on a given topic."""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[{
                "role": "user",
                "content": (
                    f"Compare '{item_a}' vs '{item_b}' regarding {topic}.\n"
                    f"Use a structured format: similarities, differences, verdict."
                ),
            }],
            temperature=0.2,
        )
        return {"agent": "research-agent", "comparison": resp.choices[0].message.content,
                "tokens_used": resp.usage.total_tokens if resp.usage else 0}


def run(topic: str, sources: list[dict] | None = None) -> dict:
    return ResearchAgent().research(topic, sources)
