"""
Test all 13 NEXUS AI agents with real Gemini API.
Run: python test_agents.py
"""
import importlib.util, sys, os

# Load .env
with open(os.path.join(os.path.dirname(__file__), ".env")) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            if k.strip() not in os.environ:
                os.environ[k.strip()] = v.strip()

AGENTS_DIR = os.path.join(os.path.dirname(__file__), "agents")

def load_agent(name: str):
    """Load agent.py from agents/<name>/agent.py"""
    path = os.path.join(AGENTS_DIR, name, "agent.py")
    spec = importlib.util.spec_from_file_location(name.replace("-","_"), path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

# Test provider
sys.path.insert(0, AGENTS_DIR)
from shared.llm_client import provider_info

info = provider_info()
print("=" * 60)
print(f"NEXUS AI Agent Test Suite — ALL 13 AGENTS")
print(f"Provider : {info['active_provider'].upper()}")
print(f"Model    : {info['active_model']}")
print("=" * 60)
print()

DOCS = [
    "NEXUS AI is a multi-agent enterprise platform with GPT-4o and Gemini integration.",
    "The platform supports RAG pipelines, embeddings, vector search, and workflow automation.",
    "Agents: analytics, code, research, planning, summarization, validation, and memory."
]

results = []

def test(agent_name: str, fn):
    try:
        r     = fn()
        tok   = r.get("tokens_used", 0) if isinstance(r, dict) else 0
        preview = ""
        if isinstance(r, dict):
            for key in ("answer", "summary", "research", "review", "code",
                        "plan_id", "feedback", "comparison"):
                val = r.get(key, "")
                if val:
                    preview = str(val)[:130].replace("\n", " ") + "…"
                    break
        print(f"  ✅ {agent_name:<28} ({tok:>5} tokens)")
        if preview:
            print(f"     → {preview}")
        results.append((agent_name, True, tok))
    except Exception as e:
        print(f"  ❌ {agent_name:<28} ERROR: {str(e)[:100]}")
        results.append((agent_name, False, 0))
    print()

print("Running all 13 agents with real Gemini 2.5 Flash API...\n")

# 1 — Analytics Agent
m = load_agent("analytics-agent")
test("1. Analytics Agent", lambda: m.run(
    "Give 2 concise key insights: Revenue +28%, Churn 5%, NPS score 72"))

# 2 — Code Agent
m = load_agent("code-agent")
test("2. Code Agent", lambda: m.run(
    "Python function fibonacci(n) with memoization, type hints, docstring", "python"))

# 3 — Critic Agent
m = load_agent("critic-agent")
test("3. Critic Agent", lambda: m.run(
    "NEXUS AI is a good platform for enterprise AI.",
    "Write a professional product overview paragraph"))

# 4 — Knowledge Agent
m = load_agent("knowledge-agent")
test("4. Knowledge Agent", lambda: m.run(
    "What does NEXUS AI support?", DOCS))

# 5 — Memory Agent  (no LLM calls needed for basic ops)
m = load_agent("memory-agent")
def test_memory():
    ma = m.MemoryAgent()
    ma.store("NEXUS AI launched in 2026", importance=0.9)
    ma.store("Platform has 13 AI agents", importance=0.8)
    recalled = ma.recall("NEXUS platform", top_k=2)
    stats    = ma.stats()
    return {"tokens_used": 0, "answer":
            f"Stored 2 memories. Recalled {len(recalled)}: '{recalled[0]['content'] if recalled else 'none'}'. Stats: {stats}"}
test("5. Memory Agent", test_memory)

# 6 — Planner Agent
m = load_agent("planner-agent")
test("6. Planner Agent", lambda: m.run(
    "Build a customer support chatbot with RAG", max_steps=4))

# 7 — Reasoning Agent
m = load_agent("reasoning-agent")
test("7. Reasoning Agent", lambda: m.run(
    "Should a startup use a monolith or microservices architecture?",
    strategy="chain_of_thought"))

# 8 — Recommendation Agent
m = load_agent("recommendation-agent")
test("8. Recommendation Agent", lambda: m.run(
    "AI workflow automation platform",
    ["NEXUS AI multi-agent workflows", "Traditional RPA tools",
     "Low-code no-code platforms", "Custom Python scripts", "Knowledge base search"],
    top_k=3))

# 9 — Report Agent
m = load_agent("report-agent")
test("9. Report Agent", lambda: m.run(
    "NEXUS AI Platform Summary",
    {"total_agents": 13, "active_users": 2, "workflows_built": 3,
     "files_stored": 8, "ai_jobs_done": 14, "uptime": "99.9%"}))

# 10 — Research Agent
m = load_agent("research-agent")
test("10. Research Agent", lambda: m.run(
    "What is Retrieval Augmented Generation (RAG)?", depth="brief"))

# 11 — Search Agent
m = load_agent("search-agent")
test("11. Search Agent", lambda: m.run(
    "How does RAG work?", DOCS, top_k=2))

# 12 — Summarizer Agent
m = load_agent("summarizer-agent")
test("12. Summarizer Agent", lambda: m.run(
    "NEXUS AI is an enterprise adaptive intelligence platform. "
    "It provides autonomous AI agents, hybrid vector search, visual workflow automation, "
    "intelligent file management with OCR and AI summarisation, and real-time analytics. "
    "Built with Python FastAPI, Next.js 15, PostgreSQL, and Prisma ORM.",
    max_words=40))

# 13 — Validator Agent
m = load_agent("validator-agent")
test("13. Validator Agent", lambda: m.run(
    "NEXUS AI is built on Next.js 15 with PostgreSQL and supports 13 AI agents.",
    task="Describe the NEXUS AI tech stack"))

# ── Summary ────────────────────────────────────────────────────────────────────
print("=" * 60)
total_tok = sum(t for _, _, t in results)
passed    = sum(1 for _, ok, _ in results if ok)
failed    = [(n, ) for n, ok, _ in results if not ok]
print(f"Results  : {passed}/{len(results)} agents working ✅")
print(f"Tokens   : {total_tok:,} total")
print(f"Provider : {info['active_provider'].upper()} — {info['active_model']}")
if failed:
    print(f"Failed   : {[n[0] for n in failed]}")
print("=" * 60)
print()
print("NOTE: All agents use Google Gemini 2.5 Flash (your working key).")
print("OpenAI/Anthropic will auto-activate when you add credits.")
