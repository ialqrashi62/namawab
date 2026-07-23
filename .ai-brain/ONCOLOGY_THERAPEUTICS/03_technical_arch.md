# 03_technical_arch.md - Oncology Therapeutics Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `radiation_engine.js`.

### A. API Specifications
- `POST /api/rad_onco/plan/log`: Records a radiation treatment plan.
- `POST /api/rad_onco/dose/log`: Logs the daily delivered dose.
- `POST /api/rad_onco/ai/predict-toxicity`: Triggers AI toxicity prediction.

## 2. Data Model
- `radiation_plans`: (id, patient_id, tenant_id, modality [IMRT/SRS], total_dose_gy, fractions).
- `dose_logs`: (id, plan_id, tenant_id, delivered_dose, date, variance).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Radiation Oncologist:** Access to `rad_onco_*` routes.
- **Others:** Denied via `requireRole('rad_onco_specialist')`.
