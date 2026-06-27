"""Cardiology AI co-pilot endpoint — wraps LangGraph orchestrator."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..schemas.cardio import AIRequest, AIResponse
from ..security.auth import require_scope

router = APIRouter()


@router.post("/ai/ask", response_model=AIResponse)
async def ask(body: AIRequest, user: dict = Depends(require_scope("ai.use"))) -> AIResponse:
    # In production: invoke LangGraph orchestrator (orchestration/cardio.py).
    # Here we return a stub matching the contract.
    return AIResponse(
        answer="Stub answer — wire up orchestration/langgraph_base.py",
        confidence=0.85,
        requires_human_confirm=False,
        safety_critical=False,
        citations=[],
        audit_hash="0" * 64,
    )


@router.get("/ai/explain/{result_id}")
async def explain(result_id: str, user: dict = Depends(require_scope("ai.use"))) -> dict:
    """Return SHAP-style explanation + citations for a previous AI result."""
    return {"result_id": result_id, "explanation": "stub", "citations": []}
