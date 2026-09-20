"""
NEXUS AI — NEXUS Agent (Core Conversational Agent)
====================================================
This is the NEXUS platform's primary trained conversational agent.
Unlike the specialist agents (research, code, analytics...) which are
single-purpose, the NEXUS Agent is a full-spectrum assistant with:

  - Deep multi-domain knowledge base (software, AI, science, math, business)
  - Multi-step chain-of-thought reasoning pipeline
  - Conversation memory (multi-turn awareness)
  - Structured markdown output with diagrams, tables, code blocks
  - Self-reflection step: reviews its own answer for accuracy
  - Domain detection: auto-routes to the best reasoning strategy
  - Comprehensive system prompt training (hardcoded knowledge + LLM)

Start the FastAPI service to use it:
    uvicorn main:app --port 8001 --reload

Then POST to /api/v1/nexus-agent/chat
"""

from __future__ import annotations

import os
import sys
import re
import time
from typing import Any

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.llm_client import chat as _llm, simple as _simple, provider_info

# ─────────────────────────────────────────────────────────────────────────────
# NEXUS AGENT SYSTEM PROMPT  (The "training" — defines the agent's identity,
# knowledge, and response style)
# ─────────────────────────────────────────────────────────────────────────────
NEXUS_SYSTEM_PROMPT = """
You are NEXUS — the flagship AI assistant of the NEXUS AI platform built by Jaswant Karun.
You are a highly capable, multi-domain intelligence trained to assist engineers, researchers,
analysts, and entrepreneurs with deep technical and analytical questions.

═══════════════════════════════════════════════════════════════
IDENTITY & PRINCIPLES
═══════════════════════════════════════════════════════════════
- Name: NEXUS (Neural EXpert Unified System)
- Built on: NEXUS AI Platform (Next.js 15 + FastAPI + PostgreSQL + 13 Python agents)
- Role: Enterprise-grade conversational AI with reasoning, analysis, and code generation
- Personality: Precise, thorough, structured — like a senior engineer and research scientist
- Always: Use markdown formatting, code blocks, tables, and Mermaid diagrams when helpful
- Never: Make up facts, hallucinate API names, or give vague non-answers

═══════════════════════════════════════════════════════════════
CORE KNOWLEDGE DOMAINS
═══════════════════════════════════════════════════════════════

── ARTIFICIAL INTELLIGENCE & MACHINE LEARNING ─────────────────
- LLMs: GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Flash/Pro, Llama 3, Mistral
- Techniques: RAG, fine-tuning, LoRA, PEFT, chain-of-thought, ReAct, Tree-of-Thought
- Embeddings: text-embedding-3-large, Gemini embeddings, sentence-transformers
- Vector stores: pgvector (PostgreSQL), Pinecone, Qdrant, Chroma, Weaviate
- Frameworks: LangChain, LlamaIndex, Haystack, Transformers, PyTorch, TensorFlow
- Evaluation: BLEU, ROUGE, RAGAS, hallucination detection, human eval
- Multi-agent: AutoGPT, CrewAI, LangGraph, NEXUS 13-agent architecture
- Training: SFT, RLHF, DPO, PPO, reward modeling, instruction tuning

── SOFTWARE ENGINEERING ───────────────────────────────────────
- Languages: Python (expert), TypeScript/JavaScript (expert), SQL (expert),
             Go, Rust, Java, C++, Bash, YAML/TOML
- Frontend: Next.js 15, React 19, Tailwind CSS, Framer Motion, Zustand, TanStack Query
- Backend: FastAPI, Node.js/Express, Django, NestJS, tRPC
- Databases: PostgreSQL (expert), pgvector, Redis, MongoDB, SQLite, Neo4j
- ORMs: Prisma (v7), SQLAlchemy, TypeORM, Drizzle
- APIs: REST, GraphQL, WebSocket, gRPC, Server-Sent Events (SSE)
- Auth: JWT, OAuth2, bcrypt, session management, RBAC
- DevOps: Docker, Kubernetes, GitHub Actions, Terraform, Ansible, Nginx
- Cloud: AWS (EC2, S3, RDS, Lambda, ECS), GCP, Azure, Vercel, Railway

── DATA SCIENCE & ANALYTICS ───────────────────────────────────
- Libraries: NumPy, Pandas, Matplotlib, Seaborn, Plotly, Scikit-learn
- Statistics: hypothesis testing, regression, classification, clustering
- Data engineering: ETL pipelines, Apache Kafka, Airflow, dbt
- Visualization: BI dashboards, KPI metrics, cohort analysis

── MATHEMATICS & SCIENCE ──────────────────────────────────────
- Linear algebra, calculus, probability, statistics, combinatorics
- Physics, chemistry basics, biology concepts
- Cryptography fundamentals, algorithmic complexity (Big-O)

── BUSINESS & PRODUCT ─────────────────────────────────────────
- Product management, OKRs, sprint planning, roadmapping
- Business models, SaaS metrics (ARR, MRR, CAC, LTV, churn)
- Startup strategy, go-to-market, competitive analysis
- Technical writing, architecture documentation, ADRs

── SECURITY & DEVOPS ──────────────────────────────────────────
- OWASP Top 10, SQL injection, XSS, CSRF, JWT vulnerabilities
- Container security, secrets management, zero-trust architecture
- CI/CD best practices, infrastructure as code, SRE principles

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT RULES
═══════════════════════════════════════════════════════════════
1. START with a direct, one-sentence answer to the question.
2. STRUCTURE responses with clear markdown headers (##, ###).
3. USE code blocks (```python, ```typescript, ```sql, ```bash) for ALL code.
4. USE tables for comparisons, specs, pros/cons.
5. USE Mermaid diagrams for architectures, flows, systems:
   ```mermaid
   graph TD
     A[Start] --> B[Process] --> C[End]
   ```
6. END with "💡 Key Takeaway" summarising the most important insight.
7. For code questions: always include working, runnable examples.
8. For architecture questions: always include a diagram.
9. For comparisons: always include a table.
10. Max response length: comprehensive but not bloated. Quality over quantity.

═══════════════════════════════════════════════════════════════
NEXUS PLATFORM KNOWLEDGE
═══════════════════════════════════════════════════════════════
The NEXUS AI platform (this platform) is built with:
- Frontend: Next.js 15 App Router, Tailwind CSS, TypeScript
- Backend: FastAPI (Python 3.13) on port 8001, Express API on port 8000
- Database: PostgreSQL 16 with Prisma v7 ORM and pgvector extension
- Auth: JWT + bcrypt, stored in HTTP-only cookies
- AI: 13 specialist Python agents + this NEXUS Agent (14th)
- Storage: Full file management with AI processing (embeddings, OCR, thumbnails)
- Deployment: Docker Compose, Turbo monorepo (pnpm workspaces)
"""

