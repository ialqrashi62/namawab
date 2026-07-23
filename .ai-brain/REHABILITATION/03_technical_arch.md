# 03_technical_arch.md - Rehabilitation Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `rehab_engine.js`.

### A. API Specifications
- `POST /api/rehab/session/log`: Records a therapy session.
- `POST /api/rehab/rom/log`: Logs Range of Motion measurements.
- `POST /api/rehab/ai/predict-recovery`: Triggers AI recovery prediction.

## 2. Data Model
- `rehab_sessions`: (id, patient_id, tenant_id, therapist_id, modality [PT/OT/ST], duration).
- `rom_measurements`: (id, session_id, tenant_id, joint, angle_degrees, improvement_pct).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Therapist:** Access to `rehab_*` routes.
- **Others:** Denied via `requireRole('rehab_specialist')`.
