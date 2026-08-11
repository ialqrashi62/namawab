# filepath: 02_MODULES/DEP-040/19_backend_schemas.py
# Pydantic schemas for Radiology (DEP-040)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class RadiologyEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class RadiologyEncounterCreate(RadiologyEncounterBase):
    diagnosis_codes: List[str] = []


class RadiologyEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class RadiologyEncounter(RadiologyEncounterBase):
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


class RadiologyOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class RadiologyOrderCreate(RadiologyOrderBase):
    pass


class RadiologyOrder(RadiologyOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class RadiologyResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class RadiologyResultCreate(RadiologyResultBase):
    pass


class RadiologyResult(RadiologyResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class RadiologyNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class RadiologyNoteCreate(RadiologyNoteBase):
    pass


class RadiologyNote(RadiologyNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}