from __future__ import annotations

from fastapi import FastAPI

from routers.health import router as health_router
from routers.orchestration import router as orchestration_router
from routers.models import router as models_router

app = FastAPI(
	title="NEXUS AI API",
	version="0.1.0",
	description="Core platform API for health, orchestration, and future domain routers.",
)

app.include_router(health_router, prefix="/v1")
app.include_router(orchestration_router, prefix="/v1")
app.include_router(models_router, prefix="/v1")


@app.get("/")
def read_root() -> dict[str, str]:
	return {"service": "nexus-api", "status": "online"}
