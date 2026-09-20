"""
NEXUS AI Service — Experiment Tracker
Track AI experiments: prompt variants, model comparisons, A/B tests.
"""

from __future__ import annotations

import hashlib
import json
import time
from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class Experiment:
    id:          str
    name:        str
    description: str
    config:      dict[str, Any]
    results:     list[dict[str, Any]] = field(default_factory=list)
    created_at:  float = field(default_factory=time.time)
    status:      str   = "running"   # running | completed | failed


class ExperimentTracker:
    def __init__(self):
        self._experiments: dict[str, Experiment] = {}

    def start(self, name: str, description: str = "",
              config: dict | None = None) -> str:
        exp_id = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()[:12]
        self._experiments[exp_id] = Experiment(
            id=exp_id, name=name, description=description,
            config=config or {},
        )
        return exp_id

    def log(self, exp_id: str, metrics: dict[str, Any],
            step: int | None = None) -> None:
        if exp_id in self._experiments:
            self._experiments[exp_id].results.append({
                "step":      step,
                "metrics":   metrics,
                "logged_at": time.time(),
            })

    def finish(self, exp_id: str, status: str = "completed") -> None:
        if exp_id in self._experiments:
            self._experiments[exp_id].status = status

    def get(self, exp_id: str) -> Experiment | None:
        return self._experiments.get(exp_id)

    def compare(self, exp_ids: list[str], metric: str) -> list[dict]:
        rows = []
        for eid in exp_ids:
            exp = self._experiments.get(eid)
            if not exp:
                continue
            values = [r["metrics"].get(metric) for r in exp.results
                      if metric in r.get("metrics", {})]
            rows.append({
                "id":     eid,
                "name":   exp.name,
                "metric": metric,
                "values": values,
                "best":   max(values) if values else None,
            })
        return rows

    def list_experiments(self) -> list[dict]:
        return [{"id": e.id, "name": e.name, "status": e.status,
                 "run_count": len(e.results)} for e in self._experiments.values()]


tracker = ExperimentTracker()
