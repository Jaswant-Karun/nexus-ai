"""Multi-agent orchestration: sequential, parallel, hierarchical."""

from __future__ import annotations

import asyncio
from concurrent.futures import ThreadPoolExecutor

from agents.specialist_agents import create_agent
from schemas.agent import (
    AgentRunRequest, AgentRunResponse, MultiAgentRequest, MultiAgentResponse,
)


def _run_single(request: AgentRunRequest) -> AgentRunResponse:
    agent = create_agent(request.agent)
    return agent.run(request)


class MultiAgentOrchestrator:
    """Run multiple agents on a shared task."""

    # ── Sequential: pass result of agent[n] as context to agent[n+1] ──
    def run_sequential(self, req: MultiAgentRequest) -> MultiAgentResponse:
        results: list[AgentRunResponse] = []
        accumulated_context = list(req.context_docs)

        for cfg in req.agents:
            run_req = AgentRunRequest(
                task=req.task,
                agent=cfg,
                context_docs=accumulated_context,
            )
            result = _run_single(run_req)
            results.append(result)
            # feed each agent's answer as context for the next
            accumulated_context.append(f"[{cfg.name} output]\n{result.answer}")

        final = results[-1].answer if results else ""
        total = sum(r.tokens_used for r in results)
        return MultiAgentResponse(task=req.task, results=results,
                                  final_answer=final, total_tokens=total)

    # ── Parallel: all agents work independently, orchestrator synthesises ──
    def run_parallel(self, req: MultiAgentRequest) -> MultiAgentResponse:
        run_reqs = [
            AgentRunRequest(task=req.task, agent=cfg, context_docs=req.context_docs)
            for cfg in req.agents
        ]

        with ThreadPoolExecutor(max_workers=min(len(run_reqs), 8)) as pool:
            results = list(pool.map(_run_single, run_reqs))

        # synthesise with the first orchestrator-role agent (or last result)
        combined = "\n\n".join(
            f"[{r.agent_id}]: {r.answer}" for r in results
        )
        # Pick the highest-confidence answer as final
        final = max(results, key=lambda r: len(r.answer)).answer
        total = sum(r.tokens_used for r in results)
        return MultiAgentResponse(task=req.task, results=results,
                                  final_answer=final, total_tokens=total)

    # ── Hierarchical: orchestrator delegates to sub-agents ──
    def run_hierarchical(self, req: MultiAgentRequest) -> MultiAgentResponse:
        if not req.agents:
            return MultiAgentResponse(task=req.task, results=[], final_answer="", total_tokens=0)

        orchestrator_cfg = req.agents[0]
        worker_cfgs      = req.agents[1:]

        # 1 — orchestrator plans
        orch_req = AgentRunRequest(
            task=(
                f"You are orchestrating these agents: {[c.name for c in worker_cfgs]}. "
                f"Assign sub-tasks for the goal: {req.task}. "
                "Output a JSON list: [{\"agent\": \"<name>\", \"subtask\": \"...\"}]"
            ),
            agent=orchestrator_cfg,
            context_docs=req.context_docs,
        )
        orch_result = _run_single(orch_req)

        # 2 — workers execute their sub-tasks
        worker_results: list[AgentRunResponse] = []
        for cfg in worker_cfgs:
            sub_task = f"Sub-task for {cfg.name}: {req.task}"
            sub_req  = AgentRunRequest(task=sub_task, agent=cfg,
                                       context_docs=req.context_docs)
            worker_results.append(_run_single(sub_req))

        # 3 — orchestrator synthesises
        synthesis_ctx = [f"[{r.agent_id}]: {r.answer}" for r in worker_results]
        synth_req = AgentRunRequest(
            task=f"Synthesise these outputs into a final answer for: {req.task}",
            agent=orchestrator_cfg,
            context_docs=req.context_docs + synthesis_ctx,
        )
        synth_result = _run_single(synth_req)

        all_results = [orch_result] + worker_results + [synth_result]
        total       = sum(r.tokens_used for r in all_results)
        return MultiAgentResponse(task=req.task, results=all_results,
                                  final_answer=synth_result.answer,
                                  total_tokens=total)

    def run(self, req: MultiAgentRequest) -> MultiAgentResponse:
        strategy = req.strategy.lower()
        if strategy == "parallel":
            return self.run_parallel(req)
        if strategy == "hierarchical":
            return self.run_hierarchical(req)
        return self.run_sequential(req)


orchestrator = MultiAgentOrchestrator()
