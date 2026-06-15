import os

base_path = r"d:\NamaMedical\backend\fastapi"
app_path = os.path.join(base_path, "app")
api_path = os.path.join(app_path, "api", "v1")

os.makedirs(api_path, exist_ok=True)
os.makedirs(os.path.join(app_path, "core"), exist_ok=True)
os.makedirs(os.path.join(app_path, "db"), exist_ok=True)
os.makedirs(os.path.join(app_path, "schemas"), exist_ok=True)

groups = [
    ("01", "cardiology"),
    ("02", "pulmonology"),
    ("03", "gastro_hepato"),
    ("04", "nephrology"),
    ("05", "hemato_oncology"),
    ("06", "endocrine_diabetes"),
    ("07", "rheum_immunology"),
    ("08", "infectious_diseases"),
    ("09", "dermatology"),
    ("10", "general_surgery"),
    ("11", "cts_vascular_surgery"),
    ("12", "neurosurgery_spine"),
    ("13", "orthopedics"),
    ("14", "ophthalmology"),
    ("15", "ent"),
    ("16", "urology"),
    ("17", "plastic_burns"),
    ("18", "obgyn"),
    ("19", "neonatal_pediatrics"),
    ("20", "pediatric_subspec"),
    ("21", "radiology_imaging"),
    ("22", "laboratories"),
    ("23", "functional_diagnostics"),
    ("24", "emergency_department"),
    ("25", "intensive_care"),
    ("26", "anesthesia_pain"),
    ("27", "rehab_pt"),
    ("28", "radiation_pharmacy"),
    ("29", "integrative_medicine"),
    ("30", "nursing"),
    ("31", "nutrition"),
    ("32", "social_psych"),
    ("33", "logistics_it"),
    ("34", "security_safety"),
    ("35", "executive"),
    ("36", "quality_accreditation"),
    ("37", "education_research"),
    ("38", "hr_admin"),
    ("39", "centers_of_excellence"),
    ("40", "rare_advanced")
]

# Write core config
with open(os.path.join(app_path, "core", "config.py"), "w", encoding="utf-8") as f:
    f.write("""from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NamaMedical ERP API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "mssql+pyodbc://user:pass@localhost/namamedical?driver=ODBC+Driver+17+for+SQL+Server"

settings = Settings()
""")

# Write base schemas
with open(os.path.join(app_path, "schemas", "base.py"), "w", encoding="utf-8") as f:
    f.write("""from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    patient_id: str
    type: str
    priority: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: str
    status: str
    ordered_at: datetime
""")

# Write routers
routers = []
for num, key in groups:
    router_file = os.path.join(api_path, f"{key}.py")
    with open(router_file, "w", encoding="utf-8") as f:
        f.write(f"""from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.base import OrderCreate, OrderResponse

router = APIRouter()

@router.get("/orders", response_model=List[OrderResponse])
def get_{key}_orders():
    # TODO: Implement DB fetch
    return []

@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_{key}_order(order: OrderCreate):
    # TODO: Implement DB insert
    pass

@router.get("/results")
def get_{key}_results(patient_id: str):
    return []
""")
    routers.append(f"from app.api.v1 import {key}")

# Write __init__.py for api modules
open(os.path.join(api_path, "__init__.py"), "w").close()

# Write api router index
with open(os.path.join(api_path, "routers.py"), "w", encoding="utf-8") as f:
    f.write("from fastapi import APIRouter\n")
    for num, key in groups:
        f.write(f"from app.api.v1.{key} import router as {key}_router\n")
    
    f.write("\napi_router = APIRouter()\n")
    for num, key in groups:
        f.write(f"api_router.include_router({key}_router, prefix='/{key}', tags=['{key}'])\n")

# Write main.py
with open(os.path.join(base_path, "main.py"), "w", encoding="utf-8") as f:
    f.write("""from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.routers import api_router

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "NamaMedical"}
""")

# Write requirements.txt
with open(os.path.join(base_path, "requirements.txt"), "w", encoding="utf-8") as f:
    f.write("fastapi\nuvicorn\npydantic\npydantic-settings\nsQLAlchemy\npyodbc\n")

print("Successfully generated FastAPI backend scaffold with all 40 department routers.")
