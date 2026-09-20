"""
Router — NEXUS Agent endpoints.
Exposes the primary NEXUS conversational agent with session management,
multi-step reasoning, self-reflection, and domain-aware responses.

Endpoints:
  POST /api/v1/nexus-agent/chat         — send a message, get a response
  POST /api/v1/nexus-agent/chat/stream  — streaming SSE response
  GET  /api/v1/nexus-agent/session      — get session info
  DELETE /api/v1/nexus-agent/session    — clear session history
  GET  /api/v1/nexus-agent/info         — agent capabilities info
"""

from __future__ import annotations

import asyncio
import importlib.util
import json
import sys
import time
from pathlib import Path
from typing import Any, AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/nexus-agent", tags=["NEXUS Agent"])

# ── Resolve agents directory ──────────────────────────────────────────────────
_PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
_AGENTS_DIR   = _PROJECT_ROOT / "agents"
sys.path.insert(0, str(_AGENTS_DIR))


def _load_nexus_agent():
    """Dynamically load the NEXUS Agent module."""
    agent_path = _AGENTS_DIR / "nexus-agent" / "agent.py"
    if not agent_path.exists():
        raise ImportError(f"NEXUS Agent not found at {agent_path}")
    spec   = importlib.util.spec_from_file_location("nexus_agent", str(agent_path))
    module = importlib.util.module_from_spec(spec)       # type: ignore[arg-type]
    spec.loader.exec_module(module)                       # type: ignore[union-attr]
    return module


# Cache module after first load
_nexus_module = None

def _get_module():
    global _nexus_module
    if _nexus_module is None:
        _nexus_module = _load_nexus_agent()
    return _nexus_module


# ── Schemas ───────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role:    str   # "user" | "assistant"
    content: str


class NexusChatRequest(BaseModel):
    message:    str
    session_id: str                              = "default"
    history:    list[ChatMessage] | None         = None
    model:      str                              = "gpt-4o"
    reflect:    bool                             = True


class ReasoningStep(BaseModel):
    step:        int
    description: str


class NexusChatResponse(BaseModel):
    answer:           str
    reasoning_steps:  list[str]          = Field(default_factory=list)
    domain:           str                = "general"
    reflection:       str | None         = None
    tokens_used:      int                = 0
    model_used:       str                = ""
    elapsed_seconds:  float              = 0.0
    from_knowledge_base: bool            = False
    session_id:       str                = "default"
    success:          bool               = True


class SessionInfoResponse(BaseModel):
    exists:         bool
    session_id:     str  = ""
    message_count:  int  = 0
    history_length: int  = 0


# ── POST /chat ────────────────────────────────────────────────────────────────
@router.post(
    "/chat",
    response_model=NexusChatResponse,
    summary="Chat with NEXUS Agent",
    description="""
Send a message to the NEXUS Agent and receive a comprehensive, structured response.

The NEXUS Agent features:
- **Domain Detection** — auto-detects code/AI/architecture/math/business queries
- **Chain-of-Thought Reasoning** — multi-step reasoning pre-pass for complex questions
- **Self-Reflection** — quality check pass that critiques and improves the answer
- **Session Memory** — tracks conversation history server-side by session_id
- **Knowledge Base** — instant answers for common NEXUS platform questions
- **Structured Output** — markdown with tables, code blocks, Mermaid diagrams
""",
)
def nexus_chat(req: NexusChatRequest) -> NexusChatResponse:
    try:
        mod = _get_module()
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load NEXUS Agent: {exc}") from exc

    history = None
    if req.history is not None:
        history = [{"role": m.role, "content": m.content} for m in req.history]

    try:
        result = mod.run(
            message=req.message,
            session_id=req.session_id,
            history=history,
            model=req.model,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"NEXUS Agent error: {exc}") from exc

    return NexusChatResponse(
        answer=result.get("answer", ""),
        reasoning_steps=result.get("reasoning_steps", []),
        domain=result.get("domain", "general"),
        reflection=result.get("reflection"),
        tokens_used=result.get("tokens_used", 0),
        model_used=result.get("model_used", ""),
        elapsed_seconds=result.get("elapsed_seconds", 0.0),
        from_knowledge_base=result.get("from_knowledge_base", False),
        session_id=req.session_id,
        success=bool(result.get("answer")),
    )


