# filepath: 02_MODULES/DEP-006/19_backend_schemas.py
# Pydantic schemas for Pulmonology (DEP-006)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PulmonologyEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class PulmonologyEncounterCreate(PulmonologyEncounterBase):
    diagnosis_codes: List[str] = []


class PulmonologyEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class PulmonologyEncounter(PulmonologyEncounterBase):
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


class PulmonologyOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class PulmonologyOrderCreate(PulmonologyOrderBase):
    pass


class PulmonologyOrder(PulmonologyOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class PulmonologyResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class PulmonologyResultCreate(PulmonologyResultBase):
    pass


class PulmonologyResult(PulmonologyResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class PulmonologyNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class PulmonologyNoteCreate(PulmonologyNoteBase):
    pass


class PulmonologyNote(PulmonologyNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}