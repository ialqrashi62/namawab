# 03_technical_arch.md - ICU Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `icu_engine.js` and integrates with SCCM guidelines, sepsis bundles, and ventilator interfaces.

### A. API Specifications
- `POST /api/icu/admission`: Opens an ICU admission record.
- `POST /api/icu/vitals`: Records continuous vitals (MAP, SpO2, HR, RR, Temp).
- `POST /api/icu/ventilator`: Logs ventilator mode and settings.
- `POST /api/icu/sepsis-bundle`: Tracks 1-hour and 3-hour bundle elements.
- `POST /api/icu/daily-goals`: Captures the daily-goals checklist.

## 2. Data Model
- `icu_admissions`: (id, patient_id, tenant_id, admit_time, discharge_time, apache_score, sofa_score, outcome).
- `icu_vitals`: (id, admission_id, tenant_id, recorded_at, map, hr, spo2, rr, lactate).
- `icu_ventilator_logs`: (id, admission_id, tenant_id, mode, peep, fio2, tidal_volume, rsbi).
- `sepsis_bundle_tracking`: (id, admission_id, tenant_id, bundle_type, element, completed_at).
- `icu_daily_goals`: (id, admission_id, tenant_id, goal_date, pain_goal, sedation_goal, mobility, family_communicated).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Intensivist / ICU Nurse:** Access to `icu_*` routes.
- **Others:** Denied via `requireRole('intensivist')` or `requireRole('icu_nurse')`.
