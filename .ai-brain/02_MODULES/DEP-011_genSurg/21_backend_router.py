# filepath: 02_MODULES/DEP-011/21_backend_router.py
# FastAPI router for General_Surgery (DEP-011)

from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Optional, List

from auth.jwt_handler import verify_jwt
from auth.rbac_middleware import require_role
from tenancy.tenant_scope import require_tenant_scope
from db import get_db
from .schemas import *
from .service import GensurgService

router = APIRouter(prefix="/api/genSurg", tags=["General_Surgery"])


@router.get("/list", response_model=List[GensurgEncounter])
async def list_encounters(
    patient_id: Optional[int] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    request: Request = None,
    db=Depends(get_db)
):
    """List General_Surgery encounters for current tenant."""
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = GensurgService(db, tenant_id)
    return svc.list_encounters(patient_id, status, limit, offset)


@router.get("/{encounter_id}", response_model=GensurgEncounter)
async def get_encounter(encounter_id: int, request: Request, db=Depends(get_db)):
    require_tenant_scope(request)
    tenant_id = request.state.tenant_id
    svc = GensurgService(db, tenant_id)
    enc = svc.get_encounter(encounter_id)
    if not enc:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return enc


@router.post("/", response_model=GensurgEncounter, status_code=201)
async def create_encounter(
    payload: GensurgEncounterCreate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["genSurg_specialist", "genSurg_nurse", "admin"])
    tenant_id = request.state.tenant_id
    svc = GensurgService(db, tenant_id)
    return svc.create_encounter(payload.model_dump(), actor_id=user["id"])


@router.put("/{encounter_id}", response_model=GensurgEncounter)
async def update_encounter(
    encounter_id: int,
    payload: GensurgEncounterUpdate,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["genSurg_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = GensurgService(db, tenant_id)
    return svc.update_encounter(encounter_id, payload.model_dump())


@router.delete("/{encounter_id}", status_code=204)
async def delete_encounter(
    encounter_id: int,
    request: Request,
    db=Depends(get_db),
    user=Depends(verify_jwt)
):
    require_tenant_scope(request)
    require_role(user, ["genSurg_specialist", "admin"])
    tenant_id = request.state.tenant_id
    svc = GensurgService(db, tenant_id)
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