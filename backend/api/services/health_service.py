from __future__ import annotations

from datetime import datetime, timezone

from schemas.health import HealthDependency, HealthResponse


def build_health_response() -> HealthResponse:
    return HealthResponse(
        service="nexus-api",
        status="healthy",
        version="0.1.0",
        checked_at=datetime.now(timezone.utc),
        dependencies=[
            HealthDependency(name="postgres", status="ready", latency_ms=12),
            HealthDependency(name="redis", status="ready", latency_ms=4),
            HealthDependency(name="vector-store", status="ready", latency_ms=18),
        ],
    )
