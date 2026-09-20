"""
NEXUS AI — NEXUS Agent  (Llama 3.2 via Ollama — No API Key Required)
=====================================================================
Powered by Llama 3.2 (3.2B parameters) running locally via Ollama.
Zero API keys, zero cost, 100% offline capable.

Requirements:
  - Ollama running: https://ollama.com
  - Model pulled:   ollama pull llama3.2

Architecture:
  User Message
      ↓
  Domain Detection  (local Python — instant)
      ↓
  Chain-of-Thought pre-pass (Llama 3.2 — local)
      ↓
  Main Answer Generation (Llama 3.2 — local, streaming)
      ↓
  Self-Reflection check (Llama 3.2 — local)
      ↓
  Structured Response
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from typing import Any, Generator

# ─────────────────────────────────────────────────────────────────────────────
# OLLAMA CONFIG
# ─────────────────────────────────────────────────────────────────────────────
OLLAMA_BASE  = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL",    "llama3.2")

# ─────────────────────────────────────────────────────────────────────────────
# NEXUS SYSTEM PROMPT — defines identity, knowledge & response style
# This is what "trains" the bot's behaviour (prompt engineering)
# ─────────────────────────────────────────────────────────────────────────────
NEXUS_SYSTEM = """You are NEXUS — the intelligent AI assistant of the NEXUS AI platform, \
built by Jaswant Karun. You are powered by Llama 3.2, a real neural network running \
locally on this machine — no internet or API keys needed.

IDENTITY:
- Name: NEXUS (Neural EXpert Unified System)
- Engine: Llama 3.2 (3.2B parameters, Meta AI) — running 100% locally via Ollama
- Platform: NEXUS AI (Next.js 15 + FastAPI + PostgreSQL + 14 Python agents)
- Role: Multi-domain AI assistant for engineers, analysts, and researchers

KNOWLEDGE DOMAINS:
1. SOFTWARE ENGINEERING — Python, TypeScript, JavaScript, SQL, Go, Rust, Bash
   Frameworks: Next.js 15, React, FastAPI, Django, Node.js, Express
   Databases: PostgreSQL, pgvector, Redis, MongoDB, SQLite
   DevOps: Docker, Kubernetes, GitHub Actions, Terraform, AWS, GCP
2. ARTIFICIAL INTELLIGENCE — LLMs, RAG, embeddings, fine-tuning, LoRA, RLHF
   Models: GPT-4o, Claude, Gemini, Llama 3, Mistral, Phi-3
   Frameworks: LangChain, LlamaIndex, PyTorch, TensorFlow, Hugging Face
3. DATA SCIENCE — NumPy, Pandas, Scikit-learn, statistics, ML algorithms
4. MATHEMATICS — algebra, calculus, probability, linear algebra, combinatorics
5. SCIENCE — physics, chemistry, biology fundamentals
6. BUSINESS — SaaS metrics, product management, startup strategy, OKRs
7. SECURITY — OWASP Top 10, JWT, OAuth2, RBAC, container security
8. GENERAL KNOWLEDGE — history, geography, language, culture, current concepts

