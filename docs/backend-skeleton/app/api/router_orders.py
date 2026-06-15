"""Cardiology orders endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.session import get_session
from ..events.publisher import publish
from ..schemas.cardio import CardioOrderInput, CardioOrderOut
from ..security.auth import current_user, require_scope
from ..services.repository import CardioOrderRepo

router = APIRouter()


@router.get("/orders", response_model=list[CardioOrderOut])
async def list_orders(
    patient_id: str | None = Query(default=None),
    status_: str | None = Query(default=None, alias="status"),
    page_size: int = Query(default=50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(current_user),
) -> list[CardioOrderOut]:
    repo = CardioOrderRepo(session)
    rows = await repo.list(patient_id=patient_id, status=status_, limit=page_size)
    return [CardioOrderOut.model_validate(r) for r in rows]


@router.post("/orders", response_model=CardioOrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    body: CardioOrderInput,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(require_scope("order.write")),
) -> CardioOrderOut:
    # Idempotency check (Redis lookup omitted for brevity — see services/idempotency.py)
    repo = CardioOrderRepo(session)
    row = await repo.create(
        patient_id=int(body.patient_id.lstrip("P-")),
        visit_id=int(body.visit_id.lstrip("V-")),
        order_type=body.order_type,
        sub_type=body.sub_type,
        priority=body.priority,
        indication=body.indication,
        ordered_by=int(user.get("sub", "0")),
        notes=body.notes,
    )
    await publish(
        "cardio.order.created",
        key=str(row.id),
        payload={
            "type": "cardio.order.created",
            "id": str(row.id),
            "patient_id": body.patient_id,
            "order_type": body.order_type,
            "priority": body.priority,
        },
    )
    return CardioOrderOut.model_validate(row)


@router.get("/orders/{id}", response_model=CardioOrderOut)
async def get_order(
    id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(current_user),
) -> CardioOrderOut:
    repo = CardioOrderRepo(session)
    row = await repo.get(id)
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    return CardioOrderOut.model_validate(row)


@router.patch("/orders/{id}", response_model=CardioOrderOut)
async def patch_order(
    id: uuid.UUID,
    body: dict,
    session: AsyncSession = Depends(get_session),
    user: dict = Depends(require_scope("order.write")),
) -> CardioOrderOut:
    repo = CardioOrderRepo(session)
    row = await repo.patch(id, **body)
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    return CardioOrderOut.model_validate(row)
