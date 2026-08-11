# filepath: 02_MODULES/DEP-003/19_backend_schemas.py
# Pydantic schemas for Gastroenterology (DEP-003)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class GastroenterologyEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class GastroenterologyEncounterCreate(GastroenterologyEncounterBase):
    diagnosis_codes: List[str] = []


class GastroenterologyEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class GastroenterologyEncounter(GastroenterologyEncounterBase):
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


class GastroenterologyOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class GastroenterologyOrderCreate(GastroenterologyOrderBase):
    pass


class GastroenterologyOrder(GastroenterologyOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class GastroenterologyResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class GastroenterologyResultCreate(GastroenterologyResultBase):
    pass


class GastroenterologyResult(GastroenterologyResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class GastroenterologyNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class GastroenterologyNoteCreate(GastroenterologyNoteBase):
    pass


class GastroenterologyNote(GastroenterologyNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}