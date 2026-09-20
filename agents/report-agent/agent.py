"""
NEXUS AI — Report Agent
Generates structured, professional reports from data and analysis.
Supports Markdown, HTML, JSON, and plain text output.
"""

from __future__ import annotations

import json
import os

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM = """You are the NEXUS AI Report Agent — a professional business analyst and writer.
Generate comprehensive, well-structured reports with:
- Clear executive summary
- Data-driven insights
- Actionable recommendations
- Professional markdown formatting
Use headers (##), bullet points, tables, and bold text appropriately."""


class ReportAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.3):
        self.model       = model
        self.temperature = temperature

    def generate(self, title: str, data: dict | list | str,
                 instructions: str = "",
                 sections: list[str] | None = None) -> dict:
        """Generate a full report from data."""
        default_sections = [
            "Executive Summary", "Key Findings", "Detailed Analysis",
            "Risks & Challenges", "Recommendations", "Conclusion",
        ]
        sec_list = sections or default_sections
        sec_text = "\n".join(f"- {s}" for s in sec_list)

        data_str = json.dumps(data, indent=2)[:4000] if not isinstance(data, str) else data[:4000]

        user_msg = (
            f"Title: {title}\n"
            f"Instructions: {instructions or 'Generate a comprehensive professional report.'}\n"
            f"Required sections:\n{sec_text}\n\n"
            f"Data:\n{data_str}"
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user",   "content": user_msg},
            ],
            temperature=self.temperature,
        )
        content = resp.choices[0].message.content or ""
        tokens  = resp.usage.total_tokens if resp.usage else 0

        return {
            "agent":       "report-agent",
            "title":       title,
            "content":     content,
            "format":      "markdown",
            "word_count":  len(content.split()),
            "tokens_used": tokens,
            "model":       self.model,
        }

    def extract_insights(self, data: dict | str, focus: str = "",
                         num_insights: int = 5) -> dict:
        """Extract key insights from data."""
        data_str = json.dumps(data, indent=2)[:3000] if not isinstance(data, str) else data
        prompt   = (
            f"Extract {num_insights} key insights from this data.\n"
            f"{'Focus on: ' + focus + chr(10) if focus else ''}"
            f"Return JSON: {{\"insights\": [\"...\"], \"summary\": \"...\"}}\n\n{data_str}"
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        return {**json.loads(resp.choices[0].message.content or "{}"),
                "agent": "report-agent",
                "tokens_used": resp.usage.total_tokens if resp.usage else 0}


def run(title: str, data: dict | str) -> dict:
    return ReportAgent().generate(title, data)
