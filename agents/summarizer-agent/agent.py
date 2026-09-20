"""NEXUS AI — Summarizer Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import os, sys, textwrap
from enum import Enum
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import simple as _simple

class Strategy(str, Enum):
    STUFF="stuff"; MAP_REDUCE="map_reduce"; REFINE="refine"; BULLET="bullet"; ABSTRACTIVE="abstractive"

CHUNK = 6000

class SummarizerAgent:
    def __init__(self, model: str = "gpt-4o"):
        self.model = model

    def summarise(self, text: str, strategy: Strategy = Strategy.ABSTRACTIVE,
                  max_words: int = 200, focus: str = "", bullet_points: bool = False) -> dict:
        text = text.strip()
        if not text:
            return {"summary": "", "keywords": [], "agent": "summarizer-agent"}
        focus_t = f" Focus on: {focus}." if focus else ""
        bp_t    = " Use bullet points." if bullet_points else ""
        base    = f"Summarise in {max_words} words or fewer.{focus_t}{bp_t}"

        if strategy == Strategy.MAP_REDUCE:
            summary, tokens = self._map_reduce(text, base)
        elif strategy == Strategy.REFINE:
            summary, tokens = self._refine(text, base)
        elif strategy == Strategy.BULLET:
            summary, tokens = _simple(f"Summarise as numbered bullet points:\n{text[:8000]}")
        else:
            summary, tokens = _simple(f"{base}\n\nText:\n{text[:8000]}")

        kw_raw, kw_t = _simple(f"List 8 keywords comma-separated:\n{text[:1500]}")
        keywords = [k.strip() for k in kw_raw.split(",") if k.strip()][:8]

        return {"agent": "summarizer-agent", "strategy": strategy, "summary": summary,
                "keywords": keywords, "word_count": len(summary.split()),
                "compression": round(1 - len(summary.split()) / max(len(text.split()), 1), 3),
                "tokens_used": tokens + kw_t}

    def _map_reduce(self, text: str, instruction: str) -> tuple[str, int]:
        chunks = textwrap.wrap(text, CHUNK)
        partials, total = [], 0
        for c in chunks:
            s, t = _simple(f"Summarise briefly:\n{c}"); partials.append(s); total += t
        final, ft = _simple(f"{instruction}\n\nCombined:\n" + "\n\n".join(partials))
        return final, total + ft

    def _refine(self, text: str, instruction: str) -> tuple[str, int]:
        chunks = textwrap.wrap(text, CHUNK)
        summary, total = _simple(f"Summarise:\n{chunks[0]}")
        for c in chunks[1:]:
            s, t = _simple(f"Refine with new info:\nSummary: {summary}\nNew: {c}")
            summary = s; total += t
        return summary, total

    def batch(self, texts: list[str]) -> list[dict]:
        return [self.summarise(t) for t in texts]

def run(text: str, strategy: str = "abstractive", max_words: int = 200) -> dict:
    s = Strategy(strategy) if strategy in Strategy._value2member_map_ else Strategy.ABSTRACTIVE
    return SummarizerAgent().summarise(text, s, max_words)
