# filepath: 02_MODULES/DEP-048/19_backend_schemas.py
# Pydantic schemas for Medical_Oncology (DEP-048)

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MedoncEncounterBase(BaseModel):
    patient_id: int
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class MedoncEncounterCreate(MedoncEncounterBase):
    diagnosis_codes: List[str] = []


class MedoncEncounterUpdate(BaseModel):
    status: Optional[str] = None
    diagnosis_codes: Optional[List[str]] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None


class MedoncEncounter(MedoncEncounterBase):
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


class MedoncOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_type: str
    order_code: str
    order_detail: dict = {}
    priority: str = "routine"


class MedoncOrderCreate(MedoncOrderBase):
    pass


class MedoncOrder(MedoncOrderBase):
    id: int
    tenant_id: int
    status: str
    ordered_by: int
    ordered_at: datetime
    completed_at: Optional[datetime]
    model_config = {"from_attributes": True}


class MedoncResultBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    order_id: Optional[int] = None
    result_type: str
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    abnormal_flag: Optional[str] = None


class MedoncResultCreate(MedoncResultBase):
    pass


class MedoncResult(MedoncResultBase):
    id: int
    tenant_id: int
    result_at: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class MedoncNoteBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    note_type: str = "progress"
    note_text: str


class MedoncNoteCreate(MedoncNoteBase):
    pass


class MedoncNote(MedoncNoteBase):
    id: int
    tenant_id: int
    signed_at: Optional[datetime]
    signed_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}