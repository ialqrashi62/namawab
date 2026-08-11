# filepath: 02_MODULES/DEP-058/21_backend_router.py
# FastAPI router for Insurance_Claims_NPHIES (DEP-058)

from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Optional, List

from auth.jwt_handler import verify_jwt
from auth.rbac_middleware import require_role
from tenancy.tenant_scope import require_tenant_scope
from db import get_db
from .schemas import *
from .service import InsuranceService

router = APIRouter(prefix="/api/insurance", tags=["Insurance_Claims_NPHIES"])


@router.get("/list", response_model=List[InsuranceEncounter])
async def list_encounters(
    patient_id: Optional[int] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    request: Request = None,
    db=Depends(get_db)
):
    """List Insurance_Claims_NPHIES encounters for current tenant."""
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = InsuranceService(db, tenant_id)
    return svc.list_encounters(patient_id, status, limit, offset)


@router.get("/{encounter_id}", response_model=InsuranceEncounter)
async def get_encounter(encounter_id: int, request: Request, db=Depends(get_db)):
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = InsuranceService(db, tenant_id)
    enc = svc.get_encounter(encounter_id)
    if not enc:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return enc


@router.post("/", response_model=InsuranceEncounter, status_code=201)
async def create_encounter(
    payload: InsuranceEncounterCreate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["insurance_specialist", "insurance_nurse", "admin"])
    tenant_id = request.state.tenant_id
    svc = InsuranceService(db, tenant_id)
    return svc.create_encounter(payload.model_dump(), actor_id=user["id"])


@router.put("/{encounter_id}", response_model=InsuranceEncounter)
async def update_encounter(
    encounter_id: int,
    payload: InsuranceEncounterUpdate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["insurance_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = InsuranceService(db, tenant_id)
    return svc.update_encounter(encounter_id, payload.model_dump())


@router.delete("/{encounter_id}", status_code=204)
async def delete_encounter(
    encounter_id: int,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["insurance_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = InsuranceService(db, tenant_id)
    svc.soft_delete_encounter(encounter_id)
    return None


@router.post("/ai/diagnose")
async def ai_diagnose(
    payload: dict,
    request: Request,
    user=Depends(verify_jwt)
):
    """AI-powered differential diagnosis."""
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    from .rag_pipeline import build_diagnosis_agent
    agent = build_diagnosis_agent(tenant_id)
    result = agent.invoke({"input": payload.get("question", "")})
    return {"answer": result["output"], "sources": [...]}