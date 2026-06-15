"""
NamaMedical SDK example (Python)
Run:
    pip install httpx pydantic
    export NAMA_TOKEN=...
    python example.py
"""

from __future__ import annotations

import os
import uuid
import asyncio
from datetime import datetime
import httpx
from pydantic import BaseModel


BASE = os.getenv("NAMA_BASE", "https://staging-api.nama.local")
TOKEN = os.environ["NAMA_TOKEN"]


# ─── Pydantic models (subset) ────────────────────────────────────────
class CardioOrderInput(BaseModel):
    patient_id: str
    visit_id: str
    order_type: str
    sub_type: str | None = None
    priority: str = "routine"
    indication: str
    notes: str | None = None


class AIRequest(BaseModel):
    question: str
    patient_id: str | None = None
    visit_id: str | None = None
    context: dict | None = None
    lang: str = "ar"


# ─── Client ──────────────────────────────────────────────────────────
class NamaClient:
    def __init__(self, base: str = BASE, token: str = TOKEN):
        self._client = httpx.AsyncClient(
            base_url=base,
            timeout=15.0,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
                "User-Agent": "nama-py-sdk/0.1",
            },
        )

    async def aclose(self):
        await self._client.aclose()

    async def search_patient(self, q: str):
        r = await self._client.get("/api/v1/patients", params={"q": q})
        r.raise_for_status()
        return r.json()

    async def list_cardio_orders(self, status: str = "requested"):
        r = await self._client.get("/api/v1/cardio/orders", params={"status": status})
        r.raise_for_status()
        return r.json()

    async def place_cardio_order(self, order: CardioOrderInput) -> dict:
        idem = str(uuid.uuid4())
        r = await self._client.post(
            "/api/v1/cardio/orders",
            headers={"Idempotency-Key": idem},
            json=order.model_dump(exclude_none=True),
        )
        r.raise_for_status()
        return r.json()

    async def get_cardio_risk(self, patient_id: str) -> dict:
        r = await self._client.get(f"/api/v1/cardio/risk/{patient_id}")
        r.raise_for_status()
        return r.json()

    async def cardio_ai_ask(self, req: AIRequest) -> dict:
        r = await self._client.post(
            "/api/v1/cardio/ai/ask",
            json=req.model_dump(exclude_none=True),
        )
        r.raise_for_status()
        return r.json()

    async def activate_code(self, code: str, ed_visit_id: str, triggered_by: str) -> dict:
        r = await self._client.post(
            f"/api/v1/ed/codes/{code}/activate",
            json={"ed_visit_id": ed_visit_id, "triggered_by": triggered_by},
        )
        r.raise_for_status()
        return r.json()


# ─── Demo ────────────────────────────────────────────────────────────
async def main():
    client = NamaClient()
    try:
        patients = await client.search_patient("Al-Omari")
        print(f"Found {len(patients.get('data', []))} patients")

        order = await client.place_cardio_order(CardioOrderInput(
            patient_id="P-90001",
            visit_id="V-7788",
            order_type="echo",
            sub_type="tte",
            priority="routine",
            indication="HF follow-up",
        ))
        print(f"Order created: {order['id']}")

        risk = await client.get_cardio_risk("P-90001")
        print(f"HEART={risk['heart']}  CHA2DS2-VASc={risk['cha2ds2_vasc']}")

        ai = await client.cardio_ai_ask(AIRequest(
            question="AFib new-onset, CHA2DS2-VASc=4, HAS-BLED=2, CrCl=48. Best DOAC?",
            patient_id="P-90001",
            visit_id="V-7788",
            lang="ar",
        ))
        print(f"AI confidence={ai['confidence']}  needs_human={ai['requires_human_confirm']}")
        print(ai['answer'][:300], "..." if len(ai['answer']) > 300 else "")
    finally:
        await client.aclose()


if __name__ == "__main__":
    asyncio.run(main())
