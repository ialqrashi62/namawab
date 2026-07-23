# 03 Technical Architecture — Pediatrics

## 1. API Endpoints
- `POST /api/pediatrics/visit`
- `POST /api/pediatrics/growth`
- `POST /api/pediatrics/immunization`
- `GET /api/pediatrics/growth-chart`
- `GET /api/pediatrics/immunization-status`

## 2. Data Model
- `pediatric_visits` (id, patient_id, tenant_id, visit_date, guardian_id, chief_complaint, diagnosis).
- `pediatric_growth_logs` (id, patient_id, tenant_id, date, height_cm, weight_kg, head_circumference_cm, who_percentile).
- `immunization_records` (id, patient_id, tenant_id, vaccine_code, dose_number, date_given, next_due_date).

## 3. Integration
- CPOE, LIS/RIS, pharmacy, pediatric subspecialty referrals.

## 4. Security
- `requireRole('pediatrician')` / `requireRole('pediatric_nurse')`, `requireTenantScope`, RLS.

## 5. Migration
- `eXX_pediatrics_up.sql` / `_down.sql`.
