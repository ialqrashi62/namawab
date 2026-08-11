# filepath: 02_MODULES/DEP-024/19_backend_schemas.py
# Pydantic schemas for PICU (DEP-024)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PicuEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class PicuEncounterCreate(PicuEncounterBase):
    diagnosis_codes: List[str] = []


class PicuEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class PicuEncounter(PicuEncounterBase):
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


class PicuOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class PicuOrderCreate(PicuOrderBase):
    pass


class PicuOrder(PicuOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class PicuResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class PicuResultCreate(PicuResultBase):
    pass


class PicuResult(PicuResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class PicuNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class PicuNoteCreate(PicuNoteBase):
    pass


class PicuNote(PicuNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}