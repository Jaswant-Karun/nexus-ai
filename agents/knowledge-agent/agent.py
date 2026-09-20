"""
NEXUS AI — Knowledge Agent
Retrieves, synthesises, and grounds answers in a knowledge base.
Supports RAG pipelines, semantic search, and citation tracking.
"""

from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM_PROMPT = """You are the NEXUS AI Knowledge Agent.
You answer questions strictly from the context documents provided.
Rules:
- Only use information from the provided context
- Cite source document numbers inline, e.g. [Doc 1], [Doc 3]
- If the answer is not in the context, say: "I cannot find this in the provided documents."
- Be precise and concise
- List key facts as bullet points when appropriate"""


class KnowledgeAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.1):
        self.model       = model
        self.temperature = temperature

    def answer(self, question: str, documents: list[str],
               metadata: list[dict[str, Any]] | None = None) -> dict:
        """Answer a question grounded in the provided documents."""
        if not documents:
            return {"answer": "No documents provided.", "sources": [],
                    "agent": "knowledge-agent", "tokens_used": 0}

        # Build context block
        context_parts = []
        for i, doc in enumerate(documents[:10]):   # max 10 docs
            meta = metadata[i] if metadata and i < len(metadata) else {}
            title = meta.get("title", f"Document {i+1}")
            context_parts.append(f"[Doc {i+1}] {title}\n{doc[:1500]}")
        context = "\n\n".join(context_parts)

        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system",  "content": SYSTEM_PROMPT},
                {"role": "system",  "content": f"Context documents:\n\n{context}"},
                {"role": "user",    "content": question},
            ],
            temperature=self.temperature,
        )
        answer = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0

        # Extract cited source numbers
        import re
        cited = sorted({int(m) for m in re.findall(r"\[Doc (\d+)\]", answer)})
        sources = []
        for n in cited:
            idx = n - 1
            if 0 <= idx < len(documents):
                m = metadata[idx] if metadata and idx < len(metadata) else {}
                sources.append({"doc_number": n, "title": m.get("title", f"Doc {n}"),
                                 "url": m.get("url", "")})

        return {"agent": "knowledge-agent", "question": question,
                "answer": answer, "sources": sources, "tokens_used": tokens}

    def summarise_knowledge_base(self, documents: list[str],
                                  topic: str = "") -> dict:
        """Generate a summary of all documents in a knowledge base."""
        combined = "\n\n---\n\n".join(doc[:800] for doc in documents[:8])
        focus    = f" Focus on: {topic}." if topic else ""
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Summarise the following knowledge base documents concisely." + focus},
                {"role": "user",   "content": combined},
            ],
            temperature=0.2,
        )
        return {"agent": "knowledge-agent", "summary": resp.choices[0].message.content,
                "doc_count": len(documents),
                "tokens_used": resp.usage.total_tokens if resp.usage else 0}


def run(question: str, documents: list[str]) -> dict:
    return KnowledgeAgent().answer(question, documents)
