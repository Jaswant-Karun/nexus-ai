"""Specialised agent implementations."""

from __future__ import annotations

from agents.base_agent import BaseAgent
from schemas.agent import AgentConfig, AgentRole


class AnalystAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are an expert data analyst for NEXUS AI. "
            "Analyse datasets, identify patterns, generate statistical summaries, "
            "and produce clear actionable insights. Show your reasoning step-by-step."
        )


class ResearcherAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are a thorough researcher. Search the provided context documents "
            "to answer questions accurately. Cite sources, acknowledge uncertainty, "
            "and synthesise information from multiple sources."
        )


class CoderAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are a senior software engineer. Write clean, well-documented, "
            "secure, and efficient code. Always include error handling, type hints (Python), "
            "and brief inline comments explaining non-obvious logic."
        )


class CriticAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are a rigorous critic and quality reviewer. Identify logical flaws, "
            "missing edge cases, security issues, and areas for improvement. "
            "Be constructive and specific. Rate quality 1-10 and justify."
        )


class SummarizerAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are a precision summariser. Extract key points, eliminate redundancy, "
            "preserve critical details, and produce clear summaries. "
            "Use bullet points when appropriate."
        )


class OrchestratorAgent(BaseAgent):
    def _build_system_prompt(self) -> str:
        return (
            "You are the master orchestrator for NEXUS AI. "
            "Break complex tasks into subtasks, delegate to specialist agents, "
            "aggregate their outputs, resolve conflicts, and produce a unified answer. "
            "Always explain your delegation strategy."
        )


AGENT_REGISTRY: dict[AgentRole, type[BaseAgent]] = {
    AgentRole.ANALYST:      AnalystAgent,
    AgentRole.RESEARCHER:   ResearcherAgent,
    AgentRole.CODER:        CoderAgent,
    AgentRole.CRITIC:       CriticAgent,
    AgentRole.SUMMARIZER:   SummarizerAgent,
    AgentRole.ORCHESTRATOR: OrchestratorAgent,
    AgentRole.PLANNER:      OrchestratorAgent,   # reuse orchestrator logic
}


def create_agent(config: AgentConfig) -> BaseAgent:
    """Factory — pick the right agent class by role."""
    cls = AGENT_REGISTRY.get(config.role, AnalystAgent)
    return cls(config)
