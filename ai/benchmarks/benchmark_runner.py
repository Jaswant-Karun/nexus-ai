"""
NEXUS AI — Benchmark Runner
Evaluate model and agent performance on standardised benchmarks.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class BenchmarkCase:
    id:       str
    input:    Any
    expected: Any
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class BenchmarkResult:
    case_id:   str
    predicted: Any
    expected:  Any
    correct:   bool
    latency_ms: float
    tokens_used: int = 0
    error:      str  = ""


class BenchmarkRunner:
    """Run a suite of test cases and compute performance metrics."""

    def __init__(self, name: str, cases: list[BenchmarkCase]):
        self.name    = name
        self.cases   = cases
        self.results: list[BenchmarkResult] = []

    def run(self, predict_fn: Callable[[Any], Any],
            score_fn: Callable[[Any, Any], bool] | None = None) -> dict:
        """Run all cases through predict_fn and compute metrics."""
        if score_fn is None:
            score_fn = lambda pred, exp: str(pred).strip() == str(exp).strip()  # noqa: E731

        self.results.clear()
        for case in self.cases:
            start = time.perf_counter()
            error = ""
            try:
                predicted = predict_fn(case.input)
            except Exception as exc:
                predicted = None
                error     = str(exc)
            latency = (time.perf_counter() - start) * 1000
            correct = score_fn(predicted, case.expected) if not error else False
            self.results.append(BenchmarkResult(
                case_id=case.id, predicted=predicted, expected=case.expected,
                correct=correct, latency_ms=latency, error=error,
            ))

        return self.metrics()

    def metrics(self) -> dict:
        if not self.results:
            return {"name": self.name, "count": 0}
        correct  = sum(r.correct for r in self.results)
        total    = len(self.results)
        latencies = [r.latency_ms for r in self.results]
        return {
            "name":         self.name,
            "total":        total,
            "correct":      correct,
            "accuracy":     round(correct / total, 4),
            "avg_latency_ms": round(sum(latencies) / total, 2),
            "p95_latency_ms": round(sorted(latencies)[int(total * 0.95)], 2),
            "errors":       sum(bool(r.error) for r in self.results),
        }
