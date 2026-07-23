# 03 Technical Architecture — Rehabilitation Support Services

## 1. API Endpoints
- `POST /api/rehab-support/equipment-loan`
- `POST /api/rehab-support/home-assessment`
- `POST /api/rehab-support/caregiver-training`
- `POST /api/rehab-support/community-referral`

## 2. Data Model
- `rehab_equipment_loans` (id, patient_id, tenant_id, equipment_type, loan_date, return_date, condition).
- `rehab_home_assessments` (id, patient_id, tenant_id, assessment_date, modifications_needed, safety_score).
- `rehab_caregiver_trainings` (id, patient_id, tenant_id, topic, trainer, date, caregiver_ack).

## 3. Integration
- Rehabilitation module, ADT, inventory.

## 4. Security
- `requireRole('rehab_therapist')` / `requireRole('social_worker')`, `requireTenantScope`.

## 5. Migration
- `eXX_rehab_support_up.sql` / `_down.sql`.
