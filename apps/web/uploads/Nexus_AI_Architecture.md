# NEXUS AI — System Architecture & Microservices

## Overview
NEXUS AI is an enterprise-grade adaptive intelligence platform that unifies multi-model AI routing, autonomous agent workflows, and intelligent document storage with real-time vector search.

### Core Components
1. **Web Platform (`apps/web`)**: Next.js 15 App Router interface providing interactive Agent Chat, Visual Workflow Builder, Document Management, and Real-time Analytics.
2. **API Gateway (`backend/gateway`)**: High-performance FastAPI routing service with authentication, rate limiting, and telemetry.
3. **Database Layer (PostgreSQL + Prisma)**: Relational schema tracking users, organizations, agents, conversations, workflows, and document metadata.
4. **Multi-Model AI Router (`apps/web/lib/ai`)**: Dynamic model selector coordinating between OpenAI, Anthropic, Google Gemini, xAI Grok, and DeepSeek.
