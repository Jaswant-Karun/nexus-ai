"""
NEXUS AI — AI Microservice  (v1.0.0)
=====================================
Handles: LLM agents, embeddings, RAG, planning, reasoning,
         workflow generation, explainability, simulation, and more.

Start with:
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload

Docs:
    http://localhost:8001/docs
    http://localhost:8001/redoc
"""

from __future__ import annotations

import os
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ── Config ────────────────────────────────────────────────────────────────────
from config import settings

# ── All routers ───────────────────────────────────────────────────────────────
from routers.inference        import router as inference_router
from routers.agents           import router as agents_router
from routers.embeddings       import router as embeddings_router
from routers.explainability   import router as explainability_router
from routers.planner          import router as planner_router
from routers.prompt_builder   import router as prompt_builder_router
from routers.reasoning        import router as reasoning_router
from routers.recommendation   import router as recommendation_router
from routers.reranking        import router as reranking_router
from routers.report_generator import router as report_generator_router
from routers.simulation       import router as simulation_router
from routers.summarizer       import router as summarizer_router
from routers.vector_search    import router as vector_search_router
from routers.workflow_generator import router as workflow_generator_router
from routers.nexus_agent        import router as nexus_agent_router

log = structlog.get_logger()

# ── Startup / shutdown ────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("nexus_ai_service.starting",
             version=settings.app_version,
             environment=settings.environment,
             openai_configured=bool(settings.openai_api_key),
             anthropic_configured=bool(settings.anthropic_api_key))
    yield
    log.info("nexus_ai_service.stopped")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NEXUS AI Service",
    version=settings.app_version,
    description=(
        "Full-stack AI microservice powering the NEXUS AI platform.\n\n"
        "**Modules:**\n"
        "- 🤖 **Agents** — specialised multi-agent orchestration (GPT-4o, Claude)\n"
        "- 🧠 **Embeddings** — OpenAI + local sentence-transformers\n"
        "- 🔍 **Vector Search** — Qdrant hybrid dense+BM25 retrieval\n"
        "- 📋 **Planner** — GPT-4o task decomposition and DAG planning\n"
        "- 💬 **Reasoning** — CoT, ReAct, Tree-of-Thought, Self-Consistency\n"
        "- ✍️ **Summarizer** — stuff, map-reduce, refine strategies\n"
        "- 🔬 **Explainability** — LIME-style feature importance + attention\n"
        "- 📊 **Report Generator** — structured business intelligence reports\n"
        "- 🎯 **Reranking** — Cohere + cross-encoder for RAG precision\n"
        "- 🔄 **Recommendation** — semantic embedding-based recommendations\n"
        "- ⚙️ **Workflow Generator** — auto-generate multi-agent DAGs\n"
        "- 🎮 **Simulation** — agent behaviour simulation + what-if analysis\n"
        "- 🛠️ **Prompt Builder** — Jinja2 template engine + LLM optimisation\n"
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000",
                   os.getenv("NEXT_PUBLIC_APP_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request timing middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time(request: Request, call_next) -> Response:
    start    = time.perf_counter()
    response = await call_next(request)
    elapsed  = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(elapsed)
    return response

# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception) -> JSONResponse:
    log.error("unhandled_error", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )

# ── Register all routers ──────────────────────────────────────────────────────
API = "/api/v1"

app.include_router(inference_router,          prefix=API)
app.include_router(agents_router,             prefix=API)
app.include_router(embeddings_router,         prefix=API)
app.include_router(explainability_router,     prefix=API)
app.include_router(planner_router,            prefix=API)
app.include_router(prompt_builder_router,     prefix=API)
app.include_router(reasoning_router,          prefix=API)
app.include_router(recommendation_router,     prefix=API)
app.include_router(reranking_router,          prefix=API)
app.include_router(report_generator_router,   prefix=API)
app.include_router(simulation_router,         prefix=API)
app.include_router(summarizer_router,         prefix=API)
app.include_router(vector_search_router,      prefix=API)
app.include_router(workflow_generator_router, prefix=API)
app.include_router(nexus_agent_router,       prefix=API)

# ── Core endpoints ────────────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root() -> dict:
    return {
        "service":     settings.app_name,
        "version":     settings.app_version,
        "status":      "online",
        "environment": settings.environment,
        "docs":        "/docs",
    }


@app.get("/health", tags=["Health"])
async def health() -> dict:
    """Service health check — verifies config and provider availability."""
    checks = {
        "openai":    bool(settings.openai_api_key),
        "anthropic": bool(settings.anthropic_api_key),
        "google":    bool(settings.google_ai_api_key),
        "qdrant_url": settings.qdrant_url,
    }
    return {
        "status":    "healthy",
        "service":   settings.app_name,
        "version":   settings.app_version,
        "providers": checks,
        "modules": [
            "agents", "embeddings", "vector_search", "planner",
            "reasoning", "summarizer", "explainability",
            "report_generator", "reranking", "recommendation",
            "workflow_generator", "simulation", "prompt_builder",
            "nexus_agent",
        ],
    }


@app.get("/api/v1/modules", tags=["Health"],
         summary="List all API modules with their endpoint prefixes")
async def list_modules() -> dict:
    return {
        "modules": [
            {"name": "Inference",          "prefix": f"{API}/inference",          "endpoints": 2},
            {"name": "Agents",             "prefix": f"{API}/agents",             "endpoints": 3},
            {"name": "Embeddings",         "prefix": f"{API}/embeddings",         "endpoints": 3},
            {"name": "Vector Search",      "prefix": f"{API}/vector-search",      "endpoints": 4},
            {"name": "Planner",            "prefix": f"{API}/planner",            "endpoints": 1},
            {"name": "Reasoning",          "prefix": f"{API}/reasoning",          "endpoints": 2},
            {"name": "Summarizer",         "prefix": f"{API}/summarizer",         "endpoints": 2},
            {"name": "Explainability",     "prefix": f"{API}/explainability",     "endpoints": 2},
            {"name": "Report Generator",   "prefix": f"{API}/report-generator",   "endpoints": 2},
            {"name": "Reranking",          "prefix": f"{API}/reranking",          "endpoints": 2},
            {"name": "Recommendation",     "prefix": f"{API}/recommendation",     "endpoints": 1},
            {"name": "Workflow Generator", "prefix": f"{API}/workflow-generator", "endpoints": 2},
            {"name": "NEXUS Agent",        "prefix": f"{API}/nexus-agent",        "endpoints": 5},
            {"name": "Simulation",         "prefix": f"{API}/simulation",         "endpoints": 2},
            {"name": "Prompt Builder",     "prefix": f"{API}/prompt-builder",     "endpoints": 3},
        ]
    }
