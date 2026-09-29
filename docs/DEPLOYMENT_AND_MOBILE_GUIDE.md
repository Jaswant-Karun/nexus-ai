# NEXUS AI: Full Deployment, n8n Orchestration & Mobile Application Guide

This guide details the complete end-to-end architecture, n8n workflow integration, containerized deployment, and Flutter mobile application connectivity for the **NEXUS AI Enterprise Platform**.

---

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    NEXUS Mobile App (Flutter 3)      │
                      │  (Android / iOS / Web / Desktop)     │
                      └──────────────┬───────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
                 ▼                                       ▼
     ┌───────────────────────┐               ┌───────────────────────┐
     │ NEXUS Web App (Next15)│               │  FastAPI Backend API  │
     │     (Port 3000)       │               │      (Port 8000)      │
     └───────────┬───────────┘               └───────────┬───────────┘
                 │                                       │
                 ├───────────────────┬───────────────────┤
                 ▼                   ▼                   ▼
       ┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
       │   n8n Automation  │ │  PostgreSQL   │ │   Qdrant Vector   │
       │    Engine (5678)  │ │   (Port 5432) │ │    (Port 6333)    │
       └───────────────────┘ └───────────────┘ └───────────────────┘
```

---

## 2. n8n Workflow Automation Engine

NEXUS AI integrates **n8n** as a headless, visual workflow and agent automation engine.

### Active Workflows (`n8n/workflows/`):
1. **Master Agent Orchestrator** (`nexus_agent_orchestrator.json`)
   - **Webhook**: `POST /webhook/nexus-agent`
   - **Role**: Single-agent goal parsing, memory buffer management, and dynamic tool execution.
2. **Multi-Agent Collaboration Pipeline** (`nexus_multi_agent_collaboration.json`)
   - **Webhook**: `POST /webhook/nexus-multi-agent`
   - **Role**: Dispatches tasks concurrently to Data Analyst, Security Auditor, and Synthesizer agents, returning a consolidated executive action plan.

### How n8n is Wired into the Project:
- **Web API Gateway**: [`apps/web/app/api/workflows/n8n/route.ts`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/web/app/api/workflows/n8n/route.ts)
  - `GET /api/workflows/n8n`: Probes health and returns active workflow templates.
  - `POST /api/workflows/n8n`: Dispatches payload directly to n8n webhooks.
- **Resilient Fallback Engine**: [`apps/web/lib/n8n.ts`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/web/lib/n8n.ts)
  - If n8n is starting up or in standby, the platform automatically routes the request through the internal neural council (`nexus-internal`) without user disruption.
- **Web UI Control Center**: [`apps/web/app/workflows/page.tsx`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/web/app/workflows/page.tsx) and [`apps/web/app/workflows/execution/page.tsx`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/web/app/workflows/execution/page.tsx)
  - Live status indicator displaying connection state to port 5678.
  - Direct execution buttons for Master Agent and Multi-Agent Collaboration pipelines.

---

## 3. Production Deployment (Docker Compose)

The entire platform is containerized with a single-command deployment setup in [`docker-compose.yml`](file:///c:/Users/jaswant%20karun/nexus-ai/docker-compose.yml).

### Services Configured:
| Service | Image / Build Context | Port | Function |
| :--- | :--- | :--- | :--- |
| `postgres` | `postgres:16-alpine` | `5432` | Relational storage & Prisma schemas |
| `qdrant` | `qdrant/qdrant:v1.13.6` | `6333` | Semantic embeddings & vector search |
| `n8n` | `docker.n8n.io/n8nio/n8n:latest` | `5678` | Headless automation engine (auto-imports workflows on boot) |
| `backend` | `./backend/api/Dockerfile` | `8000` | FastAPI core orchestration & models router |
| `web` | `./Dockerfile` | `3000` | Next.js 15 enterprise web interface |

### Launch Instructions:
```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Build and launch all 5 containers
docker compose up -d --build

# 3. View container health & logs
docker compose ps
docker compose logs -f web backend n8n
```

### Accessing Endpoints:
- **Web Application**: `http://localhost:3000`
- **FastAPI Documentation**: `http://localhost:8000/docs`
- **n8n Automation Console**: `http://localhost:5678`
- **Qdrant Vector Dashboard**: `http://localhost:6333/dashboard`

---

## 4. Mobile Application (Flutter `apps/mobile`)

The mobile client is a production-grade Flutter application located in [`apps/mobile/`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile).

### Key Features:
- **Live Workflow Execution**: [`WorkflowListScreen`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/screens/workflows/workflow_list.dart) allows triggering pipelines via **n8n Webhook** or **FastAPI Backend Council** with real-time execution telemetry and output inspection.
- **Smart Host Translation**: [`ApiConfig`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/config/api_config.dart) automatically resolves `localhost` to `10.0.2.2` when executed inside the Android Emulator.
- **Resilient AI Chat**: [`ChatScreenPage`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/screens/chatbot/chat_screen_page.dart) streams agent responses with multi-provider fallback.
- **Modular Services**:
  - [`WorkflowService`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/services/workflow_service.dart): n8n & FastAPI execution dispatch.
  - [`ApiService`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/services/api_service.dart): Authenticated HTTP client with health checks.
  - [`AiService`](file:///c:/Users/jaswant%20karun/nexus-ai/apps/mobile/lib/services/ai_service.dart): Backend models and planning router.

### Running the Mobile Application:
```bash
cd apps/mobile

# Verify code analysis
flutter analyze

# Run on connected device or emulator (Android, iOS, Chrome, or Windows)
flutter run

# To target a specific deployed cloud backend:
flutter run --dart-define=NEXUS_BACKEND_URL=https://api.yourdomain.com --dart-define=NEXUS_WEB_API_URL=https://yourdomain.com
```

### Building APK for Mobile Distribution:
```bash
cd apps/mobile
flutter build apk --release
```
The compiled APK will be generated at `apps/mobile/build/app/outputs/flutter-apk/app-release.apk`.