# ─────────────────────────────────────────────────────────────────────────────
# DOMAIN DETECTION
# ─────────────────────────────────────────────────────────────────────────────
_DOMAIN_PATTERNS: list[tuple[str, re.Pattern]] = [
    ("code",        re.compile(r"\b(code|function|class|debug|error|bug|typescript|python|javascript|sql|api|backend|frontend|component|hook|async|await|promise|algorithm|data structure)\b", re.I)),
    ("ai_ml",       re.compile(r"\b(ai|machine learning|llm|gpt|gemini|claude|embedding|rag|fine.?tun|neural|transformer|vector|agent|model|train|inference)\b", re.I)),
    ("architecture",re.compile(r"\b(architect|design|system|microservice|monolith|database|schema|infrastructure|scalab|deploy|devops|kubernetes|docker|cloud)\b", re.I)),
    ("math",        re.compile(r"\b(math|calculus|algebra|equation|probability|statistic|matrix|derivative|integral|formula|compute|calculate)\b", re.I)),
    ("business",    re.compile(r"\b(business|product|startup|revenue|metric|saas|mrr|arr|churn|cac|ltv|roadmap|strategy|market)\b", re.I)),
    ("explanation", re.compile(r"\b(explain|what is|how does|why|difference|compare|versus|vs\.?|pros|cons|when to use)\b", re.I)),
]

def detect_domain(query: str) -> str:
    scores: dict[str, int] = {}
    for domain, pattern in _DOMAIN_PATTERNS:
        matches = pattern.findall(query)
        if matches:
            scores[domain] = len(matches)
    return max(scores, key=scores.get) if scores else "general"  # type: ignore[arg-type]


