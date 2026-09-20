# NEXUS AI Service

Run this service from the repository root so Python resolves the local modules correctly:

```text
pnpm ai:dev
```

The service is available at `http://localhost:8001` and its API documentation is at `/docs`.

The equivalent direct command is:

```text
cd backend/ai-service
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```
