"""Pydantic schemas — request/response bodies."""

from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class CardioOrderInput(BaseModel):
    patient_id: str = Field(pattern=r"^P-\d{4,}$")
    visit_id: str
    order_type: Literal["cath", "ep_study", "echo", "holter", "ecg", "tte", "tee"]
    sub_type: str | None = None
    priority: Literal["routine", "urgent", "stat", "emergent"] = "routine"
    indication: str = Field(min_length=3, max_length=500)
    notes: str | None = None


class CardioOrderOut(CardioOrderInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: str
    ordered_by: int
    ordered_at: datetime
    scheduled_for: datetime | None = None
    fulfilled_at: datetime | None = None


class EcgStudyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    patient_id: int
    visit_id: int
    captured_at: datetime
    waveform_blob_url: str | None = None
    machine_interpretation: str | None = None
    ai_interpretation: str | None = None
    ai_confidence: Decimal | None = None
    physician_overread: str | None = None
    overread_by: int | None = None
    overread_at: datetime | None = None


class EchoStudyInput(BaseModel):
    patient_id: int
    visit_id: int
    study_date: date
    ef_percent: int | None = Field(default=None, ge=10, le=80)
    lvids_mm: int | None = None
    e_e_prime: float | None = None
    rwma_segments: str | None = None
    valves: dict | None = None
    findings: str | None = None
    impression: str | None = None


class EchoStudyOut(EchoStudyInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    reported_by: int | None = None
    reported_at: datetime | None = None


class CathCaseInput(BaseModel):
    patient_id: int
    visit_id: int
    case_date: date
    operator_id: int
    access: Literal["radial-r", "radial-l", "femoral-r", "femoral-l"] | None = None
    contrast_ml: int | None = Field(default=None, ge=0, le=1000)
    fluoro_min: float | None = Field(default=None, ge=0, le=120)
    syntax_score: int | None = Field(default=None, ge=0, le=60)
    pci_done: bool = False
    stents_used: int = 0
    stent_types: str | None = None
    complications: str | None = None
    outcome: str | None = None


class CathCaseOut(CathCaseInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class DeviceInput(BaseModel):
    patient_id: int
    device_type: Literal["pacemaker", "icd", "crt-p", "crt-d", "loop_recorder"]
    manufacturer: str
    model: str
    serial_no: str = Field(min_length=3, max_length=80)
    implanted_at: date
    implanted_by: int | None = None


class DeviceOut(DeviceInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    battery_eri_at: date | None = None
    last_interrogation: date | None = None


class HfEnrollmentInput(BaseModel):
    patient_id: int
    nyha_class: Literal["I", "II", "III", "IV"]
    aha_stage: Literal["A", "B", "C", "D"]
    ef_percent: int | None = Field(default=None, ge=10, le=80)
    on_arni: bool = False
    on_bb: bool = False
    on_mra: bool = False
    on_sglt2i: bool = False
    next_visit: date | None = None


class HfEnrollmentOut(HfEnrollmentInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    enrolled_at: date
    last_admission: date | None = None


class RiskScores(BaseModel):
    heart: int = Field(ge=0, le=10)
    grace: int = Field(ge=0, le=372)
    cha2ds2_vasc: int = Field(ge=0, le=9)
    has_bled: int = Field(ge=0, le=9)
    syntax: int | None = None


class AIRequest(BaseModel):
    question: str = Field(min_length=2, max_length=4000)
    patient_id: str | None = None
    visit_id: str | None = None
    context: dict | None = None
    lang: Literal["ar", "en"] = "ar"


class AIResponse(BaseModel):
    answer: str
    confidence: float = Field(ge=0, le=1)
    requires_human_confirm: bool
    safety_critical: bool
    citations: list[str] = []
    audit_hash: str
