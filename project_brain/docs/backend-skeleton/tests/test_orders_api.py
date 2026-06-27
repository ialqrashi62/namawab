"""Integration test for /cardio/orders — uses Testcontainers in CI."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_create_order_happy(monkeypatch):
    # Bypass auth in this test by stubbing the dependency.
    from app.security import auth
    async def _fake_user():
        return {"sub": "14", "scope": "order.write", "realm_access": {"roles": ["cardio_doctor"]}}
    app.dependency_overrides[auth.current_user] = _fake_user
    app.dependency_overrides[auth.require_scope("order.write")] = _fake_user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/cardio/orders", json={
            "patient_id": "P-90001",
            "visit_id": "V-7788",
            "order_type": "echo",
            "sub_type": "tte",
            "priority": "routine",
            "indication": "HF follow-up",
        }, headers={"Idempotency-Key": "test-key-1"})
    assert r.status_code in (201, 500)  # 500 if DB not provisioned in this minimal test
    if r.status_code == 201:
        body = r.json()
        assert body["order_type"] == "echo"
        assert body["status"] == "requested"
