# 03_technical_arch.md - Anesthesia Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `anesthesia_engine.js` and integrates with the OR schedule and PACU handoff.

### A. API Specifications
- `POST /api/anesthesia/pre-op`: Records ASA class, Mallampati, allergies, consent.
- `POST /api/anesthesia/log-vitals`: Logs intra-op vitals at 5-min intervals.
- `POST /api/anesthesia/drug`: Records drug administration with dose and time.
- `PUT /api/anesthesia/complete`: Marks anesthesia complete and triggers PACU handoff.

## 2. Data Model
- `anesthesia_records`: (id, surgery_id, patient_id, tenant_id, anesthesiologist_id, asa_class, mallampati, start_time, end_time).
- `anesthesia_drug_logs`: (id, record_id, tenant_id, drug_name, dose, unit, time_given, route).
- `airway_assessments`: (id, record_id, tenant_id, mallampati, thyromental_distance, neck_mobility, mouth_opening).
- `asa_assessments`: (id, record_id, tenant_id, asa_class, comorbidities_json, airway_notes).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Anesthesiologist:** Access to `anesthesia_*` routes.
- **Others:** Denied via `requireRole('anesthesiologist')`.
