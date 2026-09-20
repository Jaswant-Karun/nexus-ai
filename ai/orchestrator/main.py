from __future__ import annotations

from fastapi import FastAPI

from routers.orchestration import router as orchestration_router

app = FastAPI(
	title="NEXUS AI Orchestrator",
	version="0.1.0",
	description="Planning and routing layer for the NEXUS AI agent mesh.",
)

app.include_router(orchestration_router, prefix="/v1")


@app.get("/")
def read_root() -> dict[str, str]:
	return {"service": "orchestrator", "status": "online"}
