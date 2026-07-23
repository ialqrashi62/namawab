# 03 Technical Architecture — OB/GYN & Pediatrics Suite
**Expert: Principal Software Architect**

## 1. API Endpoints
- `POST /api/obgyn-peds/antenatal-visit`
- `POST /api/obgyn-peds/partogram`
- `POST /api/obgyn-peds/delivery`
- `POST /api/obgyn-peds/growth`
- `POST /api/obgyn-peds/immunization`

## 2. Data Model
- `obgyn_pregnancies` (id, patient_id, tenant_id, lmp, edd, status).
- `obgyn_partograms` (id, pregnancy_id, tenant_id, cervical_dilation, fetal_station, contractions).
- `obgyn_deliveries` (id, pregnancy_id, tenant_id, delivery_mode, apgar_1, apgar_5, birth_weight).
- `pediatric_growth_logs` (id, patient_id, tenant_id, date, height_cm, weight_kg, who_percentile).
- `immunization_records` (id, patient_id, tenant_id, vaccine_code, dose_number, date_given, next_due_date).

## 3. Integration
- CPOE, LIS, RIS, pharmacy, NICU, pediatric subspecialties, billing.

## 4. Security
- `requireRole('obstetrician')` / `requireRole('pediatrician')` / `requireRole('midwife')`, `requireTenantScope`.
- Golden Access Rule: Owner/Admin full access; OB/GYN/Pediatrician access to `obgyn_*` and `peds_*` routes; others denied.

## 5. Migration
- `eXX_obgyn_peds_hub_up.sql` / `_down.sql`.
