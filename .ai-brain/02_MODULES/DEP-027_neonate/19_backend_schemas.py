# filepath: 02_MODULES/DEP-027/19_backend_schemas.py
# Pydantic schemas for Neonatology (DEP-027)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class NeonateEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class NeonateEncounterCreate(NeonateEncounterBase):
    diagnosis_codes: List[str] = []


class NeonateEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class NeonateEncounter(NeonateEncounterBase):
    id: int
    tenant_id: int
    status: str
    diagnosis_codes: List[str]
    started_at: datetime
    ended_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class NeonateOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class NeonateOrderCreate(NeonateOrderBase):
    pass


class NeonateOrder(NeonateOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class NeonateResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class NeonateResultCreate(NeonateResultBase):
    pass


class NeonateResult(NeonateResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class NeonateNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class NeonateNoteCreate(NeonateNoteBase):
    pass


class NeonateNote(NeonateNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}