from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.base import OrderCreate, OrderResponse

router = APIRouter()

@router.get("/orders", response_model=List[OrderResponse])
def get_infectious_diseases_orders():
    # TODO: Implement DB fetch
    return []

@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_infectious_diseases_order(order: OrderCreate):
    # TODO: Implement DB insert
    pass

@router.get("/results")
def get_infectious_diseases_results(patient_id: str):
    return []
