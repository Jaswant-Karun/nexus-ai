"""NEXUS AI — Report Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple

SYSTEM = """You are the NEXUS AI Report Agent — a professional business analyst.
Generate comprehensive, well-structured reports with Executive Summary, Key Findings, Analysis, Recommendations.
Use clear markdown: headers (##), bullets, **bold**, tables."""

class ReportAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.3):
        self.model = model; self.temperature = temperature

    def generate(self, title: str, data: dict | list | str,
                 instructions: str = "", sections: list[str] | None = None) -> dict:
        default_sections = ["Executive Summary","Key Findings","Detailed Analysis","Risks & Challenges","Recommendations","Conclusion"]
        sec_text = "\n".join(f"- {s}" for s in (sections or default_sections))
        data_str = json.dumps(data, indent=2)[:4000] if not isinstance(data, str) else data[:4000]
        user_msg = f"Title: {title}\nInstructions: {instructions or 'Generate comprehensive report.'}\nSections:\n{sec_text}\n\nData:\n{data_str}"

        ans, tok = _llm([{"role":"system","content":SYSTEM},{"role":"user","content":user_msg}],
                        model=self.model, temperature=self.temperature)
        return {"agent":"report-agent","title":title,"content":ans,"format":"markdown",
                "word_count":len(ans.split()),"tokens_used":tok,"model":self.model}

    def extract_insights(self, data: dict | str, focus: str = "", num_insights: int = 5) -> dict:
        data_str = json.dumps(data, indent=2)[:3000] if not isinstance(data, str) else data
        prompt   = f"Extract {num_insights} key insights. {'Focus: '+focus+'.' if focus else ''}\nReturn JSON: {{\"insights\":[\"...\"],\"summary\":\"...\"}}\n\n{data_str}"
        ans, tok = _simple(prompt)
        try:
            result = json.loads(ans)
        except json.JSONDecodeError:
            result = {"insights": [ans[:200]], "summary": ans[:100]}
        result["agent"] = "report-agent"; result["tokens_used"] = tok
        return result

def run(title: str, data: dict | str) -> dict:
    return ReportAgent().generate(title, data)
