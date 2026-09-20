# Design Document

## 2. AI Architecture

- **AI Engine** – core orchestrator that receives user intents, selects appropriate agents, and coordinates execution.
- **Multi‑Agent System** – each agent implements a specialised capability (e.g., chat, PDF analysis, recommendation). Agents communicate via a lightweight JSON‑RPC protocol.
- **Workflow Generation Engine** – analyses intent, composes a directed acyclic graph of agents, and persists it.
- **RAG Pipeline** – integrates PostgreSQL, Qdrant and external data sources to fetch relevant context.
- **Memory Management** – short‑term (Redis) and long‑term (PostgreSQL) memory stores.
- **Knowledge Graph** – stores entities and relationships extracted from documents.
- **AI Communication Protocol** – uniform request/response schema with provenance metadata.
- **Prompt Architecture** – modular prompt templates stored as Jinja files.
- **Explainable AI** – each step produces a human‑readable rationale attached to the final report.
- **Dynamic Planning Algorithm** – uses LangGraph planners to adapt workflows at runtime.

## 3. Database Design

- **PostgreSQL** – relational storage for users, projects, workflows, audit logs.
- **Qdrant** – vector store for document embeddings and semantic search.
- **Redis** – cache and short‑term memory.

## 4. UI/UX Design System

- **Colour Palette** – dark‑mode primary #0d0d0d, accent #ff6b6b, secondary #1e1e1e.
- **Typography** – Google Font *Inter* (weights 400, 600, 800).
- **Component Library** – reusable Tailwind‑based components (Button, Card, Modal, Table, Chart).

---
*Generated as part of the documentation scaffold.*
