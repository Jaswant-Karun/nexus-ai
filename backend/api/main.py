from __future__ import annotations

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
