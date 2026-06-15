from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.base import OrderCreate, OrderResponse

router = APIRouter()

@router.get("/orders", response_model=List[OrderResponse])
def get_rehab_pt_orders():
    # TODO: Implement DB fetch
    return []

@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_rehab_pt_order(order: OrderCreate):
    # TODO: Implement DB insert
    pass

@router.get("/results")
def get_rehab_pt_results(patient_id: str):
    return []
