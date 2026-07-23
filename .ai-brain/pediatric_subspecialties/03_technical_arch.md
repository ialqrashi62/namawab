# 03 Technical Architecture — Pediatric Subspecialties

## 1. API Endpoints
- `POST /api/pediatric-subspecialty/referral`
- `POST /api/pediatric-subspecialty/assessment`
- `POST /api/pediatric-subspecialty/score`
- `GET /api/pediatric-subspecialty/transition-readiness`

## 2. Data Model
- `pediatric_subspecialty_referrals` (id, patient_id, tenant_id, subspecialty, reason, priority, status).
- `pediatric_subspecialty_assessments` (id, referral_id, tenant_id, diagnosis, plan, next_review).
- `pediatric_subspecialty_scores` (id, patient_id, tenant_id, score_type, value, date).

## 3. Integration
- General pediatrics, CPOE, LIS/RIS, pharmacy, surgery, ICU.

## 4. Security
- `requireRole('pediatric_subspecialist')`, `requireTenantScope`, RLS.

## 5. Migration
- `eXX_pediatric_subspecialties_up.sql` / `_down.sql`.
