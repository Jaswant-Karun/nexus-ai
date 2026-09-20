"""
NEXUS AI Service — Centralised configuration.
All secrets are loaded from environment variables / .env file.
"""

from __future__ import annotations

import os
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────
    app_name:    str = "NEXUS AI Service"
    app_version: str = "1.0.0"
    debug:       bool = False
    environment: str = "development"

    # ── AI Providers ─────────────────────────────────────────────
    openai_api_key:    str = ""
    anthropic_api_key: str = ""
    google_ai_api_key: str = ""
    cohere_api_key:    str = ""

    # ── Default models ───────────────────────────────────────────
    default_llm_model:       str = "gpt-4o"
    default_embed_model:     str = "text-embedding-3-small"
    default_embed_dims:      int = 1536
    fast_llm_model:          str = "gpt-4o-mini"
    strong_llm_model:        str = "gpt-4o"
    anthropic_model:         str = "claude-3-5-sonnet-20241022"

    # ── Vector DB (Qdrant) ────────────────────────────────────────
    qdrant_url:        str = "http://localhost:6333"
    qdrant_api_key:    str = ""
    qdrant_collection: str = "nexus_docs"

    # ── PostgreSQL ────────────────────────────────────────────────
    database_url: str = "postgresql://postgres:postgres@localhost:5432/nexus_ai"

    # ── Redis ─────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379"

    # ── Service ports ─────────────────────────────────────────────
    ai_service_port: int = 8001

    class Config:
        env_file = "../../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    st = Settings()
    if st.openai_api_key:
        os.environ["OPENAI_API_KEY"] = st.openai_api_key
    if st.anthropic_api_key:
        os.environ["ANTHROPIC_API_KEY"] = st.anthropic_api_key
    if st.google_ai_api_key:
        os.environ["GOOGLE_AI_API_KEY"] = st.google_ai_api_key
    if st.cohere_api_key:
        os.environ["COHERE_API_KEY"] = st.cohere_api_key
    return st


settings = get_settings()

