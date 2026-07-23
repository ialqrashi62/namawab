# 03_technical_arch.md - Ophthalmology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `ophthalmology_engine.js`.

### A. API Specifications
- `POST /api/surgery/eye/session`: Records an eye surgery session.
- `POST /api/surgery/eye/biometry`: Logs pre-op biometry data.
- `POST /api/surgery/ai/analyze-oct`: Triggers AI analysis of OCT scans.

## 2. Data Model
- `eye_surgery_sessions`: (id, patient_id, tenant_id, eye_side [L/R], procedure_type, iol_model, iol_power).
- `eye_biometry_logs`: (id, session_id, tenant_id, axial_length, keratometry, predicted_iol).

## 3. Golden Access Rule
- `requireRole('eye_surgeon')` enforced.
