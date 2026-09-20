"""
NEXUS AI — Summarizer Agent
Multi-strategy text summarisation: stuff, map-reduce, refine,
extractive, and bullet-point modes with keyword extraction.
"""

from __future__ import annotations

import os
import textwrap
from enum import Enum
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
CHUNK  = 6000   # chars per chunk for map-reduce


class Strategy(str, Enum):
    STUFF        = "stuff"
    MAP_REDUCE   = "map_reduce"
    REFINE       = "refine"
    BULLET       = "bullet"
    ABSTRACTIVE  = "abstractive"


def _call(prompt: str, model: str = "gpt-4o-mini",
          temp: float = 0.3) -> tuple[str, int]:
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temp,
    )
    return (resp.choices[0].message.content or ""), (resp.usage.total_tokens if resp.usage else 0)


class SummarizerAgent:
    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model

    def summarise(self, text: str,
                  strategy: Strategy = Strategy.ABSTRACTIVE,
                  max_words: int = 200,
                  focus: str = "",
                  bullet_points: bool = False) -> dict:
        text = text.strip()
        if not text:
            return {"summary": "", "keywords": [], "agent": "summarizer-agent"}

        focus_txt = f" Focus on: {focus}." if focus else ""
        bp_txt    = " Use bullet points." if bullet_points else ""
        base      = f"Summarise in {max_words} words or fewer.{focus_txt}{bp_txt}"

        if strategy == Strategy.MAP_REDUCE:
            summary, tokens = self._map_reduce(text, base)
        elif strategy == Strategy.REFINE:
            summary, tokens = self._refine(text, base)
        elif strategy == Strategy.BULLET:
            summary, tokens = _call(f"Summarise as numbered bullet points:\n{text[:8000]}")
        else:
            summary, tokens = _call(f"{base}\n\nText:\n{text[:8000]}", self.model)

        # Keywords
        kw_raw, kw_t = _call(f"List 8 keywords, comma-separated:\n{text[:1500]}", temp=0.1)
        keywords = [k.strip() for k in kw_raw.split(",") if k.strip()][:8]

        return {
            "agent":       "summarizer-agent",
            "strategy":    strategy,
            "summary":     summary,
            "keywords":    keywords,
            "word_count":  len(summary.split()),
            "compression": round(1 - len(summary.split()) / max(len(text.split()), 1), 3),
            "tokens_used": tokens + kw_t,
        }

    def _map_reduce(self, text: str, instruction: str) -> tuple[str, int]:
        chunks   = textwrap.wrap(text, CHUNK)
        partials, total = [], 0
        for chunk in chunks:
            s, t = _call(f"Summarise briefly:\n{chunk}", self.model)
            partials.append(s); total += t
        combined     = "\n\n".join(partials)
        final, ft    = _call(f"{instruction}\n\nCombined summaries:\n{combined}", self.model)
        return final, total + ft

    def _refine(self, text: str, instruction: str) -> tuple[str, int]:
        chunks = textwrap.wrap(text, CHUNK)
        summary, total = _call(f"Summarise:\n{chunks[0]}", self.model)
        for chunk in chunks[1:]:
            s, t = _call(
                f"Refine summary with new info:\nSummary: {summary}\nNew: {chunk}", self.model
            )
            summary = s; total += t
        return summary, total

    def batch(self, texts: list[str]) -> list[dict]:
        return [self.summarise(t) for t in texts]


def run(text: str, strategy: str = "abstractive",
        max_words: int = 200) -> dict:
    s = Strategy(strategy) if strategy in Strategy._value2member_map_ else Strategy.ABSTRACTIVE
    return SummarizerAgent().summarise(text, s, max_words)
