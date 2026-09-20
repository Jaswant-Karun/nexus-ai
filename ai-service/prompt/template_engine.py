"""
NEXUS AI Service — Prompt Template Engine
Jinja2-based dynamic prompt construction with built-in templates
for RAG, agents, code review, summarisation, and more.
"""

from __future__ import annotations

import os
from typing import Any

from jinja2 import BaseLoader, Environment, TemplateSyntaxError

_jinja = Environment(loader=BaseLoader(), autoescape=False)

BUILTIN_TEMPLATES: dict[str, str] = {
    "rag_qa": (
        "Answer using ONLY the context below. Cite [Doc N] inline.\n"
        "Context:\n{{ context }}\n\nQuestion: {{ question }}\nAnswer:"
    ),
    "code_review": (
        "Review this {{ language }} code for correctness, security, performance, readability.\n"
        "Rate each dimension 1-10 with specific suggestions.\n\n"
        "```{{ language }}\n{{ code }}\n```"
    ),
    "summarise": (
        "Summarise in {{ max_words }} words or fewer.{% if focus %} Focus on: {{ focus }}.{% endif %}\n\n"
        "{{ document }}"
    ),
    "agent_system": (
        "You are {{ agent_name }}, a {{ role }} AI agent.\n"
        "{{ persona }}\n"
        "Available tools: {{ tools }}\n"
        "Always think step-by-step before acting."
    ),
    "cot": (
        "Question: {{ question }}\n\n"
        "{% for ex in examples %}Example: {{ ex.q }}\nAnswer: {{ ex.a }}\n\n{% endfor %}"
        "Think step-by-step to answer the question:"
    ),
    "plan": (
        "Decompose this goal into {{ max_steps }} or fewer ordered subtasks:\n"
        "Goal: {{ goal }}\n"
        "{% if context %}Context: {{ context }}\n{% endif %}"
        "{% if constraints %}Constraints:\n{% for c in constraints %}- {{ c }}\n{% endfor %}{% endif %}"
    ),
}


class TemplateEngine:
    def render(self, template_name: str = "", template: str = "",
               variables: dict[str, Any] | None = None) -> str:
        """Render a named or inline template."""
        raw_tpl = BUILTIN_TEMPLATES.get(template_name, template)
        if not raw_tpl:
            return str(variables.get("prompt", "")) if variables else ""
        try:
            return _jinja.from_string(raw_tpl).render(**(variables or {}))
        except TemplateSyntaxError:
            return raw_tpl   # return raw if template is broken

    def count_tokens(self, text: str) -> int:
        """Rough estimate: 1 token ≈ 4 chars."""
        return max(1, len(text) // 4)

    def list_templates(self) -> list[dict[str, str]]:
        return [{"name": k, "preview": v[:80] + "…"} for k, v in BUILTIN_TEMPLATES.items()]


engine = TemplateEngine()
