# filepath: 02_MODULES/DEP-032/20_backend_service.py
# Business logic for Pediatric_Surgery (DEP-032)

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
import logging

logger = logging.getLogger(__name__)


class PedssurgService:
    """Service layer for Pediatric_Surgery.

    All methods require tenant_id for RLS.
    """

    def __init__(self, db: Session, tenant_id: int):
        self.db = db
        if not tenant_id:
            raise ValueError("tenant_id required (fail-closed)")
        self.tenant_id = tenant_id
        self.db.execute("SET LOCAL app.tenant_id = :tid", {"tid": tenant_id})

    # ============ Encounters ============
    def list_encounters(self, patient_id: Optional[int] = None, status: Optional[str] = None,
                        limit: int = 50, offset: int = 0) -> List[dict]:
        from .models import PedssurgEncounter
        q = self.db.query(PedssurgEncounter).filter(
            PedssurgEncounter.tenant_id == self.tenant_id,
            PedssurgEncounter.deleted_at.is_(None)
        )
        if patient_id:
            q = q.filter(PedssurgEncounter.patient_id == patient_id)
        if status:
            q = q.filter(PedssurgEncounter.status == status)
        return [e.to_dict() for e in q.limit(limit).offset(offset).all()]

    def get_encounter(self, encounter_id: int) -> Optional[dict]:
        from .models import PedssurgEncounter
        e = self.db.query(PedssurgEncounter).filter(
            PedssurgEncounter.id == encounter_id,
            PedssurgEncounter.tenant_id == self.tenant_id
        ).first()
        return e.to_dict() if e else None

    def create_encounter(self, payload: dict, actor_id: int) -> dict:
        from .models import PedssurgEncounter
        e = PedssurgEncounter(
            tenant_id=self.tenant_id,
            patient_id=payload["patient_id"],
            encounter_type=payload.get("encounter_type", "outpatient"),
            chief_complaint=payload.get("chief_complaint"),
            diagnosis_codes=payload.get("diagnosis_codes", []),
            status="active",
            started_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(e)
        self.db.commit()
        self.db.refresh(e)
        logger.info(f"Encounter created: id={e.id} tenant={self.tenant_id}")
        return e.to_dict()

    # ============ Orders ============
    def create_order(self, payload: dict, actor_id: int) -> dict:
        from .models import PedssurgOrder
        o = PedssurgOrder(
            tenant_id=self.tenant_id,
            patient_id=payload["patient_id"],
            encounter_id=payload.get("encounter_id"),
            order_type=payload["order_type"],
            order_code=payload["order_code"],
            order_detail=payload.get("order_detail", {}),
            priority=payload.get("priority", "routine"),
            status="pending",
            ordered_by=actor_id,
            ordered_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(o)
        self.db.commit()
        self.db.refresh(o)
        return o.to_dict()

    # ============ Clinical Decision Support ============
    def check_drug_interactions(self, medications: List[str]) -> List[dict]:
        """Returns list of {severity, drugs, mechanism, recommendation}."""
        from tools.drug_check import DrugCheckService
        checker = DrugCheckService(self.tenant_id)
        return checker.check_interactions(medications)

    def calc_risk_score(self, score_type: str, patient_data: dict) -> dict:
        """Returns {score, interpretation, recommendation}."""
        from engines.scoring import calc_score
        return calc_score(score_type, patient_data)