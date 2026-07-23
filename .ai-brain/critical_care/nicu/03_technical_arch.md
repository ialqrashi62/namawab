# 03_technical_arch.md - NICU Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `nicu_engine.js` and integrates with delivery room, APGAR, and TPN pharmacy.

### A. API Specifications
- `POST /api/nicu/admit`: Opens a NICU admission linked to delivery.
- `POST /api/nicu/vitals`: Records incubator vitals (HR, SpO2, RR, Temp).
- `POST /api/nicu/tpn`: Logs TPN composition and infusion rate.
- `POST /api/nicu/growth`: Records weight, length, and head circumference.

## 2. Data Model
- `nicu_admissions`: (id, patient_id, mother_id, tenant_id, admit_time, discharge_time, apgar_1min, apgar_5min, birth_weight).
- `nicu_vitals`: (id, admission_id, tenant_id, recorded_at, hr, spo2, rr, temperature, glucose).
- `nicu_tpn_logs`: (id, admission_id, tenant_id, composition_json, infusion_rate, start_time).
- `neonatal_growth_logs`: (id, admission_id, tenant_id, recorded_at, weight_g, length_cm, head_circumference_cm, growth_percentile).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Neonatologist / NICU Nurse:** Access to `nicu_*` routes.
- **Others:** Denied via `requireRole('neonatologist')` or `requireRole('nicu_nurse')`.
