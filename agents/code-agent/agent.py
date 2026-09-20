"""NEXUS AI — Code Agent. Uses shared LLM client (Gemini/Claude/OpenAI)."""
from __future__ import annotations
import os, sys, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple

SYSTEM = """You are the NEXUS AI Code Agent — a senior software engineer.
Write clean, type-annotated, documented code with error handling.
Support: Python, TypeScript, Go, SQL, Bash. Follow SOLID principles."""

class CodeAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.1):
        self.model = model; self.temperature = temperature
        self.history: list[dict] = []

    def _call(self, prompt: str, sys_override: str | None = None) -> tuple[str, int]:
        msgs = [{"role": "system", "content": sys_override or SYSTEM}]
        msgs += self.history[-8:]
        msgs.append({"role": "user", "content": prompt})
        ans, tok = _llm(msgs, model=self.model, temperature=self.temperature)
        self.history += [{"role": "user", "content": prompt}, {"role": "assistant", "content": ans}]
        return ans, tok

    def generate(self, spec: str, language: str = "python") -> dict:
        ans, tok = self._call(f"Write production {language} code for:\n{spec}\nInclude type hints, error handling, docstrings.")
        return {"agent": "code-agent", "language": language, "code": self._extract(ans, language), "full_response": ans, "tokens_used": tok}

    def review(self, code: str, language: str = "python") -> dict:
        ans, tok = self._call(f"Review this {language} code. Rate correctness/security/performance/readability 1-10 each.\n```{language}\n{code}\n```")
        return {"agent": "code-agent", "review": ans, "tokens_used": tok}

    def debug(self, code: str, error: str, language: str = "python") -> dict:
        ans, tok = self._call(f"Debug {language} code. Error: {error}\n```{language}\n{code}\n```\nExplain root cause + fixed code.")
        return {"agent": "code-agent", "debug": ans, "tokens_used": tok}

    def refactor(self, code: str, goal: str = "readability") -> dict:
        ans, tok = self._call(f"Refactor for {goal}, keep behaviour:\n{code}")
        return {"agent": "code-agent", "refactored": ans, "tokens_used": tok}

    def write_tests(self, code: str, framework: str = "pytest") -> dict:
        ans, tok = self._call(f"Write {framework} tests (happy path, edge cases, errors):\n{code}")
        return {"agent": "code-agent", "tests": ans, "tokens_used": tok}

    @staticmethod
    def _extract(text: str, lang: str) -> str:
        m = re.search(rf"```{lang}\n(.*?)```", text, re.DOTALL)
        return m.group(1).strip() if m else text.strip()

    def reset(self) -> None: self.history.clear()

def run(task: str, language: str = "python") -> dict:
    return CodeAgent().generate(task, language)
