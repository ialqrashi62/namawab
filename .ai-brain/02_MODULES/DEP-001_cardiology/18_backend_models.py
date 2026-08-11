# filepath: 02_MODULES/DEP-001/18_backend_models.py
# SQLAlchemy models for Cardiology (DEP-001)

from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP, ForeignKey, JSON, Boolean
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class CardiologyEncounter(Base):
    __tablename__ = "cardiology_encounters"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_type = Column(String(50), default="outpatient")
    started_at = Column(TIMESTAMP, nullable=False)
    ended_at = Column(TIMESTAMP)
    status = Column(String(20), default="active")
    chief_complaint = Column(Text)
    diagnosis_codes = Column(ARRAY(String))
    notes = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)
    deleted_at = Column(TIMESTAMP)


class CardiologyOrder(Base):
    __tablename__ = "cardiology_orders"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("cardiology_encounters.id"))
    order_type = Column(String(50), nullable=False)
    order_code = Column(String(100), nullable=False)
    order_detail = Column(JSONB, default={})
    priority = Column(String(20), default="routine")
    status = Column(String(20), default="pending")
    ordered_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    ordered_at = Column(TIMESTAMP, nullable=False)
    completed_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)


class CardiologyResult(Base):
    __tablename__ = "cardiology_results"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("cardiology_encounters.id"))
    order_id = Column(BigInteger, ForeignKey("cardiology_orders.id"))
    result_type = Column(String(50), nullable=False)
    result_value = Column(Text)
    result_unit = Column(String(50))
    reference_range = Column(String(100))
    abnormal_flag = Column(String(10))
    result_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)


class CardiologyNote(Base):
    __tablename__ = "cardiology_notes"
    id = Column(BigInteger, primary_key=True)
    tenant_id = Column(BigInteger, nullable=False, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False, index=True)
    encounter_id = Column(BigInteger, ForeignKey("cardiology_encounters.id"))
    note_type = Column(String(50), default="progress")
    note_text = Column(Text, nullable=False)
    signed_at = Column(TIMESTAMP)
    signed_by = Column(BigInteger, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)