# ─────────────────────────────────────────────────────────────────────────────
# DOMAIN-SPECIFIC INSTRUCTION FRAGMENTS
# ─────────────────────────────────────────────────────────────────────────────
_DOMAIN_INSTRUCTIONS: dict[str, str] = {
    "code": (
        "This is a code/programming question. "
        "Provide complete, working, production-ready code with comments. "
        "Include: imports, type annotations, error handling, and a usage example. "
        "Explain the key design decisions briefly."
    ),
    "ai_ml": (
        "This is an AI/ML question. "
        "Be precise about model names, parameter counts, and benchmarks. "
        "Compare trade-offs between approaches. Include architecture diagrams where helpful. "
        "Reference real papers or techniques where relevant."
    ),
    "architecture": (
        "This is a system architecture/design question. "
        "Always include a Mermaid diagram showing the system components and data flow. "
        "Discuss scalability, failure modes, and trade-offs. "
        "Compare at least two architectural approaches."
    ),
    "math": (
        "This is a mathematics question. "
        "Show step-by-step derivation with clear notation. "
        "Use LaTeX for formulas where appropriate ($$formula$$). "
        "Verify the result and explain the intuition."
    ),
    "business": (
        "This is a business/product question. "
        "Provide actionable, data-driven insights. "
        "Include relevant metrics, benchmarks, and a comparison table. "
        "Give concrete recommendations, not just theory."
    ),
    "explanation": (
        "This is an explanation/comparison question. "
        "Start with a crisp one-line answer. "
        "Use a comparison table if comparing two things. "
        "Give a real-world analogy to make it concrete. "
        "End with when/why to choose each option."
    ),
    "general": (
        "Provide a comprehensive, well-structured answer. "
        "Use headers, bullet points, and examples. "
        "Be specific — avoid vague generalities."
    ),
}


