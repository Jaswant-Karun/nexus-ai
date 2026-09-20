"""NEXUS AI — Reasoning Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import os, sys
from enum import Enum
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm

class Strategy(str, Enum):
    COT="chain_of_thought"; REACT="react"; SELF_CONSISTENCY="self_consistency"
    SOCRATIC="socratic"; TREE="tree_of_thought"

_SYS = {
    Strategy.COT:    "Think step-by-step. Label each step. End with CONCLUSION:",
    Strategy.REACT:  "Use Thought→Action→Observation pattern. End with Final Answer:",
    Strategy.SOCRATIC:"Use Socratic questioning, then answer.",
    Strategy.TREE:   "Explore 3 reasoning branches. Pick best. State conclusion.",
    Strategy.SELF_CONSISTENCY: "Reason carefully then give your best answer.",
}

class ReasoningAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.2):
        self.model = model; self.temperature = temperature

    def reason(self, question: str, context: list[str] | None = None,
               strategy: Strategy = Strategy.COT, n_paths: int = 3) -> dict:
        sys_p = _SYS.get(strategy, _SYS[Strategy.COT])
        ctx   = "\n".join(context or [])
        msgs  = [{"role":"system","content":sys_p}]
        if ctx: msgs.append({"role":"system","content":f"Context:\n{ctx}"})
        msgs.append({"role":"user","content":question})

        if strategy == Strategy.SELF_CONSISTENCY:
            answers, total = [], 0
            for _ in range(n_paths):
                a, t = _llm(msgs, model=self.model, temperature=0.7)
                answers.append(a); total += t
            final = max(answers, key=len)
            return {"agent":"reasoning-agent","strategy":strategy,"question":question,
                    "answer":final,"alternatives":answers,"tokens_used":total}

        ans, tok = _llm(msgs, model=self.model, temperature=self.temperature)
        steps = [{"step":i+1,"content":l.strip()} for i,l in enumerate(ans.split("\n")) if l.strip().lower().startswith("step")]
        conclusion = next((l for l in ans.split("\n") if "conclusion" in l.lower() or "final answer" in l.lower()), ans[-200:])
        return {"agent":"reasoning-agent","strategy":strategy,"question":question,
                "answer":ans,"steps":steps,"conclusion":conclusion,"confidence":0.85,"tokens_used":tok}

    def chain_of_thought(self, q: str, ctx: list[str] | None = None) -> dict:
        return self.reason(q, ctx, Strategy.COT)
    def react(self, q: str, ctx: list[str] | None = None) -> dict:
        return self.reason(q, ctx, Strategy.REACT)

def run(question: str, strategy: str = "chain_of_thought") -> dict:
    s = Strategy(strategy) if strategy in Strategy._value2member_map_ else Strategy.COT
    return ReasoningAgent().reason(question, strategy=s)
