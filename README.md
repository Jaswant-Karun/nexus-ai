<div align="center">

# ⚡ NEXUS AI
### **Autonomous Enterprise Multi-Agent Intelligence & Resilient Multi-Model Orchestration Platform**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Multi-Agent](https://img.shields.io/badge/Agents-13_Autonomous_Fleet-7C3AED?style=for-the-badge)](#-13-specialized-autonomous-agents)

<p align="center">
  <b>NEXUS AI</b> is an enterprise-grade adaptive intelligence platform designed to eliminate model lock-in, vendor downtime, and agent isolation. Powered by an <b>autonomous 13-agent collaborative fleet</b>, an <b>intelligent self-healing multi-model router</b> (Google Gemini 2.5, OpenAI GPT-4o, Anthropic Claude 3.5, and Local Llama 3.2), and a <b>semantic RAG knowledge graph</b>.
</p>

</div>

---

## 🎯 The Problem & Why Existing AI Platforms Fail

1. **Brittle Single-Model Dependencies**: When OpenAI or Anthropic hits rate limits (HTTP 429), balance exhaustion (HTTP 400), or outages, existing platforms crash and halt customer workflows.
2. **Generic "Chat Wrapper" Trap**: Most AI projects are basic wrappers over an API without real autonomous multi-agent task decomposition, self-verification, or persistent memory.
3. **Lack of Hybrid Edge + Cloud Flexibility**: Enterprises cannot run sensitive workloads purely on the public cloud or lack local offline capabilities.
4. **No Unified Governance & Auditability**: Teams lack visibility into token cost attribution, latency metrics, and agent audit trails.

---

## 🚀 The NEXUS AI Solution

NEXUS AI solves this with a unified, self-healing architecture:

```mermaid
graph TD
    Client["🌐 Next.js 15 Web Application & Canvas"] --> Gateway["⚡ Nexus API Gateway & Middleware"]
    Gateway --> Router["🧠 Nexus Auto Router & Self-Healing Fallback"]
    
    subgraph "Intelligent Multi-Model Mesh"
        Router --> Gemini["✨ Google Gemini 2.5 Flash / Pro (Active)"]
        Router --> OpenAI["🤖 OpenAI GPT-4o / GPT-5 (Configured)"]
        Router --> Anthropic["⚡ Claude 3.5 Sonnet / Opus (Configured)"]
        Router --> Local["💻 Local Llama 3.2 via Ollama (Edge Inference)"]
    end
    
    subgraph "13 Autonomous Agent Fleet"
        Router --> AgentsFleet["Multi-Agent Mesh: Planner | Code | Critic | Analytics | Research..."]
    end
    
    subgraph "Enterprise Data & Storage"
        AgentsFleet --> Postgres["🐘 PostgreSQL (Users, Orgs, Chats, Workflows)"]
        AgentsFleet --> RAG["📚 Semantic Knowledge Graph & Vector RAG"]
        AgentsFleet --> Storage["📁 Secure Storage & File Intelligence (OCR)"]
    end
```

---

## 🌟 Key Platform Features

### 1. 🔄 Self-Healing Multi-Model Orchestration
- **Instant Task Classification**: Automatically routes prompts to the best model based on heuristic semantic analysis (Coding, Reasoning, Long-Context, Realtime, Creative, General).
- **Zero-Downtime Fallback**: If a primary provider is out of credits or rate-limited, NEXUS seamlessly retries across secondary providers (e.g. Gemini 2.5 Flash) without dropping the user's connection.
- **Hybrid Local + Cloud**: Runs on local Llama 3.2 neural weights with automatic cloud fallback when edge devices lack local LLM daemons.

