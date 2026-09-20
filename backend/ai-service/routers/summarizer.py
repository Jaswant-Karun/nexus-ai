"""Router — Summarizer endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.summarizer import (
    BatchSummarizeRequest, BatchSummarizeResponse,
    SummarizeRequest, SummarizeResponse,
)
from summarizer.summarize import summarize, batch_summarize

router = APIRouter(prefix="/summarizer", tags=["Summarizer"])


@router.post("/summarize", response_model=SummarizeResponse,
             summary="Summarise a single document with a chosen strategy")
def summarize_document(request: SummarizeRequest) -> SummarizeResponse:
    """
    Summarisation strategies:
    - abstractive:  GPT-4o generates a new summary (default)
    - map_reduce:   chunk → summarise each → combine (best for long docs)
    - refine:       iteratively improve summary with each chunk
    - stuff:        fit entire doc in one prompt
    - extractive:   select key sentences without rewriting
    Returns summary, bullet points (optional), keywords, compression ratio.
    """
    try:
        return summarize(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/batch", response_model=BatchSummarizeResponse,
             summary="Summarise multiple documents and combine into one")
def batch_summarize_documents(request: BatchSummarizeRequest) -> BatchSummarizeResponse:
    """
    Summarises each document independently, then synthesises a combined summary.
    Uses map_reduce strategy by default for efficiency.
    """
    try:
        return batch_summarize(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
