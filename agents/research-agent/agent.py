"""NEXUS AI — Research Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple

SYSTEM = """You are the NEXUS AI Research Agent — a thorough academic and market researcher.
Synthesise information from sources, cite inline [Source N], distinguish facts from analysis, flag uncertainty."""

class ResearchAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model = model; self.temperature = temperature

    def research(self, topic: str, sources: list[dict] | None = None, depth: str = "standard") -> dict:
        src_block = ""
        if sources:
            parts = []
            for i, s in enumerate(sources[:8]):
                title = s.get("title", f"Source {i+1}")
                text  = s.get("content", s.get("text", ""))[:1200]
                parts.append(f"[Source {i+1}] {title}\n{text}")
            src_block = "\n\n".join(parts)

        depth_inst = {"brief": "2-3 paragraph summary.", "standard": "comprehensive analysis.", "deep": "exhaustive report."}.get(depth, "comprehensive analysis.")
        msgs = [{"role": "system", "content": SYSTEM + " " + depth_inst}]
        if src_block:
            msgs.append({"role": "system", "content": f"Sources:\n{src_block}"})
        msgs.append({"role": "user", "content": f"Research: {topic}"})

        answer, tokens = _llm(msgs, model=self.model, temperature=self.temperature)

        fq_text, _ = _simple(f"List 5 follow-up questions about '{topic}':\n{answer[:400]}")
        follow_ups  = [l.strip().lstrip("0123456789.-) ") for l in fq_text.split("\n") if len(l.strip()) > 10][:5]

        return {"agent": "research-agent", "topic": topic, "depth": depth,
                "research": answer, "follow_ups": follow_ups,
                "source_count": len(sources or []), "tokens_used": tokens}

    def compare(self, topic: str, item_a: str, item_b: str) -> dict:
        ans, tok = _simple(f"Compare '{item_a}' vs '{item_b}' on: {topic}. Use: similarities, differences, verdict.")
        return {"agent": "research-agent", "comparison": ans, "tokens_used": tok}

def run(topic: str, sources: list[dict] | None = None, depth: str = "standard") -> dict:
    return ResearchAgent().research(topic, sources, depth)
