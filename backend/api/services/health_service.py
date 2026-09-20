from __future__ import annotations

import os
import time
from datetime import datetime, timezone

from schemas.health import HealthDependency, HealthResponse


def _ms() -> int:
    """Return a fake-but-realistic latency for each dependency."""
    return int(time.time() * 1000) % 30 + 5


def _check_providers() -> dict[str, bool]:
    """
    Check which AI provider API keys are actually configured.
    Reads directly from environment variables (loaded from .env / .env.local
    by the process that starts the API server).
    """
    return {
        "openai":    bool(os.getenv("OPENAI_API_KEY",    "").strip()),
        "anthropic": bool(os.getenv("ANTHROPIC_API_KEY", "").strip()),
        "google":    bool(os.getenv("GOOGLE_AI_API_KEY", "").strip()),
        "xai":       bool(os.getenv("XAI_API_KEY",       "").strip()),
        "deepseek":  bool(os.getenv("DEEPSEEK_API_KEY",  "").strip()),
    }


def _check_dependencies() -> list[HealthDependency]:
    """
    Attempt real connectivity checks.
    Falls back to a 'degraded' status if a service is unreachable so the
    API itself never crashes on startup.
    """
    deps: list[HealthDependency] = []

    # ── PostgreSQL ────────────────────────────────────────────────────────────
    try:
        import psycopg2  # type: ignore[import-untyped]
        db_url = os.getenv("DATABASE_URL", "")
        start  = time.monotonic()
        conn   = psycopg2.connect(db_url, connect_timeout=3)
        conn.close()
        latency = int((time.monotonic() - start) * 1000)
        deps.append(HealthDependency(name="postgres", status="ready", latency_ms=latency))
    except Exception:
        deps.append(HealthDependency(name="postgres", status="degraded", latency_ms=0))

    # ── Redis ─────────────────────────────────────────────────────────────────
    try:
        import redis as redis_lib  # type: ignore[import-untyped]
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        start     = time.monotonic()
        r         = redis_lib.from_url(redis_url, socket_connect_timeout=2)
        r.ping()
        latency = int((time.monotonic() - start) * 1000)
        deps.append(HealthDependency(name="redis", status="ready", latency_ms=latency))
    except Exception:
        deps.append(HealthDependency(name="redis", status="degraded", latency_ms=0))

    # ── Vector store (Qdrant) ─────────────────────────────────────────────────
    try:
        import urllib.request
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        start      = time.monotonic()
        urllib.request.urlopen(f"{qdrant_url}/readyz", timeout=2)
        latency = int((time.monotonic() - start) * 1000)
        deps.append(HealthDependency(name="vector-store", status="ready", latency_ms=latency))
    except Exception:
        deps.append(HealthDependency(name="vector-store", status="degraded", latency_ms=0))

    return deps


def build_health_response() -> HealthResponse:
    providers    = _check_providers()
    dependencies = _check_dependencies()

    # Overall status: healthy if all deps are ready, else degraded
    all_ready = all(d.status == "ready" for d in dependencies)
    status    = "healthy" if all_ready else "degraded"

    return HealthResponse(
        service="nexus-api",
        status=status,
        version="0.1.0",
        checked_at=datetime.now(timezone.utc),
        dependencies=dependencies,
        providers=providers,
    )
