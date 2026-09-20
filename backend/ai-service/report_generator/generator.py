"""AI-powered report and insight generation using GPT-4o."""

from __future__ import annotations

import json
import os

from openai import OpenAI

from schemas.report import (
    InsightRequest, InsightResponse,
    ReportRequest, ReportResponse, ReportSection,
)

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

_REPORT_SYSTEM = """You are an expert business intelligence analyst for NEXUS AI.
Generate a professional, data-driven report based on the provided data and instructions.
Structure the report with clear sections. Use markdown formatting.
Return JSON: {
  "sections": [{"title": "...", "content": "..."}],
  "executive_summary": "..."
}"""


def generate_report(req: ReportRequest) -> ReportResponse:
    sections_guide = (
        "\n".join(f"- {s}" for s in req.sections)
        if req.sections
        else "- Executive Summary\n- Key Findings\n- Analysis\n- Recommendations"
    )

    user_msg = (
        f"Report Title: {req.title}\n"
        f"Instructions: {req.instructions or 'Generate a comprehensive report.'}\n"
        f"Sections required:\n{sections_guide}\n"
        f"Data:\n{json.dumps(req.data, indent=2)[:4000]}"
    )

    resp = _client.chat.completions.create(
        model=req.model,
        messages=[
            {"role": "system", "content": _REPORT_SYSTEM},
            {"role": "user",   "content": user_msg},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    raw    = resp.choices[0].message.content or "{}"
    tokens = resp.usage.total_tokens if resp.usage else 0
    data   = json.loads(raw)

    sections: list[ReportSection] = [
        ReportSection(title=s["title"], content=s["content"])
        for s in data.get("sections", [])
    ]
    executive = data.get("executive_summary", "")
    if executive and not any(s.title.lower().startswith("executive") for s in sections):
        sections.insert(0, ReportSection(title="Executive Summary", content=executive))

    full_content = "\n\n".join(f"## {s.title}\n{s.content}" for s in sections)

    return ReportResponse(
        title=req.title,
        content=full_content,
        sections=sections,
        format=req.format.value,
        word_count=len(full_content.split()),
        model=req.model,
        tokens_used=tokens,
    )


def generate_insights(req: InsightRequest) -> InsightResponse:
    user_msg = (
        f"Analyse this data and extract {req.num_insights} key insights.\n"
        f"Focus: {req.focus or 'overall patterns and anomalies'}\n"
        f"Data:\n{json.dumps(req.data, indent=2)[:3000]}\n\n"
        "Return JSON: {\"insights\": [\"...\"], \"data_summary\": \"...\"}"
    )
    resp = _client.chat.completions.create(
        model=req.model,
        messages=[{"role": "user", "content": user_msg}],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    raw    = json.loads(resp.choices[0].message.content or "{}")
    tokens = resp.usage.total_tokens if resp.usage else 0
    return InsightResponse(
        insights=raw.get("insights", []),
        data_summary=raw.get("data_summary", ""),
        model=req.model,
        tokens_used=tokens,
    )
