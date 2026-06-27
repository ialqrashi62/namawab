"""Health & readiness endpoints."""

from fastapi import APIRouter, status

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
async def health() -> dict:
    return {"status": "ok"}


@router.get("/ready", status_code=status.HTTP_200_OK)
async def ready() -> dict:
    # In production check: DB ping, Kafka connectivity, Qdrant reachability.
    return {"status": "ready"}


@router.get("/version", status_code=status.HTTP_200_OK)
async def version() -> dict:
    return {"service": "cardio-api", "version": "1.0.0"}
