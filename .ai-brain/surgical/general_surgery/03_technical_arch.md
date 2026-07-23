# 03_technical_arch.md - General Surgery Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `surgery_engine.js` (S-MODE).

### A. API Specifications
- `POST /api/surgery/general/session`: Records a new surgical session.
- `POST /api/surgery/general/checklist`: Logs the WHO Surgical Safety Checklist.
- `POST /api/surgery/ai/predict-recovery`: Triggers AI post-op recovery prediction.

## 2. Data Model
- `surgery_sessions`: (id, patient_id, tenant_id, surgeon_id, procedure_type, start_time, end_time, anesthesia_type).
- `surgical_checklists`: (id, session_id, tenant_id, sign_in_ok, time_out_ok, sign_out_ok, instrument_count_verified).
- `surgical_outcomes`: (id, session_id, tenant_id, complication_grade, recovery_time, pathology_result).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **General Surgeon:** Access to `surgery/general_*` routes.
- **Others:** Denied via `requireRole('general_surgeon')`.