### 2. 🤖 13 Specialized Autonomous Agents
All 13 agents operate independently or in task-graph chains:
| # | Agent | Role | Capabilities |
|---|---|---|---|
| 1 | **Analytics Agent** | Business Intelligence & Metrics | Revenue, Churn, NPS, cohort retention analysis |
| 2 | **Code Synthesizer** | Full-Stack Engineering | TypeScript, Python, SQL generation with memoization & typing |
| 3 | **Consensus Critic** | Verification & Hallucination Gate | Multi-criteria safety, clarity, accuracy, and completeness scoring |
| 4 | **Knowledge Agent** | RAG Document Synthesizer | Contextual retrieval and citation-backed answering |
| 5 | **Memory Agent** | Dual-Tier Memory Engine | Working session context + long-term semantic persistence |
| 6 | **Task Planner** | DAG Decomposition | Deconstructs goals into execution plans with step dependencies |
| 7 | **Reasoning Agent** | Chain-of-Thought Solver | Architectural trade-offs, logic puzzles, complexity analysis |
| 8 | **Recommendation Agent** | Semantic Item Matcher | Cosine similarity ranking & personalized recommendations |
| 9 | **Report Agent** | Executive Summarization | Markdown report builder with KPIs, tables, and action items |
| 10 | **Research Agent** | Literature & Web Synthesis | Multi-angle research briefs with structured sections |
| 11 | **Hybrid Search Agent** | Vector + Lexical Search | Combined BM25 and dense retrieval across knowledge stores |
| 12 | **Summarizer Agent** | Content Distillation | Bullet, paragraph, or key-takeaways condensation |
| 13 | **Validator Agent** | Fact & Tech Stack Verification | Constraint validation, factual cross-checking, and assertions |

### 3. 🎨 Interactive Visual Workflow Canvas
- Drag-and-drop node graph builder for chaining agents, APIs, and data transformers.
- Live execution triggers, step-by-step progress tracking, and output previews.

### 4. 📚 Semantic RAG Knowledge Graph & File Intelligence
- Upload PDF, DOCX, TXT, and Markdown files.
- Automated OCR, chunking, and semantic vector indexing.
- Search documents with contextual citation highlights.

---

## 🔑 Pre-Seeded Hackathon Demo Accounts

The database comes pre-seeded with realistic production enterprise data:

| Account Type | Email | Password | Role | Access |
|---|---|---|---|---|
| **Administrator** | `admin@nexus.ai` | `Admin@nexus123!` | Global Admin | Full access to Fleet, Settings, Audits, Analytics, Workflows |
| **Team Member** | `member@nexus.ai` | `Member@nexus123!` | Member | Chat, Agent Workspace, Knowledge Base, Storage |

---

## 🛠 Quickstart Guide

### Prerequisites
- **Node.js** >= 18 (Node 22 recommended)
- **pnpm** >= 9.0
- **Python** >= 3.11 (virtual environment in `.venv`)
- **PostgreSQL** running on `localhost:5432`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Jaswant-Karun/nexus-ai.git
cd nexus-ai
pnpm install
```

### 2. Environment Setup
The repository includes a ready `.env` configuration. Ensure `GOOGLE_AI_API_KEY` is set:
```bash
# In .env or apps/web/.env.local
GOOGLE_AI_API_KEY=your_gemini_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexus_ai
```

### 3. Initialize & Seed Database
```bash
cd apps/web
pnpm db:push
pnpm db:seed
```

### 4. Run the 13 Autonomous Agents Test Suite
Verify that all 13 AI agents are executing live via the universal LLM client:
```bash
python test_agents.py
```

### 5. Launch the Platform
```bash
# In apps/web (or from repo root with pnpm dev)
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser and sign in with `admin@nexus.ai` / `Admin@nexus123!`.

---

## 🧪 Automated Test Suite Verification

Run the comprehensive test suite verifying the multi-agent mesh:
```bash
# Live Agent verification
python test_agents.py

# Web application TypeScript validation
pnpm --filter @nexus-ai/web typecheck
pnpm --filter @nexus-ai/admin typecheck
```

---

## 🏆 Why NEXUS AI Stands Out as a Winning Project

1. **Live, Non-Trivial AI Execution**: Not a mock prototype. 13 real Python agents interact with live LLMs, execute vector similarity, and produce verified outputs.
2. **Defensive, Resilient Architecture**: No "failed fetch" or "quota exceeded" crashes during judging. The self-healing router protects every request.
3. **Comprehensive Enterprise Scope**: Complete auth (JWT/bcrypt), organization multi-tenancy, persistent database storage, workflow automation, and real-time streaming SSE.
4. **Visually Stunning & Modern**: Built with Next.js 15, Tailwind CSS, Lucide icons, Framer Motion animations, and dark-mode glassmorphic aesthetics.

---

## 📄 License
MIT License © 2026 Jaswant Karun. Built for high-impact enterprise autonomy.
