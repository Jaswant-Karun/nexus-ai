"""
NEXUS AI — Code Agent
Expert software engineer agent for code generation, review,
debugging, refactoring, documentation, and security analysis.
"""

from __future__ import annotations

import os
import re

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

SYSTEM_PROMPT = """You are the NEXUS AI Code Agent — a senior software engineer.
Your expertise:
- Python, TypeScript/JavaScript, Go, Rust, SQL, Bash
- REST API design, microservices, databases
- Security: OWASP Top-10, input validation, auth patterns
- Testing: unit, integration, e2e
- Clean code: SOLID principles, design patterns, refactoring
- Performance optimisation and profiling

Always write:
- Type-annotated Python (PEP 8) and typed TypeScript
- Comprehensive error handling
- Inline documentation for complex logic
- Test cases for critical paths"""


class CodeAgent:
    def __init__(self, model: str = "gpt-4o", temperature: float = 0.1):
        self.model       = model
        self.temperature = temperature
        self.history: list[dict[str, str]] = []

    def _call(self, user_msg: str, system: str | None = None) -> tuple[str, int]:
        messages = [{"role": "system", "content": system or SYSTEM_PROMPT}]
        messages += self.history[-8:]
        messages.append({"role": "user", "content": user_msg})

        resp = client.chat.completions.create(
            model=self.model, messages=messages, temperature=self.temperature
        )
        answer = resp.choices[0].message.content or ""
        tokens = resp.usage.total_tokens if resp.usage else 0
        self.history += [{"role": "user", "content": user_msg},
                         {"role": "assistant", "content": answer}]
        return answer, tokens

    def generate(self, spec: str, language: str = "python") -> dict:
        """Generate code from a specification."""
        answer, tokens = self._call(
            f"Write production-quality {language} code for:\n{spec}\n\n"
            f"Include type hints, error handling, and docstrings."
        )
        code = self._extract_code(answer, language)
        return {"agent": "code-agent", "language": language, "code": code,
                "full_response": answer, "tokens_used": tokens}

    def review(self, code: str, language: str = "python") -> dict:
        """Review code and return findings."""
        answer, tokens = self._call(
            f"Review this {language} code. Check: correctness, security, performance, "
            f"readability, error handling. Rate each 1-10 with specific suggestions.\n\n"
            f"```{language}\n{code}\n```"
        )
        return {"agent": "code-agent", "review": answer, "tokens_used": tokens}

    def debug(self, code: str, error: str, language: str = "python") -> dict:
        """Debug code given an error message."""
        answer, tokens = self._call(
            f"Debug this {language} code. Error: {error}\n\n"
            f"```{language}\n{code}\n```\n\n"
            f"Explain the root cause and provide the fixed code."
        )
        return {"agent": "code-agent", "debug": answer, "tokens_used": tokens}

    def refactor(self, code: str, goal: str = "readability") -> dict:
        """Refactor code for a given goal."""
        answer, tokens = self._call(
            f"Refactor this code to improve {goal}. Keep the same behaviour.\n\n{code}"
        )
        return {"agent": "code-agent", "refactored": answer, "tokens_used": tokens}

    def write_tests(self, code: str, framework: str = "pytest") -> dict:
        """Generate unit tests for the given code."""
        answer, tokens = self._call(
            f"Write comprehensive {framework} tests for:\n\n{code}\n\n"
            f"Cover happy paths, edge cases, and error conditions."
        )
        return {"agent": "code-agent", "tests": answer, "tokens_used": tokens}

    @staticmethod
    def _extract_code(text: str, language: str) -> str:
        pattern = rf"```{language}\n(.*?)```"
        match   = re.search(pattern, text, re.DOTALL)
        return match.group(1).strip() if match else text.strip()

    def reset(self) -> None:
        self.history.clear()


def run(task: str, language: str = "python") -> dict:
    return CodeAgent().generate(task, language)