# ── POST /chat/stream ─────────────────────────────────────────────────────────
@router.post(
    "/chat/stream",
    summary="Stream NEXUS Agent response (SSE)",
    description="Returns Server-Sent Events stream. Each event is a JSON chunk.",
)
async def nexus_chat_stream(req: NexusChatRequest):
    """
    SSE streaming endpoint for NEXUS Agent.
    Events:
      { type: "thinking", steps: [...] }  — reasoning steps (immediate)
      { type: "delta",    content: "..." } — token chunks
      { type: "done",     ...metadata }   — final metadata
      { type: "error",    error: "..." }  — on failure
    """
    try:
        mod = _get_module()
    except ImportError as exc:
        async def error_gen():
            yield f"data: {json.dumps({'type': 'error', 'error': str(exc)})}\n\n"
        return StreamingResponse(error_gen(), media_type="text/event-stream")

    async def generate() -> AsyncGenerator[str, None]:
        try:
            history = None
            if req.history is not None:
                history = [{"role": m.role, "content": m.content} for m in req.history]

            # Run the agent in a thread pool (it's synchronous)
            loop = asyncio.get_event_loop()
            result: dict = await loop.run_in_executor(
                None,
                lambda: mod.run(
                    message=req.message,
                    session_id=req.session_id,
                    history=history,
                    model=req.model,
                ),
            )

            # 1. Send reasoning steps first (instant)
            steps = result.get("reasoning_steps", [])
            if steps:
                yield f"data: {json.dumps({'type': 'thinking', 'steps': steps})}\n\n"
                await asyncio.sleep(0.05)

            # 2. Stream the answer word-by-word for a live feel
            answer: str = result.get("answer", "")
            words = answer.split(" ")
            chunk_size = 6  # words per chunk
            for i in range(0, len(words), chunk_size):
                chunk = " ".join(words[i:i + chunk_size])
                if i + chunk_size < len(words):
                    chunk += " "
                yield f"data: {json.dumps({'type': 'delta', 'content': chunk})}\n\n"
                await asyncio.sleep(0.02)  # ~50 chunks/sec

            # 3. Done event with metadata
            yield f"data: {json.dumps({'type': 'done', 'domain': result.get('domain','general'), 'tokens_used': result.get('tokens_used', 0), 'model_used': result.get('model_used',''), 'elapsed_seconds': result.get('elapsed_seconds', 0), 'reflection': result.get('reflection'), 'from_knowledge_base': result.get('from_knowledge_base', False)})}\n\n"

        except Exception as exc:
            yield f"data: {json.dumps({'type': 'error', 'error': str(exc)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":    "no-cache, no-transform",
            "Connection":       "keep-alive",
            "X-Accel-Buffering":"no",
        },
    )


# ── GET /session ──────────────────────────────────────────────────────────────
@router.get(
    "/session",
    response_model=SessionInfoResponse,
    summary="Get NEXUS Agent session info",
)
def get_session(session_id: str = "default") -> SessionInfoResponse:
    try:
        mod  = _get_module()
        info = mod.get_session_info(session_id)
    except Exception:
        info = {"exists": False, "message_count": 0, "history_length": 0}

    return SessionInfoResponse(
        exists=info.get("exists", False),
        session_id=session_id,
        message_count=info.get("message_count", 0),
        history_length=info.get("history_length", 0),
    )


# ── DELETE /session ───────────────────────────────────────────────────────────
@router.delete(
    "/session",
    summary="Clear NEXUS Agent session history",
)
def clear_session(session_id: str = "default") -> dict:
    try:
        mod     = _get_module()
        cleared = mod.clear_session(session_id)
    except Exception:
        cleared = False
    return {"cleared": cleared, "session_id": session_id}


# ── GET /info ─────────────────────────────────────────────────────────────────
@router.get(
    "/info",
    summary="NEXUS Agent capabilities and status",
)
def agent_info() -> dict:
    from shared.llm_client import provider_info
    pinfo = provider_info()

    return {
        "name":        "NEXUS Agent",
        "version":     "2.0.0",
        "description": "NEXUS AI platform's primary conversational agent with multi-step reasoning, domain detection, self-reflection, and session memory.",
        "capabilities": [
            "Multi-domain knowledge (AI/ML, Software, Math, Business, Science)",
            "Chain-of-Thought reasoning pre-pass",
            "Self-reflection quality check",
            "Conversation session memory (server-side)",
            "Hardcoded knowledge base for instant answers",
            "Domain detection (code, ai_ml, architecture, math, business, explanation, general)",
            "Structured markdown output with Mermaid diagrams",
            "Code generation with type annotations",
            "Architecture diagram generation",
            "Streaming SSE support",
        ],
        "domains": ["code", "ai_ml", "architecture", "math", "business", "explanation", "general"],
        "provider": pinfo["active_provider"],
        "model":    pinfo["active_model"],
        "status":   "online",
        "endpoints": {
            "chat":         "POST /api/v1/nexus-agent/chat",
            "stream":       "POST /api/v1/nexus-agent/chat/stream",
            "session_info": "GET  /api/v1/nexus-agent/session",
            "clear":        "DELETE /api/v1/nexus-agent/session",
        },
    }
