"""Centralized settings (12-factor)."""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Core
    env: Literal["local", "staging", "prod"] = "local"
    log_level: str = "INFO"
    cors_allowed_origins: list[str] = Field(default_factory=lambda: ["*"])

    # DB
    database_url: str = "mssql+aioodbc://sa:NamaDev!2026@localhost/master?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
    db_pool_size: int = 20
    db_max_overflow: int = 10

    # Cache / queue
    redis_url: str = "redis://:NamaDev!2026@localhost:6379"

    # Vector DB
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str | None = None

    # Event bus
    kafka_brokers: str = "localhost:9092"
    kafka_client_id: str = "cardio-api"

    # Auth
    oidc_issuer: str = "https://idp.nama.local/realms/nama"
    oidc_audience: str = "nama-api"
    jwks_url: str = "https://idp.nama.local/.well-known/jwks.json"

    # AI
    anthropic_api_key: str | None = None
    nama_llm_model: str = "claude-opus-4-7"
    nama_llm_fast: str = "claude-haiku-4-5-20251001"
    confidence_threshold: float = 0.7
    phi_redaction: Literal["off", "soft", "strict"] = "strict"
    ai_lang_default: Literal["ar", "en"] = "ar"

    # Idempotency / rate limit
    idempotency_ttl_seconds: int = 86_400
    rate_limit_user_per_minute: int = 60
    rate_limit_facility_per_minute: int = 600


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
