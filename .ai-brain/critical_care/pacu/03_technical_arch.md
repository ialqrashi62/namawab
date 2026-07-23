# 03_technical_arch.md - PACU Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `pacu_engine.js` and integrates with OR schedule, OR anesthesia, and ward handoff.

### A. API Specifications
- `POST /api/pacu/admit`: Opens a PACU record linked to the surgery.
- `POST /api/pacu/assessment`: Records vitals, Aldrete, pain, nausea.
- `PUT /api/pacu/discharge`: Marks discharge to ward / home / ICU; blocked unless Aldrete ≥ 9 or anesthesiologist override.

## 2. Data Model
- `pacu_records`: (id, surgery_id, patient_id, tenant_id, admit_time, discharge_time, discharge_to, override_reason).
- `pacu_vitals`: (id, pacu_record_id, tenant_id, recorded_at, hr, bp, spo2, rr, pain_score, nausea_score).
- `pacu_alerte_scores`: (id, pacu_record_id, tenant_id, recorded_at, activity, respiration, circulation, consciousness, spo2).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **PACU Nurse / Anesthesiologist:** Access to `pacu_*` routes.
- **Others:** Denied via `requireRole('pacu_nurse')` or `requireRole('anesthesiologist')`.
