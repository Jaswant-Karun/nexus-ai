"""
NEXUS AI Service — Orchestration Service
Coordinates multi-agent pipelines, manages execution order,
aggregates results, and handles retries and fallbacks.
"""

from __future__ import annotations

import asyncio
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable


class TaskStatus(str, Enum):
    PENDING    = "pending"
    RUNNING    = "running"
    COMPLETED  = "completed"
    FAILED     = "failed"
    SKIPPED    = "skipped"


@dataclass
class AgentTask:
    id:          str
    name:        str
    fn:          Callable
    args:        tuple    = field(default_factory=tuple)
    kwargs:      dict     = field(default_factory=dict)
    depends_on:  list[str] = field(default_factory=list)
    max_retries: int      = 2
    timeout_s:   float    = 60.0


@dataclass
class TaskResult:
    task_id:    str
    task_name:  str
    status:     TaskStatus
    output:     Any       = None
    error:      str       = ""
    started_at: float     = field(default_factory=time.time)
    ended_at:   float     = 0.0
    retries:    int       = 0

    @property
    def duration_ms(self) -> float:
        return (self.ended_at - self.started_at) * 1000 if self.ended_at else 0.0


class PipelineOrchestrator:
    """Sequential and parallel multi-agent pipeline orchestrator."""

    def __init__(self):
        self._pipeline_id = f"pipeline_{uuid.uuid4().hex[:8]}"
        self._tasks: dict[str, AgentTask] = {}
        self._results: dict[str, TaskResult] = {}

    def register_task(self, task: AgentTask) -> None:
        self._tasks[task.id] = task

    def _can_run(self, task: AgentTask) -> bool:
        for dep_id in task.depends_on:
            dep_result = self._results.get(dep_id)
            if not dep_result or dep_result.status != TaskStatus.COMPLETED:
                return False
        return True

    def run_sequential(self) -> dict[str, TaskResult]:
        """Run all tasks in dependency order."""
        pending  = list(self._tasks.values())
        ran_ids: set[str] = set()

        while pending:
            progress = False
            for task in list(pending):
                if self._can_run(task):
                    result = self._execute(task)
                    self._results[task.id] = result
                    ran_ids.add(task.id)
                    pending.remove(task)
                    progress = True
            if not progress:
                # Remaining tasks are stuck (circular deps / failed deps)
                for task in pending:
                    self._results[task.id] = TaskResult(
                        task_id=task.id, task_name=task.name,
                        status=TaskStatus.SKIPPED,
                        error="Dependency not satisfied or circular dependency detected",
                    )
                break
        return self._results

    def _execute(self, task: AgentTask) -> TaskResult:
        result = TaskResult(task_id=task.id, task_name=task.name,
                            status=TaskStatus.RUNNING, started_at=time.time())
        for attempt in range(task.max_retries + 1):
            try:
                output = task.fn(*task.args, **task.kwargs)
                result.status   = TaskStatus.COMPLETED
                result.output   = output
                result.retries  = attempt
                break
            except Exception as exc:
                result.error   = str(exc)
                result.retries = attempt
                if attempt >= task.max_retries:
                    result.status = TaskStatus.FAILED
        result.ended_at = time.time()
        return result

    def summary(self) -> dict:
        statuses = [r.status for r in self._results.values()]
        return {
            "pipeline_id": self._pipeline_id,
            "total":       len(self._results),
            "completed":   statuses.count(TaskStatus.COMPLETED),
            "failed":      statuses.count(TaskStatus.FAILED),
            "skipped":     statuses.count(TaskStatus.SKIPPED),
            "total_ms":    sum(r.duration_ms for r in self._results.values()),
        }
