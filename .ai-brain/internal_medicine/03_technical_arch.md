# 03 Technical Architecture — Internal Medicine Suite

## 1. API Endpoints
- `GET /api/internal-medicine/subspecialties`
- `POST /api/internal-medicine/referral`
- `POST /api/internal-medicine/chronic-registry`
- `GET /api/internal-medicine/guideline-match`

## 2. Data Model
- `internal_medicine_referrals` (id, patient_id, tenant_id, from_specialty, to_specialty, reason, status).
- `chronic_disease_registry` (id, patient_id, tenant_id, condition_code, diagnosis_date, last_visit, next_due).
- `subspecialty_encounters` (id, referral_id, tenant_id, encounter_date, notes, plan).

## 3. Integration
- CPOE, LIS, RIS, pharmacy, surgery, critical care.

## 4. Security
- `requireRole('internal_medicine_physician')` / `requireRole('subspecialist')`, `requireTenantScope`.

## 5. Migration
- `eXX_internal_medicine_hub_up.sql` / `_down.sql`.
