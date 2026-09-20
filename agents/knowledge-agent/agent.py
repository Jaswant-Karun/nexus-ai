"""NEXUS AI — Knowledge Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple

SYSTEM = """You are the NEXUS AI Knowledge Agent.
Answer questions using ONLY the context documents provided.
Cite sources inline [Doc 1], [Doc 3]. If not in context, say so."""

class KnowledgeAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.1):
        self.model = model; self.temperature = temperature

    def answer(self, question: str, documents: list[str], metadata: list[dict] | None = None) -> dict:
        if not documents:
            return {"answer": "No documents provided.", "sources": [], "agent": "knowledge-agent", "tokens_used": 0}
        ctx_parts = []
        for i, doc in enumerate(documents[:10]):
            meta  = metadata[i] if metadata and i < len(metadata) else {}
            title = meta.get("title", f"Document {i+1}")
            ctx_parts.append(f"[Doc {i+1}] {title}\n{doc[:1500]}")
        context = "\n\n".join(ctx_parts)

        ans, tok = _llm([{"role":"system","content":SYSTEM},
                         {"role":"system","content":f"Context:\n{context}"},
                         {"role":"user","content":question}],
                        model=self.model, temperature=self.temperature)

        cited   = sorted({int(m) for m in re.findall(r"\[Doc (\d+)\]", ans)})
        sources = [{"doc_number": n, "title": (metadata[n-1].get("title","") if metadata and n-1<len(metadata) else f"Doc {n}")}
                   for n in cited if 0 < n <= len(documents)]
        return {"agent":"knowledge-agent","question":question,"answer":ans,"sources":sources,"tokens_used":tok}

    def summarise_knowledge_base(self, documents: list[str], topic: str = "") -> dict:
        combined = "\n\n---\n\n".join(doc[:800] for doc in documents[:8])
        focus = f" Focus on: {topic}." if topic else ""
        ans, tok = _simple(f"Summarise these knowledge base documents concisely.{focus}\n\n{combined}")
        return {"agent":"knowledge-agent","summary":ans,"doc_count":len(documents),"tokens_used":tok}

def run(question: str, documents: list[str]) -> dict:
    return KnowledgeAgent().answer(question, documents)
