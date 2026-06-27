"""SQLAlchemy ORM models for cardiology tables."""

from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Index
from sqlalchemy.dialects.mssql import DATETIMEOFFSET, NVARCHAR
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class CardioOrder(Base):
    __tablename__ = "cardio_orders"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    visit_id: Mapped[int]
    order_type: Mapped[str] = mapped_column(NVARCHAR(40))
    sub_type: Mapped[str | None] = mapped_column(NVARCHAR(60), nullable=True)
    priority: Mapped[str] = mapped_column(NVARCHAR(10))
    indication: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    status: Mapped[str] = mapped_column(NVARCHAR(20), default="requested")
    ordered_by: Mapped[int]
    ordered_at: Mapped[datetime] = mapped_column(DATETIMEOFFSET, default=datetime.utcnow)
    scheduled_for: Mapped[datetime | None] = mapped_column(DATETIMEOFFSET, nullable=True)
    fulfilled_at: Mapped[datetime | None] = mapped_column(DATETIMEOFFSET, nullable=True)
    notes: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)

    __table_args__ = (
        CheckConstraint("priority IN ('routine','urgent','stat','emergent')"),
        Index("IX_cardio_orders_patient", "patient_id", "ordered_at"),
        Index("IX_cardio_orders_status", "status"),
    )


class CardioEcgStudy(Base):
    __tablename__ = "cardio_ecg_studies"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    visit_id: Mapped[int]
    captured_at: Mapped[datetime] = mapped_column(DATETIMEOFFSET)
    waveform_blob_url: Mapped[str | None] = mapped_column(NVARCHAR(500), nullable=True)
    machine_interpretation: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    ai_interpretation: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    ai_confidence: Mapped[Decimal | None] = mapped_column(nullable=True)
    physician_overread: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    overread_by: Mapped[int | None] = mapped_column(nullable=True)
    overread_at: Mapped[datetime | None] = mapped_column(DATETIMEOFFSET, nullable=True)


class CardioEchoStudy(Base):
    __tablename__ = "cardio_echo_studies"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    visit_id: Mapped[int]
    study_date: Mapped[date]
    ef_percent: Mapped[int | None] = mapped_column(nullable=True)
    lvids_mm: Mapped[int | None] = mapped_column(nullable=True)
    e_e_prime: Mapped[Decimal | None] = mapped_column(nullable=True)
    rwma_segments: Mapped[str | None] = mapped_column(NVARCHAR(200), nullable=True)
    valves_json: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    findings: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    impression: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    reported_by: Mapped[int | None] = mapped_column(nullable=True)
    reported_at: Mapped[datetime | None] = mapped_column(DATETIMEOFFSET, nullable=True)


class CardioCathCase(Base):
    __tablename__ = "cardio_cath_cases"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    visit_id: Mapped[int]
    case_date: Mapped[date]
    operator_id: Mapped[int | None] = mapped_column(nullable=True)
    access: Mapped[str | None] = mapped_column(NVARCHAR(20), nullable=True)
    contrast_ml: Mapped[int | None] = mapped_column(nullable=True)
    fluoro_min: Mapped[Decimal | None] = mapped_column(nullable=True)
    syntax_score: Mapped[int | None] = mapped_column(nullable=True)
    pci_done: Mapped[bool | None] = mapped_column(nullable=True)
    stents_used: Mapped[int | None] = mapped_column(nullable=True)
    stent_types: Mapped[str | None] = mapped_column(NVARCHAR(300), nullable=True)
    complications: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    outcome: Mapped[str | None] = mapped_column(NVARCHAR(40), nullable=True)


class CardioDevice(Base):
    __tablename__ = "cardio_devices"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    device_type: Mapped[str] = mapped_column(NVARCHAR(20))
    manufacturer: Mapped[str] = mapped_column(NVARCHAR(80))
    model: Mapped[str] = mapped_column(NVARCHAR(80))
    serial_no: Mapped[str] = mapped_column(NVARCHAR(80), unique=True)
    implanted_at: Mapped[date]
    implanted_by: Mapped[int | None] = mapped_column(nullable=True)
    battery_eri_at: Mapped[date | None] = mapped_column(nullable=True)
    last_interrogation: Mapped[date | None] = mapped_column(nullable=True)


class CardioHfProgram(Base):
    __tablename__ = "cardio_hf_program"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[int]
    enrolled_at: Mapped[date | None] = mapped_column(nullable=True)
    nyha_class: Mapped[str | None] = mapped_column(NVARCHAR(3), nullable=True)
    aha_stage: Mapped[str | None] = mapped_column(NVARCHAR(1), nullable=True)
    ef_percent: Mapped[int | None] = mapped_column(nullable=True)
    on_arni: Mapped[bool | None] = mapped_column(nullable=True)
    on_bb: Mapped[bool | None] = mapped_column(nullable=True)
    on_mra: Mapped[bool | None] = mapped_column(nullable=True)
    on_sglt2i: Mapped[bool | None] = mapped_column(nullable=True)
    last_admission: Mapped[date | None] = mapped_column(nullable=True)
    next_visit: Mapped[date | None] = mapped_column(nullable=True)
