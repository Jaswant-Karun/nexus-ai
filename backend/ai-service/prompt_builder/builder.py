"""Dynamic prompt construction from Jinja2 templates + LLM optimisation."""

from __future__ import annotations

import os

from jinja2 import BaseLoader, Environment, TemplateSyntaxError
from openai import OpenAI

from schemas.prompt_builder import (
    BuildPromptRequest, BuildPromptResponse,
    OptimizePromptRequest, OptimizePromptResponse,
    PromptTemplate,
)

_client  = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_jinja   = Environment(loader=BaseLoader(), autoescape=False)

# ── Built-in template library ─────────────────────────────────────────────────
TEMPLATE_LIBRARY: dict[str, PromptTemplate] = {
    "rag_qa": PromptTemplate(
        name="rag_qa",
        template=(
            "You are a helpful assistant. Answer the question using ONLY the context below.\n"
            "Context:\n{{ context }}\n\nQuestion: {{ question }}\nAnswer:"
        ),
        variables=["context", "question"],
        description="RAG-style question answering from retrieved documents.",
    ),
    "code_review": PromptTemplate(
        name="code_review",
        template=(
            "Review the following {{ language }} code for correctness, security, performance, "
            "and readability. Rate each dimension 1-10.\n\n```{{ language }}\n{{ code }}\n```"
        ),
        variables=["language", "code"],
        description="Code review with multi-dimensional scoring.",
    ),
    "summarise_doc": PromptTemplate(
        name="summarise_doc",
        template=(
            "Summarise the following document in {{ max_words }} words or fewer. "
            "{% if focus %}Focus on: {{ focus }}.{% endif %}\n\nDocument:\n{{ document }}"
        ),
        variables=["document", "max_words", "focus"],
        description="Configurable document summarisation.",
    ),
    "agent_system": PromptTemplate(
        name="agent_system",
        template=(
            "You are {{ agent_name }}, a {{ agent_role }} AI agent for NEXUS AI.\n"
            "{{ persona }}\n"
            "Available tools: {{ tools }}\n"
            "Always think step-by-step before acting."
        ),
        variables=["agent_name", "agent_role", "persona", "tools"],
        description="System prompt builder for NEXUS agents.",
    ),
    "chain_of_thought": PromptTemplate(
        name="chain_of_thought",
        template=(
            "Question: {{ question }}\n\n"
            "Let's think through this step by step:\n"
            "{% for example in examples %}"
            "Example {{ loop.index }}: {{ example.q }}\nAnswer: {{ example.a }}\n\n"
            "{% endfor %}"
            "Now answer the original question:"
        ),
        variables=["question", "examples"],
        description="Few-shot chain-of-thought reasoning prompt.",
    ),
}


def _count_tokens(text: str) -> int:
    """Rough token estimate — 1 token ≈ 4 chars."""
    return max(1, len(text) // 4)


def build_prompt(req: BuildPromptRequest) -> BuildPromptResponse:
    # Resolve template
    if req.template_name and req.template_name in TEMPLATE_LIBRARY:
        tpl_obj  = TEMPLATE_LIBRARY[req.template_name]
        raw_tpl  = tpl_obj.template
        tpl_name = req.template_name
    elif req.template:
        raw_tpl  = req.template
        tpl_name = "inline"
    else:
        # fallback — plain user message
        raw_tpl  = "{{ task }}"
        tpl_name = "default"

    try:
        template = _jinja.from_string(raw_tpl)
        rendered = template.render(**req.variables)
    except TemplateSyntaxError as exc:
        rendered = raw_tpl      # return raw if template is broken

    # Add few-shot examples if provided
    example_block = ""
    if req.examples:
        lines = [f"Q: {e.get('q', '')}\nA: {e.get('a', '')}" for e in req.examples]
        example_block = "\n\n".join(lines) + "\n\n"

    final_prompt = example_block + rendered if example_block else rendered
    token_est    = _count_tokens(req.system_context + final_prompt)

    return BuildPromptResponse(
        prompt=final_prompt,
        system=req.system_context,
        token_estimate=token_est,
        template_used=tpl_name,
        variables_used=req.variables,
    )


def optimize_prompt(req: OptimizePromptRequest) -> OptimizePromptResponse:
    system = (
        f"You are a prompt engineering expert. Optimise the given prompt for "
        f"'{req.optimize_for}' when used with {req.target_model}. "
        f"Task context: {req.task}\n"
        "Return JSON: {\"optimized_prompt\": \"...\", \"improvements\": [\"...\"]}"
    )
    resp = _client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": f"Original prompt:\n{req.prompt}"},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    import json
    data = json.loads(resp.choices[0].message.content or "{}")
    opt  = data.get("optimized_prompt", req.prompt)
    return OptimizePromptResponse(
        original_prompt=req.prompt,
        optimized_prompt=opt,
        improvements=data.get("improvements", []),
        token_reduction=max(0, _count_tokens(req.prompt) - _count_tokens(opt)),
        model=req.target_model,
    )
