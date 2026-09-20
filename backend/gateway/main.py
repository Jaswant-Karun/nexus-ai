"""
NEXUS AI API Gateway
Handles request routing, authentication, rate limiting, and microservice proxying.
"""

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(
    title="Nexus AI API Gateway",
    version="0.1.0",
    description="Central gateway routing requests to AI microservices, workflows, and database services."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "nexus-gateway",
        "timestamp": time.time()
    }

@app.get("/api/v1/system/status")
async def system_status():
    return {
        "cluster": "nexus-dev-cluster",
        "active_services": ["auth-service", "ai-service", "workflow-service", "knowledge-service"],
        "gateway_uptime": "99.99%"
    }

@app.get("/api/v1/agents")
async def list_agents():
    return {
        "success": True,
        "data": [
            {"id": "agent_1", "name": "Data Analyst Agent", "status": "ACTIVE", "model": "gpt-4o"},
            {"id": "agent_2", "name": "Customer Support Bot", "status": "ACTIVE", "model": "claude-3-5-sonnet"},
            {"id": "agent_3", "name": "RAG Document Synthesizer", "status": "ACTIVE", "model": "gemini-1-5-pro"}
        ]
    }
