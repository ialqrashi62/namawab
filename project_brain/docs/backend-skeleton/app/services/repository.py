"""Async repositories for cardio entities."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import CardioCathCase, CardioDevice, CardioEchoStudy, CardioEcgStudy, CardioHfProgram, CardioOrder


class CardioOrderRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def create(self, *, patient_id: int, visit_id: int, order_type: str,
                     sub_type: str | None, priority: str, indication: str,
                     ordered_by: int, notes: str | None = None) -> CardioOrder:
        row = CardioOrder(
            patient_id=patient_id, visit_id=visit_id, order_type=order_type,
            sub_type=sub_type, priority=priority, indication=indication,
            ordered_by=ordered_by, notes=notes,
        )
        self.s.add(row)
        await self.s.flush()
        return row

    async def get(self, id_: uuid.UUID) -> CardioOrder | None:
        return await self.s.get(CardioOrder, id_)

    async def list(self, *, patient_id: str | None = None, status: str | None = None,
                   limit: int = 50) -> list[CardioOrder]:
        stmt = select(CardioOrder)
        if patient_id:
            stmt = stmt.where(CardioOrder.patient_id == int(patient_id.lstrip("P-")))
        if status:
            stmt = stmt.where(CardioOrder.status == status)
        stmt = stmt.order_by(CardioOrder.ordered_at.desc()).limit(limit)
        return list((await self.s.execute(stmt)).scalars())

    async def patch(self, id_: uuid.UUID, **fields) -> CardioOrder | None:
        row = await self.get(id_)
        if row is None:
            return None
        for k, v in fields.items():
            if v is not None and hasattr(row, k):
                setattr(row, k, v)
        await self.s.flush()
        return row


class EcgRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def create(self, **kwargs) -> CardioEcgStudy:
        row = CardioEcgStudy(**kwargs)
        self.s.add(row)
        await self.s.flush()
        return row

    async def get(self, id_: uuid.UUID) -> CardioEcgStudy | None:
        return await self.s.get(CardioEcgStudy, id_)

    async def update_ai(self, id_: uuid.UUID, *, label: str, confidence: float) -> CardioEcgStudy | None:
        row = await self.get(id_)
        if row is None:
            return None
        row.ai_interpretation = label
        row.ai_confidence = confidence
        await self.s.flush()
        return row


class EchoRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def create(self, **kwargs) -> CardioEchoStudy:
        row = CardioEchoStudy(**kwargs)
        self.s.add(row)
        await self.s.flush()
        return row


class CathRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def create(self, **kwargs) -> CardioCathCase:
        row = CardioCathCase(**kwargs)
        self.s.add(row)
        await self.s.flush()
        return row


class DeviceRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def create(self, **kwargs) -> CardioDevice:
        row = CardioDevice(**kwargs)
        self.s.add(row)
        await self.s.flush()
        return row

    async def list_for_patient(self, patient_id: int) -> list[CardioDevice]:
        stmt = select(CardioDevice).where(CardioDevice.patient_id == patient_id)
        return list((await self.s.execute(stmt)).scalars())


class HfRepo:
    def __init__(self, session: AsyncSession):
        self.s = session

    async def list_cohort(self, *, nyha: str | None = None, ef_max: int | None = None) -> list[CardioHfProgram]:
        stmt = select(CardioHfProgram)
        if nyha:
            stmt = stmt.where(CardioHfProgram.nyha_class == nyha)
        if ef_max is not None:
            stmt = stmt.where(CardioHfProgram.ef_percent <= ef_max)
        return list((await self.s.execute(stmt)).scalars())
