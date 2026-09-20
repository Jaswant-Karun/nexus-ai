from __future__ import annotations

import os
from pathlib import Path

# ── Load environment variables from root .env before anything else ────────────
# Walk up until we find the .env file (monorepo root is 2 levels above backend/api)
for _candidate in [
    Path(__file__).parent / ".env",
    Path(__file__).parent.parent / ".env",
    Path(__file__).parent.parent.parent / ".env",
]:
    if _candidate.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(_candidate, override=False)   # override=False keeps existing env vars
        except ImportError:
            # python-dotenv not installed — manually parse key=value lines
            with open(_candidate) as _f:
                for _line in _f:
                    _line = _line.strip()
                    if _line and not _line.startswith("#") and "=" in _line:
                        _k, _, _v = _line.partition("=")
                        if _k.strip() and _k.strip() not in os.environ:
                            os.environ[_k.strip()] = _v.strip()
        break

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.health import router as health_router
from routers.orchestration import router as orchestration_router
from routers.models import router as models_router
from routers.documents import router as documents_router
from routers.memory import router as memory_router
from routers.knowledge_graph import router as knowledge_graph_router

app = FastAPI(
	title="NEXUS AI API",
	version="0.1.0",
	description="Core platform API for health, orchestration, and future domain routers.",
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(health_router, prefix="/v1")
app.include_router(orchestration_router, prefix="/v1")
app.include_router(models_router, prefix="/v1")
app.include_router(documents_router, prefix="/v1")
app.include_router(memory_router, prefix="/v1")
app.include_router(knowledge_graph_router, prefix="/v1")


@app.get("/")
def read_root() -> dict[str, str]:
	return {"service": "nexus-api", "status": "online"}
