# 03_technical_arch.md - Dermatology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `dermatology_engine.js`.

### A. API Specifications
- `POST /api/derm/lesion/log`: Records a skin lesion and its location.
- `POST /api/derm/cosmetic/procedure`: Logs a cosmetic treatment.
- `POST /api/derm/ai/analyze-image`: Triggers the AI image analysis pipeline.

## 2. Data Model
- `derm_lesion_records`: (id, patient_id, tenant_id, location, description, biopsy_status).
- `derm_cosmetic_logs`: (id, patient_id, tenant_id, procedure_type, laser_settings, session_count).

## 3. Golden Access Rule
- `requireRole('derm_specialist')` enforced.