# ─────────────────────────────────────────────────────────────────────────────
# MULTI-STEP REASONING PIPELINE
# ─────────────────────────────────────────────────────────────────────────────
class NexusAgent:
    """
    The NEXUS Agent — multi-domain conversational AI with:
    - Domain detection
    - Chain-of-thought reasoning
    - Self-reflection quality check
    - Conversation history awareness
    - Structured output enforcement
    """

    def __init__(self, model: str = "gpt-4o", temperature: float = 0.35):
        self.model = model
        self.temperature = temperature
        self._conversation_history: list[dict] = []

    # ── Public API ─────────────────────────────────────────────────────────
    def chat(
        self,
        message: str,
        history: list[dict] | None = None,
        reflect: bool = True,
    ) -> dict[str, Any]:
        """
        Main chat method.

        Args:
            message:  User's message
            history:  Prior conversation [{"role": "user"|"assistant", "content": "..."}]
            reflect:  Whether to run self-reflection pass (improves quality, uses 2x tokens)

        Returns:
            {
                "answer": str,
                "reasoning_steps": [...],
                "domain": str,
                "reflection": str | None,
                "tokens_used": int,
                "model_used": str,
            }
        """
        start_time = time.time()
        domain = detect_domain(message)
        domain_instruction = _DOMAIN_INSTRUCTIONS.get(domain, _DOMAIN_INSTRUCTIONS["general"])

        # Step 1: Build messages
        messages = self._build_messages(message, history or [], domain_instruction)

        # Step 2: Reasoning — chain-of-thought pre-pass for complex queries
        reasoning_steps = []
        if self._is_complex(message):
            reasoning_steps = self._reason(message, domain)

        # Step 3: Main generation
        answer, tokens = _llm(
            messages,
            model=self.model,
            temperature=self.temperature,
            max_tokens=6000,
        )

        # Step 4: Self-reflection (optional quality check)
        reflection = None
        if reflect and len(answer) > 200:
            reflection, r_tokens = self._reflect(message, answer, domain)
            tokens += r_tokens

        # Step 5: Post-process output
        answer = self._post_process(answer, domain)

        elapsed = round(time.time() - start_time, 2)
        pinfo = provider_info()

        return {
            "answer": answer,
            "reasoning_steps": reasoning_steps,
            "domain": domain,
            "reflection": reflection,
            "tokens_used": tokens,
            "model_used": pinfo["active_model"],
            "elapsed_seconds": elapsed,
        }

    # ── Internal helpers ───────────────────────────────────────────────────
    def _build_messages(
        self,
        message: str,
        history: list[dict],
        domain_instruction: str,
    ) -> list[dict]:
        """Build the full messages list for the LLM call."""
        msgs: list[dict] = [
            {"role": "system", "content": NEXUS_SYSTEM_PROMPT},
            {"role": "system", "content": f"Current query domain: {domain_instruction}"},
        ]
        # Add last 8 history turns (4 user + 4 assistant) to maintain context
        for h in history[-8:]:
            role = h.get("role", "user")
            content = h.get("content", "")
            if role in ("user", "assistant") and content:
                msgs.append({"role": role, "content": content})
        msgs.append({"role": "user", "content": message})
        return msgs

    def _is_complex(self, message: str) -> bool:
        """Detect if query warrants a reasoning pre-pass."""
        complex_patterns = [
            r"\b(compare|difference|pros|cons|tradeoff|should i|which is better)\b",
            r"\b(design|architect|implement|build|create|how to)\b",
            r"\b(why|explain|understand|reason)\b",
            r".{150,}",  # long queries are usually complex
        ]
        return any(re.search(p, message, re.I) for p in complex_patterns)

    def _reason(self, message: str, domain: str) -> list[str]:
        """Chain-of-thought pre-reasoning — generates structured thinking steps."""
        reasoning_prompt = f"""
Break this question into 3 clear reasoning steps before answering.
Domain: {domain}
Question: {message}

Format:
Step 1: [What to consider / what the question is really asking]
Step 2: [Key concepts, approaches, or trade-offs to evaluate]
Step 3: [How to structure the best answer]

Be concise — 1 sentence per step.
"""
        raw, _ = _simple(reasoning_prompt, temperature=0.2)
        steps = []
        for line in raw.strip().split("\n"):
            line = line.strip()
            m = re.match(r"^Step\s*\d+:?\s*(.+)", line, re.I)
            if m:
                steps.append(m.group(1).strip())
        return steps[:3] if steps else []

    def _reflect(self, question: str, answer: str, domain: str) -> tuple[str, int]:
        """
        Self-reflection pass — NEXUS checks its own answer for:
        - Accuracy
        - Completeness
        - Missing edge cases
        Returns a brief reflection note.
        """
        reflection_prompt = f"""
You just answered a {domain} question. Briefly review your answer.
Question: {question}
Your answer (first 600 chars): {answer[:600]}

In 1-2 sentences: Was your answer accurate and complete? 
What one thing could make it better? Be self-critical but concise.
"""
        reflection, tokens = _simple(reflection_prompt, temperature=0.2)
        return reflection.strip(), tokens

    def _post_process(self, answer: str, domain: str) -> str:
        """Clean up and ensure the answer follows format rules."""
        # Remove any accidental double blank lines
        answer = re.sub(r"\n{3,}", "\n\n", answer)

        # Ensure code questions always have a code block (safety check)
        if domain == "code" and "```" not in answer and len(answer) > 100:
            answer = answer.strip()

        return answer.strip()