RESPONSE FORMAT:
- Always start with a direct one-sentence answer
- Use ## and ### markdown headers to structure long responses
- Use ```language code blocks for ALL code (never inline code for multi-line)
- Use markdown tables for comparisons and specifications
- Use Mermaid diagrams for architecture and flow explanations:
  ```mermaid
  graph TD
    A[Input] --> B[Process] --> C[Output]
  ```
- End technical answers with "💡 Key Takeaway:" summarising the main insight
- Be thorough but focused — quality over length
- Never say "I cannot" for general knowledge — always try to answer
- If unsure, say so clearly rather than making things up

PERSONALITY:
- Direct and precise like a senior engineer
- Helpful and encouraging like a mentor
- Honest about limitations (you are a 3.2B parameter model)
- Structured and clear in all responses"""


# ─────────────────────────────────────────────────────────────────────────────
# DOMAIN DETECTION — local Python, no model call needed
# ─────────────────────────────────────────────────────────────────────────────
_DOMAINS: list[tuple[str, re.Pattern]] = [
    ("code",         re.compile(r"\b(code|function|class|debug|error|bug|typescript|python|javascript|sql|api|backend|frontend|component|hook|async|await|promise|algorithm|implement|write|script|program|syntax)\b", re.I)),
    ("ai_ml",        re.compile(r"\b(ai|artificial intelligence|machine learning|llm|gpt|gemini|claude|llama|embedding|rag|fine.?tun|neural|transformer|vector|agent|model|train|inference|deep learning)\b", re.I)),
    ("architecture", re.compile(r"\b(architect|design pattern|system|microservice|monolith|database|schema|infrastructure|scalab|deploy|devops|kubernetes|docker|cloud|aws|distributed)\b", re.I)),
    ("math",         re.compile(r"\b(math|mathematics|calculus|algebra|equation|probability|statistic|matrix|derivative|integral|formula|compute|calculate|geometry|trigonometry)\b", re.I)),
    ("science",      re.compile(r"\b(physics|chemistry|biology|quantum|molecule|atom|cell|evolution|relativity|force|energy|wave)\b", re.I)),
    ("business",     re.compile(r"\b(business|product|startup|revenue|metric|saas|mrr|arr|churn|cac|ltv|roadmap|strategy|market|investment|finance)\b", re.I)),
    ("explanation",  re.compile(r"\b(explain|what is|what are|what does|how does|how do|why is|why does|difference between|compare|versus|vs\.?|pros|cons|when to use|meaning of|define)\b", re.I)),
]

def detect_domain(query: str) -> str:
    scores: dict[str, int] = {}
    for domain, pat in _DOMAINS:
        n = len(pat.findall(query))
        if n:
            scores[domain] = n
    return max(scores, key=scores.get) if scores else "general"  # type: ignore[arg-type]


# ─────────────────────────────────────────────────────────────────────────────
# OLLAMA HTTP CLIENT
# ─────────────────────────────────────────────────────────────────────────────
def ollama_available() -> bool:
    """Check if Ollama is running and the model is available."""
    try:
        req = urllib.request.Request(f"{OLLAMA_BASE}/api/tags")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            models = [m.get("name", "") for m in data.get("models", [])]
            return any(OLLAMA_MODEL in m for m in models)
    except Exception:
        return False


def ollama_chat(
    messages: list[dict],
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> tuple[str, int]:
    """
    Send messages to Ollama and return (full_text, estimated_tokens).
    Uses the /api/chat endpoint (OpenAI-compatible format).
    """
    payload = json.dumps({
        "model":    OLLAMA_MODEL,
        "messages": messages,
        "stream":   False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "top_p":       0.9,
            "repeat_penalty": 1.1,
        },
    }).encode()

    req = urllib.request.Request(
        f"{OLLAMA_BASE}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())

    content = data.get("message", {}).get("content", "") or ""
    # Estimate tokens from response metadata
    tokens = (
        data.get("prompt_eval_count", 0) +
        data.get("eval_count", 0)
    ) or max(1, len(content) // 4)

    return content.strip(), tokens


def ollama_chat_stream(
    messages: list[dict],
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> Generator[str, None, None]:
    """
    Stream tokens from Ollama. Yields text chunks as they arrive.
    Uses the /api/chat streaming endpoint.
    """
    payload = json.dumps({
        "model":    OLLAMA_MODEL,
        "messages": messages,
        "stream":   True,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "top_p":       0.9,
            "repeat_penalty": 1.1,
        },
    }).encode()

    req = urllib.request.Request(
        f"{OLLAMA_BASE}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        for line in resp:
            line = line.strip()
            if not line:
                continue
            try:
                chunk = json.loads(line)
                text = chunk.get("message", {}).get("content", "")
                if text:
                    yield text
                if chunk.get("done"):
                    break
            except json.JSONDecodeError:
                continue


# ─────────────────────────────────────────────────────────────────────────────
# DOMAIN-SPECIFIC INSTRUCTIONS
# ─────────────────────────────────────────────────────────────────────────────
_DOMAIN_INSTR: dict[str, str] = {
    "code":         "Programming question: provide complete working code with imports, type hints, error handling, and a usage example. Explain key decisions briefly.",
    "ai_ml":        "AI/ML question: be precise about model names, parameters, and trade-offs. Include architecture diagram if helpful.",
    "architecture": "System design question: include a Mermaid diagram for components/data flow. Discuss scalability and failure modes.",
    "math":         "Mathematics question: show step-by-step derivation. Verify the result. Explain the intuition.",
    "science":      "Science question: explain with clear concepts, relevant formulas, and real-world examples.",
    "business":     "Business question: give actionable, data-driven insights. Include metrics and a comparison table.",
    "explanation":  "Explanation/comparison: start with one-line answer, use a table if comparing, give a real-world analogy.",
    "general":      "General question: give a comprehensive, structured answer with headers and concrete examples.",
}

# ─────────────────────────────────────────────────────────────────────────────
# CHAIN-OF-THOUGHT REASONING (Llama 3.2 pre-pass)
# ─────────────────────────────────────────────────────────────────────────────
def reason(message: str, domain: str) -> list[str]:
    """
    Ask Llama 3.2 to generate 3 reasoning steps before answering.
    This improves answer quality for complex questions.
    """
    prompt = (
        f"Before answering, think through this {domain} question in exactly 3 steps.\n"
        f"Question: {message}\n\n"
        "Format your response as:\n"
        "Step 1: [what the question is really asking]\n"
        "Step 2: [key concepts or approaches to consider]\n"
        "Step 3: [how to structure the best answer]\n\n"
        "Keep each step to ONE sentence. Be specific."
    )
    try:
        raw, _ = ollama_chat(
            [{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=300,
        )
        steps = []
        for line in raw.split("\n"):
            m = re.match(r"^Step\s*\d+:?\s*(.+)", line.strip(), re.I)
            if m:
                steps.append(m.group(1).strip())
        return steps[:3] if steps else []
    except Exception:
        return []


# ─────────────────────────────────────────────────────────────────────────────
# SELF-REFLECTION (Llama 3.2 reviews its own answer)
# ─────────────────────────────────────────────────────────────────────────────
def reflect(question: str, answer: str, domain: str) -> str:
    """
    Llama 3.2 reviews its own answer for accuracy and completeness.
    Returns a one-sentence quality note.
    """
    prompt = (
        f"You just answered a {domain} question. Briefly review your answer.\n"
        f"Question: {question[:200]}\n"
        f"Your answer (preview): {answer[:400]}\n\n"
        "In ONE sentence: was your answer accurate and complete? "
        "What would make it better? Be self-critical but concise."
    )
    try:
        note, _ = ollama_chat(
            [{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=120,
        )
        return note.strip()
    except Exception:
        return "Answer reviewed — response complete."


# ─────────────────────────────────────────────────────────────────────────────
# MAIN NEXUS AGENT CLASS
# ─────────────────────────────────────────────────────────────────────────────
class NexusAgent:
    """
    NEXUS Agent powered by Llama 3.2 (local, no API key).

    Pipeline:
      1. Detect domain (local regex)
      2. Reason (Llama 3.2 — 3 CoT steps)
      3. Generate answer (Llama 3.2 — full response)
      4. Reflect (Llama 3.2 — quality check)
    """

    def __init__(self, temperature: float = 0.7, max_tokens: int = 2048):
        self.temperature = temperature
        self.max_tokens  = max_tokens

    def build_messages(
        self,
        message: str,
        history: list[dict],
        domain_instr: str,
    ) -> list[dict]:
        msgs: list[dict] = [
            {
                "role":    "system",
                "content": NEXUS_SYSTEM + f"\n\nCurrent query type: {domain_instr}",
            }
        ]
        # Add conversation history (last 8 turns = 4 user + 4 assistant)
        for h in history[-8:]:
            role    = h.get("role", "user")
            content = h.get("content", "")
            if role in ("user", "assistant") and content:
                msgs.append({"role": role, "content": content})
        msgs.append({"role": "user", "content": message})
        return msgs

    def chat(
        self,
        message:  str,
        history:  list[dict] | None = None,
        do_reflect: bool = True,
    ) -> dict[str, Any]:
        t0     = time.time()
        domain = detect_domain(message)
        instr  = _DOMAIN_INSTR.get(domain, _DOMAIN_INSTR["general"])

        # Step 1: CoT reasoning pre-pass (only for complex queries)
        steps: list[str] = []
        is_complex = bool(re.search(
            r"\b(compare|explain|design|implement|why|how|difference|should i|pros|cons|build|create)\b",
            message, re.I,
        ))
        if is_complex:
            steps = reason(message, domain)

        # Step 2: Generate main answer
        messages = self.build_messages(message, history or [], instr)
        answer, tokens = ollama_chat(
            messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )

        # Step 3: Self-reflection
        reflection: str | None = None
        if do_reflect and len(answer) > 150:
            reflection = reflect(message, answer, domain)

        # Clean up output
        answer = re.sub(r"\n{3,}", "\n\n", answer).strip()

        return {
            "answer":          answer,
            "reasoning_steps": steps,
            "domain":          domain,
            "reflection":      reflection,
            "tokens_used":     tokens,
            "model_used":      f"llama3.2 (local)",
            "elapsed_seconds": round(time.time() - t0, 2),
        }


# ─────────────────────────────────────────────────────────────────────────────
# SESSION MANAGER — server-side conversation memory
# ─────────────────────────────────────────────────────────────────────────────
class NexusSession:
    def __init__(self, session_id: str):
        self.session_id    = session_id
        self.agent         = NexusAgent()
        self.history:      list[dict] = []
        self.created_at    = time.time()
        self.message_count = 0

    def send(self, message: str) -> dict[str, Any]:
        result = self.agent.chat(message, history=self.history)

        self.history.append({"role": "user",      "content": message})
        self.history.append({"role": "assistant",  "content": result["answer"]})
        # Keep last 20 messages (10 turns)
        if len(self.history) > 20:
            self.history = self.history[-20:]
        self.message_count += 1
        return result


_sessions: dict[str, NexusSession] = {}


def get_or_create_session(session_id: str) -> NexusSession:
    if session_id not in _sessions:
        _sessions[session_id] = NexusSession(session_id)
    return _sessions[session_id]


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API — called by FastAPI router and direct imports
# ─────────────────────────────────────────────────────────────────────────────
def run(
    message:    str,
    session_id: str             = "default",
    history:    list[dict] | None = None,
    **_kwargs: Any,
) -> dict[str, Any]:
    """
    Main entry point.
    - If history is provided → one-shot mode (no session state)
    - Otherwise → session mode (history tracked server-side by session_id)
    """
    if history is not None:
        agent = NexusAgent()
        return agent.chat(message, history=history)
    return get_or_create_session(session_id).send(message)


def clear_session(session_id: str) -> bool:
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False


def get_session_info(session_id: str) -> dict:
    s = _sessions.get(session_id)
    if not s:
        return {"exists": False, "message_count": 0, "history_length": 0}
    return {
        "exists":         True,
        "session_id":     session_id,
        "message_count":  s.message_count,
        "history_length": len(s.history),
        "created_at":     s.created_at,
    }


def get_model_info() -> dict:
    return {
        "model":       OLLAMA_MODEL,
        "base_url":    OLLAMA_BASE,
        "available":   ollama_available(),
        "provider":    "ollama",
        "description": "Llama 3.2 (3.2B) — Meta AI open-source model, runs 100% locally",
        "no_api_key":  True,
    }
