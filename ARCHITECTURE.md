# NEXUS AI — Enterprise Architecture & System Design

NEXUS AI is built as a modular monorepo combining a high-performance **Next.js 15 App Router** frontend, a scalable **FastAPI** AI microservices gateway, a **PostgreSQL (Prisma ORM)** data layer, and a **13-Agent Python Mesh**.

---

## 🏛 System Topology

```mermaid
flowchart TB
    subgraph ClientLayer["🖥 User Experience Layer"]
        Web["Next.js 15 Web Application"]
        Canvas["Visual Workflow Canvas"]
        FleetUI["Agent Fleet & Monitor"]
        DocInt["Document RAG & Storage Hub"]
    end

    subgraph GatewayLayer["⚡ API Gateway & Security"]
        Middleware["JWT Authentication & RBAC Middleware"]
        Router["Nexus Auto Intelligent Router"]
        Fallback["Resilient Multi-Provider Fallback Engine"]
    end

    subgraph ServiceLayer["🧠 Intelligence & Agent Layer"]
        subgraph AgentsFleet["13 Autonomous Agent Fleet"]
            A1["Analytics Agent"]
            A2["Code Synthesizer"]
            A3["Consensus Critic"]
            A4["Knowledge Agent"]
            A5["Memory Agent"]
            A6["Task Planner"]
            A7["Reasoning Agent"]
            A8["Recommendation Agent"]
            A9["Report Agent"]
            A10["Research Agent"]
            A11["Search Agent"]
            A12["Summarizer Agent"]
            A13["Validator Agent"]
        end
        LocalLLM["Local Llama 3.2 via Ollama"]
        CloudLLM["Google Gemini 2.5 Flash / Pro (Native REST)"]
    end

    subgraph DataLayer["💾 Persistence & State"]
        Postgres[(PostgreSQL 16 Database)]
        VectorStore[(Vector Store & Document Embeddings)]
        LocalStorage[(Encrypted Local Storage Engine)]
    end

    Web --> Middleware
    Canvas --> Middleware
    FleetUI --> Middleware
    DocInt --> Middleware

    Middleware --> Router
    Router --> Fallback
    Fallback --> CloudLLM
    Fallback --> LocalLLM

    Router --> AgentsFleet
    AgentsFleet --> Postgres
    AgentsFleet --> VectorStore
    AgentsFleet --> LocalStorage
```

---

## 🧩 Architectural Pillars

### 1. Resilient Multi-Model Mesh
- Eliminates single-vendor vulnerability.
- If primary LLM providers face rate limits, billing exhaustion, or outages, requests automatically cascade across secondary verified models (Google Gemini 2.5 Flash/Pro, Gemini Flash Latest) without dropping the user's connection.

### 2. Autonomous Task Decomposition
- The **Task Planner** deconstructs complex user prompts into directed acyclic graphs (DAGs).
- Specialized sub-agents (Analytics, Code, Critic, Validation) execute parallel tasks with shared working memory.

### 3. Dual-Tier Memory Architecture
- **Working Session Memory**: Ephemeral sliding-window context tracking recent user turns and tool outputs.
- **Persistent Semantic Memory**: Vectorized long-term store enabling recall of enterprise facts, documentation, and user preferences across sessions.

### 4. Enterprise Multi-Tenancy & Compliance
- Full organization isolation (Organization ID scoped on every model query).
- Role-Based Access Control (`ADMIN`, `MEMBER`, `GUEST`).
- Token attribution tracking per request, user, and agent for transparent cost allocation.