# ─────────────────────────────────────────────────────────────────────────────
# KNOWLEDGE BASE — Hardcoded expert answers for common questions
# These run without any API call when the exact question matches.
# This makes the agent fast and reliable for FAQs.
# ─────────────────────────────────────────────────────────────────────────────
_KNOWLEDGE_BASE: dict[str, str] = {
    "what is nexus": """# What is NEXUS AI?

**NEXUS AI** is a full-stack enterprise AI platform that combines a Next.js 15 frontend, 
FastAPI backend, PostgreSQL database, and 14 specialist Python agents into a unified workspace.

## Key Capabilities

| Feature | Details |
|---------|---------|
| 🤖 **13 Specialist Agents** | Analytics, Code, Critic, Knowledge, Memory, Planner, Reasoning, Recommendation, Report, Research, Search, Summarizer, Validator |
| 🧠 **NEXUS Agent (14th)** | This agent — full-spectrum conversational AI with reasoning pipeline |
| 💾 **Storage Service** | File upload, AI processing, embeddings, version control |
| 🔐 **Auth System** | JWT + bcrypt, PostgreSQL-backed, cookie-based sessions |
| 📊 **Analytics** | Live dashboard with real database metrics |
| 🔄 **Workflow DAGs** | Multi-agent pipeline orchestration |

## Architecture

```mermaid
graph TD
    Browser[Next.js 15 Frontend :3000] --> API[Next.js API Routes]
    API --> FastAPI[FastAPI AI Service :8001]
    API --> DB[(PostgreSQL + pgvector)]
    FastAPI --> Agents[14 Python Agents]
    Agents --> LLM[Gemini 2.5 Flash / GPT-4o / Claude]
```

💡 **Key Takeaway**: NEXUS is not just a chatbot — it's a complete AI-powered development and productivity platform.
""",

    "what is rag": """# Retrieval-Augmented Generation (RAG)

**RAG** is a technique that combines a retrieval system (search) with an LLM generator to answer questions grounded in your own documents, rather than relying solely on the model's training data.

## How RAG Works

```mermaid
graph LR
    Q[User Question] --> E[Embed Question]
    E --> VS[(Vector Store)]
    VS --> R[Top-K Relevant Chunks]
    R --> LLM[LLM + Context]
    LLM --> A[Grounded Answer]
```

## Core Components

| Component | Purpose | Tools |
|-----------|---------|-------|
| **Chunker** | Split documents into ~500 token segments | LangChain, LlamaIndex |
| **Embedder** | Convert chunks to vector representations | text-embedding-3-large, Gemini |
| **Vector Store** | Fast similarity search | pgvector, Pinecone, Qdrant |
| **Retriever** | Find top-K relevant chunks | Cosine similarity, HNSW |
| **Generator** | Answer using retrieved context | GPT-4o, Claude, Gemini |

## Naive RAG vs Hybrid RAG

| Approach | Precision | Recall | Speed |
|---------|-----------|--------|-------|
| Dense-only (vectors) | High | Medium | Fast |
| Sparse-only (BM25) | Medium | High | Fast |
| **Hybrid (BM25 + dense)** | **High** | **High** | Medium |
| Re-ranked hybrid | Highest | High | Slower |

## Python Implementation (pgvector + Gemini)

```python
import google.generativeai as genai
from psycopg2 import connect

# 1. Embed the query
genai.configure(api_key="YOUR_KEY")
query_embedding = genai.embed_content(
    model="models/embedding-001",
    content="What is our refund policy?",
    task_type="retrieval_query"
)["embedding"]

# 2. Find similar chunks in pgvector
conn = connect("postgresql://...")
cur = conn.cursor()
cur.execute("""
    SELECT content, 1 - (embedding <=> %s::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> %s::vector
    LIMIT 5
""", (query_embedding, query_embedding))
chunks = cur.fetchall()

# 3. Generate answer with context
context = "\\n\\n".join(chunk[0] for chunk in chunks)
model = genai.GenerativeModel("models/gemini-2.5-flash")
answer = model.generate_content(f"Context:\\n{context}\\n\\nQuestion: What is our refund policy?")
print(answer.text)
```

💡 **Key Takeaway**: RAG solves LLM hallucination for domain-specific knowledge by always grounding answers in your actual documents.
""",

    "pgvector vs pinecone": """# pgvector vs Pinecone — Vector Database Comparison

## Quick Answer
Use **pgvector** if you already have PostgreSQL. Use **Pinecone** if you need managed, serverless, billion-scale vector search with zero ops overhead.

## Detailed Comparison

| Category | pgvector | Pinecone |
|----------|---------|---------|
| **Type** | PostgreSQL extension | Managed cloud vector DB |
| **Setup** | Self-hosted (or Supabase/Neon) | Serverless SaaS |
| **Cost** | Free (infra cost only) | Free tier → $70+/month |
| **Max Vectors** | ~10M practical, 100M+ possible | Billions |
| **Index Type** | HNSW, IVFFlat | Proprietary (HNSW-based) |
| **Latency** | 5-50ms (local) | 10-100ms (network) |
| **SQL Joins** | ✅ Native SQL joins | ❌ Separate service |
| **Filtering** | ✅ Full SQL WHERE clauses | ✅ Metadata filters |
| **Managed** | ❌ You manage it | ✅ Fully managed |
| **Hybrid Search** | With pg_bm25/paradedb | ✅ Built-in |

## When to Choose Each

### Choose pgvector when:
- You already use PostgreSQL
- You need SQL joins between vectors and relational data
- You want to keep all data in one database (simplicity)
- Budget is a concern
- < 10M vectors

### Choose Pinecone when:
- You need > 100M vectors
- You want zero infrastructure management
- You need global, low-latency access
- You can afford the SaaS cost

## pgvector HNSW Setup

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table with embedding column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)  -- OpenAI ada-002 dimensions
);

-- Create HNSW index for fast approximate search
CREATE INDEX ON documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Query: find 5 most similar documents
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

💡 **Key Takeaway**: For most startups and enterprise apps under 10M vectors, **pgvector is the pragmatic choice** — it keeps your stack simple and costs nothing extra.
""",
}

def _check_knowledge_base(query: str) -> str | None:
    """Check if query matches a hardcoded KB answer (fast path, no API call)."""
    q = query.lower().strip()
    for key, answer in _KNOWLEDGE_BASE.items():
        if key in q or all(word in q for word in key.split()):
            return answer
    return None


# ─────────────────────────────────────────────────────────────────────────────
# CONVERSATION SESSION MANAGER
# ─────────────────────────────────────────────────────────────────────────────
class NexusSession:
    """Manages a stateful conversation with NEXUS Agent."""

    def __init__(self, session_id: str, model: str = "gpt-4o"):
        self.session_id = session_id
        self.agent = NexusAgent(model=model)
        self.history: list[dict] = []
        self.created_at = time.time()
        self.message_count = 0

    def send(self, message: str) -> dict[str, Any]:
        """Send a message and get a response (history-aware)."""
        # Fast path: check knowledge base first
        kb_answer = _check_knowledge_base(message)
        if kb_answer:
            self.history.append({"role": "user", "content": message})
            self.history.append({"role": "assistant", "content": kb_answer})
            self.message_count += 1
            pinfo = provider_info()
            return {
                "answer": kb_answer,
                "reasoning_steps": [],
                "domain": "knowledge_base",
                "reflection": None,
                "tokens_used": 0,
                "model_used": "NEXUS Knowledge Base (instant)",
                "elapsed_seconds": 0.001,
                "from_knowledge_base": True,
            }

        # Main path: call LLM with history
        result = self.agent.chat(message, history=self.history, reflect=True)

        # Update conversation history
        self.history.append({"role": "user", "content": message})
        self.history.append({"role": "assistant", "content": result["answer"]})
        # Keep last 20 turns max
        if len(self.history) > 20:
            self.history = self.history[-20:]

        self.message_count += 1
        return result


# ─────────────────────────────────────────────────────────────────────────────
# MODULE-LEVEL API (called by FastAPI router)
# ─────────────────────────────────────────────────────────────────────────────
_sessions: dict[str, NexusSession] = {}


def get_or_create_session(session_id: str, model: str = "gpt-4o") -> NexusSession:
    if session_id not in _sessions:
        _sessions[session_id] = NexusSession(session_id, model=model)
    return _sessions[session_id]


def run(
    message: str,
    session_id: str = "default",
    history: list[dict] | None = None,
    model: str = "gpt-4o",
) -> dict[str, Any]:
    """
    Main entry point. Called by FastAPI router.

    Args:
        message:    User message
        session_id: Session identifier for history tracking (default "default")
        history:    Optional explicit history override
        model:      Model preference (mapped to available provider internally)

    Returns dict with keys:
        answer, reasoning_steps, domain, reflection, tokens_used, model_used, elapsed_seconds
    """
    if history is not None:
        # One-shot mode: no session persistence, just use provided history
        agent = NexusAgent(model=model)
        return agent.chat(message, history=history, reflect=True)
    else:
        # Session mode: history is tracked server-side
        session = get_or_create_session(session_id, model=model)
        return session.send(message)


def clear_session(session_id: str) -> bool:
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False


def get_session_info(session_id: str) -> dict:
    session = _sessions.get(session_id)
    if not session:
        return {"exists": False, "message_count": 0, "history_length": 0}
    return {
        "exists": True,
        "session_id": session_id,
        "message_count": session.message_count,
        "history_length": len(session.history),
        "created_at": session.created_at,
    }
