"""Multi-strategy text summarisation: stuff, map-reduce, refine, extractive."""

from __future__ import annotations

import json
import os
import textwrap

from openai import OpenAI

from schemas.summarizer import (
    BatchSummarizeRequest, BatchSummarizeResponse,
    DocumentSummary, SummarizeRequest, SummarizeResponse, SummarizeStrategy,
)

_client  = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_CHUNK   = 6000   # characters per chunk for map-reduce


def _call(prompt: str, model: str, temp: float = 0.3) -> tuple[str, int]:
    resp = _client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temp,
    )
    return (resp.choices[0].message.content or ""), (resp.usage.total_tokens if resp.usage else 0)


def _stuff(text: str, req: SummarizeRequest) -> tuple[str, int]:
    bullet_inst = "Use bullet points. " if req.bullet_points else ""
    focus_inst  = f"Focus on: {req.focus}. " if req.focus else ""
    prompt = (
        f"Summarise the following text in {req.max_length} words or fewer. "
        f"{bullet_inst}{focus_inst}\n\nText:\n{text}"
    )
    return _call(prompt, req.model)


def _map_reduce(text: str, req: SummarizeRequest) -> tuple[str, int]:
    chunks  = textwrap.wrap(text, _CHUNK)
    partials, total = [], 0
    for chunk in chunks:
        s, t = _call(f"Summarise this passage briefly:\n{chunk}", req.model)
        partials.append(s)
        total += t
    combined = "\n\n".join(partials)
    final, ft = _call(
        f"Combine these summaries into a final summary of {req.max_length} words:\n{combined}",
        req.model,
    )
    return final, total + ft


def _refine(text: str, req: SummarizeRequest) -> tuple[str, int]:
    chunks = textwrap.wrap(text, _CHUNK)
    summary, total = _call(f"Summarise:\n{chunks[0]}", req.model)
    for chunk in chunks[1:]:
        s, t = _call(
            f"Refine this summary by incorporating new info:\n"
            f"Current summary: {summary}\n\nNew content:\n{chunk}",
            req.model,
        )
        summary = s
        total  += t
    return summary, total


def summarize(req: SummarizeRequest) -> SummarizeResponse:
    text = req.text.strip()
    if not text:
        return SummarizeResponse(summary="", bullet_points=[], keywords=[],
                                 word_count=0, compression_ratio=0.0,
                                 strategy=req.strategy.value, model=req.model,
                                 tokens_used=0)

    if req.strategy == SummarizeStrategy.MAP_REDUCE:
        summary, tokens = _map_reduce(text, req)
    elif req.strategy == SummarizeStrategy.REFINE:
        summary, tokens = _refine(text, req)
    else:
        summary, tokens = _stuff(text, req)

    # Extract keywords
    kw_prompt = f"List 8 keywords from this text, comma-separated:\n{text[:1500]}"
    kw_raw, kw_t = _call(kw_prompt, req.model, temp=0.1)
    keywords = [k.strip() for k in kw_raw.split(",") if k.strip()][:8]
    tokens  += kw_t

    bullets: list[str] = []
    if req.bullet_points and "•" in summary:
        bullets = [line.lstrip("•- ").strip() for line in summary.split("\n")
                   if line.strip().startswith(("•", "-"))]

    orig_words = len(text.split())
    summ_words = len(summary.split())
    ratio      = round(1 - summ_words / max(orig_words, 1), 3)

    return SummarizeResponse(
        summary=summary, bullet_points=bullets, keywords=keywords,
        word_count=summ_words, compression_ratio=ratio,
        strategy=req.strategy.value, model=req.model, tokens_used=tokens,
    )


def batch_summarize(req: BatchSummarizeRequest) -> BatchSummarizeResponse:
    summaries: list[DocumentSummary] = []
    all_summaries: list[str]         = []
    total_tokens                     = 0

    for i, doc in enumerate(req.documents):
        sub = SummarizeRequest(text=doc, strategy=req.strategy, model=req.model)
        res = summarize(sub)
        summaries.append(DocumentSummary(
            index=i, summary=res.summary, keywords=res.keywords,
            word_count=res.word_count,
        ))
        all_summaries.append(res.summary)
        total_tokens += res.tokens_used

    combined_text = "\n\n".join(all_summaries)
    sub = SummarizeRequest(text=combined_text, strategy=SummarizeStrategy.STUFF, model=req.model)
    combined_res  = summarize(sub)
    total_tokens += combined_res.tokens_used

    return BatchSummarizeResponse(
        summaries=summaries,
        combined_summary=combined_res.summary,
        total_tokens=total_tokens,
    )
