"""
NamaMedical — Cardiology API entrypoint.
Drop-in pattern for any department service.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from .api import router_health, router_orders, router_ecg, router_echo, router_cath, router_devices, router_hf, router_ai
from .db.session import init_db_pool, close_db_pool
from .events.publisher import init_event_bus, close_event_bus
from .security.middleware import RequestIdMiddleware, AuditMiddleware
from .settings import settings

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("startup", env=settings.env, version=app.version)
    await init_db_pool()
    await init_event_bus()
    yield
    await close_event_bus()
    await close_db_pool()
    logger.info("shutdown")


app = FastAPI(
    title="NamaMedical Cardiology API",
    version="1.0.0",
    description="Cardiology service: orders, ECG, echo, cath, devices, HF, AI co-pilot.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.add_middleware(RequestIdMiddleware)
app.add_middleware(AuditMiddleware)

# Routes
app.include_router(router_health.router, tags=["health"])
app.include_router(router_orders.router, prefix="/api/v1/cardio", tags=["orders"])
app.include_router(router_ecg.router, prefix="/api/v1/cardio", tags=["ecg"])
app.include_router(router_echo.router, prefix="/api/v1/cardio", tags=["echo"])
app.include_router(router_cath.router, prefix="/api/v1/cardio", tags=["cathlab"])
app.include_router(router_devices.router, prefix="/api/v1/cardio", tags=["devices"])
app.include_router(router_hf.router, prefix="/api/v1/cardio", tags=["hf"])
app.include_router(router_ai.router, prefix="/api/v1/cardio", tags=["ai"])

# Prometheus metrics endpoint
app.mount("/metrics", make_asgi_app())

# Tracing
FastAPIInstrumentor.instrument_app(app)
