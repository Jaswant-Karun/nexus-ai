"""Router — Report Generator endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from schemas.report import (
    InsightRequest, InsightResponse,
    ReportRequest, ReportResponse,
)
from report_generator.generator import generate_report, generate_insights

router = APIRouter(prefix="/report-generator", tags=["Report Generator"])


@router.post("/generate", response_model=ReportResponse,
             summary="Generate a structured AI report from data")
def create_report(request: ReportRequest) -> ReportResponse:
    """
    Generates a full professional report with multiple sections:
    Executive Summary, Key Findings, Analysis, Recommendations.
    Supports Markdown, HTML, JSON, and plain text output formats.
    """
    try:
        return generate_report(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/insights", response_model=InsightResponse,
             summary="Extract key insights from a data payload")
def extract_insights(request: InsightRequest) -> InsightResponse:
    """
    Analyses structured data and extracts the most important insights.
    Returns a list of insight strings + a data summary.
    """
    try:
        return generate_insights(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
