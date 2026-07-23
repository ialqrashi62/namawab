# 03 Technical Architecture — Obstetrics & Gynecology

## 1. API Endpoints
- `POST /api/obgyn/antenatal-visit`
- `POST /api/obgyn/partogram`
- `POST /api/obgyn/delivery`
- `POST /api/obgyn/postpartum`
- `GET /api/obgyn/pregnancy-summary`

## 2. Data Model
- `obgyn_pregnancies` (id, patient_id, tenant_id, lmp, edd, gravida, para, status).
- `obgyn_antenatal_visits` (id, pregnancy_id, tenant_id, visit_date, ga_weeks, bp, weight, fetal_heart_rate, risk_flags).
- `obgyn_partograms` (id, pregnancy_id, tenant_id, cervical_dilation, fetal_station, contractions, maternal_vitals).
- `obgyn_deliveries` (id, pregnancy_id, tenant_id, delivery_mode, apgar_1, apgar_5, birth_weight, complications).

## 3. Integration
- CPOE, LIS/RIS, NICU, billing, NPHIES eligibility.

## 4. Security
- `requireRole('obstetrician')` / `requireRole('midwife')`, `requireTenantScope`, RLS.

## 5. Migration
- `eXX_obgyn_up.sql` / `_down.sql`.
