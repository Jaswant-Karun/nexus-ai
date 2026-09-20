"""
NEXUS AI — Central AI Service orchestrator.
Single import point wiring all modules together.
"""

from __future__ import annotations

# ── Agents ────────────────────────────────────────────────────────────────────
from agents.base_agent import BaseAgent
from agents.specialist_agents import create_agent
from agents.multi_agent import MultiAgentOrchestrator, orchestrator as multi_agent_orchestrator

# ── Embeddings ────────────────────────────────────────────────────────────────
from embeddings.openai_embedder import (
    embed_request,
    similarity_request,
    embed_texts,
    cosine_similarity,
)
from embeddings.local_embedder import embed_local

# ── Explainability ────────────────────────────────────────────────────────────
from explainability.explainer import explain, attention_explain

# ── Planner ───────────────────────────────────────────────────────────────────
from planner.task_planner import create_plan

# ── Prompt Builder ────────────────────────────────────────────────────────────
from prompt_builder.builder import (
    build_prompt,
    optimize_prompt,
    TEMPLATE_LIBRARY,
)

# ── Reasoning ─────────────────────────────────────────────────────────────────
from reasoning.engine import reason

# ── Recommendation ────────────────────────────────────────────────────────────
from recommendation.recommender import recommend

# ── Reranking ─────────────────────────────────────────────────────────────────
from reranking.reranker import rerank_with_cohere, rerank_with_cross_encoder

# ── Report Generator ──────────────────────────────────────────────────────────
from report_generator.generator import generate_report, generate_insights

# ── Simulation ────────────────────────────────────────────────────────────────
from simulation.simulator import simulate, what_if

# ── Summarizer ────────────────────────────────────────────────────────────────
from summarizer.summarize import summarize, batch_summarize

# ── Vector Search ─────────────────────────────────────────────────────────────
from vector_search.qdrant_store import (
    index_documents,
    search_documents,
    hybrid_search,
    delete_documents,
)

# ── Workflow Generator ────────────────────────────────────────────────────────
from workflow_generator.generator import generate_workflow, optimize_workflow

__all__ = [
    # Agents
    "BaseAgent", "create_agent", "MultiAgentOrchestrator", "multi_agent_orchestrator",
    # Embeddings
    "embed_request", "similarity_request", "embed_texts", "cosine_similarity", "embed_local",
    # Explainability
    "explain", "attention_explain",
    # Planner
    "create_plan",
    # Prompt builder
    "build_prompt", "optimize_prompt", "TEMPLATE_LIBRARY",
    # Reasoning
    "reason",
    # Recommendation
    "recommend",
    # Reranking
    "rerank_with_cohere", "rerank_with_cross_encoder",
    # Report generator
    "generate_report", "generate_insights",
    # Simulation
    "simulate", "what_if",
    # Summarizer
    "summarize", "batch_summarize",
    # Vector search
    "index_documents", "search_documents", "hybrid_search", "delete_documents",
    # Workflow generator
    "generate_workflow", "optimize_workflow",
]
