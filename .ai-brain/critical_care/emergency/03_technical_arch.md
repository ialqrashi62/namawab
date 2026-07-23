# 03_technical_arch.md - Emergency Department Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `er_engine.js` and integrates with ESI scoring, NEWS2, and ADT.

### A. API Specifications
- `POST /api/er/triage`: Records ESI triage with vitals and chief complaint.
- `POST /api/er/bed-assignment`: Assigns a bed in resuscitation / acute / fast-track zones.
- `POST /api/er/treatment`: Logs treatments and procedures.
- `PUT /api/er/disposition`: Records admit / discharge / transfer / OR / DAMA.

## 2. Data Model
- `er_visits`: (id, patient_id, tenant_id, arrival_time, chief_complaint, esi_level, disposition, door_to_provider_min, door_to_disposition_min).
- `er_triage_logs`: (id, visit_id, tenant_id, vitals_json, allergies, mode_of_arrival).
- `er_bed_assignments`: (id, visit_id, tenant_id, zone, bed_id, assigned_at, released_at).
- `er_treatments`: (id, visit_id, tenant_id, treatment_code, timestamp, provider_id).
- `er_dispositions`: (id, visit_id, tenant_id, disposition_type, destination, timestamp).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **ER Physician / ER Nurse:** Access to `er_*` routes.
- **Others:** Denied via `requireRole('emergency_physician')` or `requireRole('er_nurse')`.
