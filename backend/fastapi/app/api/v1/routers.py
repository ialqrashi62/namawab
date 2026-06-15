from fastapi import APIRouter
from app.api.v1.cardiology import router as cardiology_router
from app.api.v1.pulmonology import router as pulmonology_router
from app.api.v1.gastro_hepato import router as gastro_hepato_router
from app.api.v1.nephrology import router as nephrology_router
from app.api.v1.hemato_oncology import router as hemato_oncology_router
from app.api.v1.endocrine_diabetes import router as endocrine_diabetes_router
from app.api.v1.rheum_immunology import router as rheum_immunology_router
from app.api.v1.infectious_diseases import router as infectious_diseases_router
from app.api.v1.dermatology import router as dermatology_router
from app.api.v1.general_surgery import router as general_surgery_router
from app.api.v1.cts_vascular_surgery import router as cts_vascular_surgery_router
from app.api.v1.neurosurgery_spine import router as neurosurgery_spine_router
from app.api.v1.orthopedics import router as orthopedics_router
from app.api.v1.ophthalmology import router as ophthalmology_router
from app.api.v1.ent import router as ent_router
from app.api.v1.urology import router as urology_router
from app.api.v1.plastic_burns import router as plastic_burns_router
from app.api.v1.obgyn import router as obgyn_router
from app.api.v1.neonatal_pediatrics import router as neonatal_pediatrics_router
from app.api.v1.pediatric_subspec import router as pediatric_subspec_router
from app.api.v1.radiology_imaging import router as radiology_imaging_router
from app.api.v1.laboratories import router as laboratories_router
from app.api.v1.functional_diagnostics import router as functional_diagnostics_router
from app.api.v1.emergency_department import router as emergency_department_router
from app.api.v1.intensive_care import router as intensive_care_router
from app.api.v1.anesthesia_pain import router as anesthesia_pain_router
from app.api.v1.rehab_pt import router as rehab_pt_router
from app.api.v1.radiation_pharmacy import router as radiation_pharmacy_router
from app.api.v1.integrative_medicine import router as integrative_medicine_router
from app.api.v1.nursing import router as nursing_router
from app.api.v1.nutrition import router as nutrition_router
from app.api.v1.social_psych import router as social_psych_router
from app.api.v1.logistics_it import router as logistics_it_router
from app.api.v1.security_safety import router as security_safety_router
from app.api.v1.executive import router as executive_router
from app.api.v1.quality_accreditation import router as quality_accreditation_router
from app.api.v1.education_research import router as education_research_router
from app.api.v1.hr_admin import router as hr_admin_router
from app.api.v1.centers_of_excellence import router as centers_of_excellence_router
from app.api.v1.rare_advanced import router as rare_advanced_router

api_router = APIRouter()
api_router.include_router(cardiology_router, prefix='/cardiology', tags=['cardiology'])
api_router.include_router(pulmonology_router, prefix='/pulmonology', tags=['pulmonology'])
api_router.include_router(gastro_hepato_router, prefix='/gastro_hepato', tags=['gastro_hepato'])
api_router.include_router(nephrology_router, prefix='/nephrology', tags=['nephrology'])
api_router.include_router(hemato_oncology_router, prefix='/hemato_oncology', tags=['hemato_oncology'])
api_router.include_router(endocrine_diabetes_router, prefix='/endocrine_diabetes', tags=['endocrine_diabetes'])
api_router.include_router(rheum_immunology_router, prefix='/rheum_immunology', tags=['rheum_immunology'])
api_router.include_router(infectious_diseases_router, prefix='/infectious_diseases', tags=['infectious_diseases'])
api_router.include_router(dermatology_router, prefix='/dermatology', tags=['dermatology'])
api_router.include_router(general_surgery_router, prefix='/general_surgery', tags=['general_surgery'])
api_router.include_router(cts_vascular_surgery_router, prefix='/cts_vascular_surgery', tags=['cts_vascular_surgery'])
api_router.include_router(neurosurgery_spine_router, prefix='/neurosurgery_spine', tags=['neurosurgery_spine'])
api_router.include_router(orthopedics_router, prefix='/orthopedics', tags=['orthopedics'])
api_router.include_router(ophthalmology_router, prefix='/ophthalmology', tags=['ophthalmology'])
api_router.include_router(ent_router, prefix='/ent', tags=['ent'])
api_router.include_router(urology_router, prefix='/urology', tags=['urology'])
api_router.include_router(plastic_burns_router, prefix='/plastic_burns', tags=['plastic_burns'])
api_router.include_router(obgyn_router, prefix='/obgyn', tags=['obgyn'])
api_router.include_router(neonatal_pediatrics_router, prefix='/neonatal_pediatrics', tags=['neonatal_pediatrics'])
api_router.include_router(pediatric_subspec_router, prefix='/pediatric_subspec', tags=['pediatric_subspec'])
api_router.include_router(radiology_imaging_router, prefix='/radiology_imaging', tags=['radiology_imaging'])
api_router.include_router(laboratories_router, prefix='/laboratories', tags=['laboratories'])
api_router.include_router(functional_diagnostics_router, prefix='/functional_diagnostics', tags=['functional_diagnostics'])
api_router.include_router(emergency_department_router, prefix='/emergency_department', tags=['emergency_department'])
api_router.include_router(intensive_care_router, prefix='/intensive_care', tags=['intensive_care'])
api_router.include_router(anesthesia_pain_router, prefix='/anesthesia_pain', tags=['anesthesia_pain'])
api_router.include_router(rehab_pt_router, prefix='/rehab_pt', tags=['rehab_pt'])
api_router.include_router(radiation_pharmacy_router, prefix='/radiation_pharmacy', tags=['radiation_pharmacy'])
api_router.include_router(integrative_medicine_router, prefix='/integrative_medicine', tags=['integrative_medicine'])
api_router.include_router(nursing_router, prefix='/nursing', tags=['nursing'])
api_router.include_router(nutrition_router, prefix='/nutrition', tags=['nutrition'])
api_router.include_router(social_psych_router, prefix='/social_psych', tags=['social_psych'])
api_router.include_router(logistics_it_router, prefix='/logistics_it', tags=['logistics_it'])
api_router.include_router(security_safety_router, prefix='/security_safety', tags=['security_safety'])
api_router.include_router(executive_router, prefix='/executive', tags=['executive'])
api_router.include_router(quality_accreditation_router, prefix='/quality_accreditation', tags=['quality_accreditation'])
api_router.include_router(education_research_router, prefix='/education_research', tags=['education_research'])
api_router.include_router(hr_admin_router, prefix='/hr_admin', tags=['hr_admin'])
api_router.include_router(centers_of_excellence_router, prefix='/centers_of_excellence', tags=['centers_of_excellence'])
api_router.include_router(rare_advanced_router, prefix='/rare_advanced', tags=['rare_advanced'])
