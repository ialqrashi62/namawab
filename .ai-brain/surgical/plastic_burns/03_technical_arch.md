# 03 Technical Architecture — Plastic, Reconstructive & Burns Surgery

## 1. API Endpoints
- `POST /api/plastic-burns/consultation`
- `POST /api/plastic-burns/burn-assessment`
- `POST /api/plastic-burns/wound-log`
- `POST /api/plastic-burns/implant-log`
- `GET /api/plastic-burns/photo-timeline`

## 2. Data Model
- `plastic_surgery_consultations` (id, patient_id, tenant_id, procedure_type, consent_photo_ids, status).
- `burn_assessments` (id, patient_id, tenant_id, tbsa_percent, depth, resuscitation_volume, created_at).
- `wound_logs` (id, patient_id, tenant_id, wound_site, stage, size_mm, dressing, next_review).
- `implant_logs` (id, patient_id, tenant_id, product_name, serial_number, volume_ml, expiration_date).

## 3. Integration
- OR booking, anesthesia/PACU, pathology, billing, PHI vault for photos.

## 4. Security
- `requireRole('plastic_surgeon')` / `requireRole('burn_specialist')`, `requireTenantScope`, RLS.

## 5. Migration
- `eXX_plastic_burns_up.sql` / `_down.sql`.
