"""Kafka event publisher (aiokafka)."""

from __future__ import annotations

import json
from typing import Any

import structlog
from aiokafka import AIOKafkaProducer

from ..settings import settings

logger = structlog.get_logger(__name__)
_producer: AIOKafkaProducer | None = None


async def init_event_bus() -> None:
    global _producer
    _producer = AIOKafkaProducer(
        bootstrap_servers=settings.kafka_brokers,
        client_id=settings.kafka_client_id,
        enable_idempotence=True,
        acks="all",
        value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8"),
        key_serializer=lambda k: (k or "").encode("utf-8"),
    )
    await _producer.start()


async def close_event_bus() -> None:
    global _producer
    if _producer is not None:
        await _producer.stop()
        _producer = None


async def publish(topic: str, key: str | None, payload: dict[str, Any]) -> None:
    if _producer is None:
        raise RuntimeError("Event bus not initialized")
    await _producer.send_and_wait(topic, value=payload, key=key)
    logger.info("event_published", topic=topic, key=key, type=payload.get("type"))
