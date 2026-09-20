from __future__ import annotations

from fastapi import FastAPI

from routers.inference import router as inference_router

app = FastAPI(
	title="NEXUS AI Service",
	version="0.1.0",
	description="Inference and response generation surface for the NEXUS AI platform.",
)

app.include_router(inference_router, prefix="/v1")


@app.get("/")
def read_root() -> dict[str, str]:
	return {"service": "ai-service", "status": "online"}
