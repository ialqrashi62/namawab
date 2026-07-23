# 03_technical_arch.md - Cardiothoracic Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `cardio_thoracic_engine.js`.

### A. API Specifications
- `POST /api/surgery/cardio/session`: Records a heart/lung surgery session.
- `POST /api/surgery/vascular/graft`: Logs graft details and patency.
- `POST /api/surgery/ai/analyze-hemodynamics`: Triggers AI hemodynamic analysis.

## 2. Data Model
- `cardio_surgery_sessions`: (id, patient_id, tenant_id, pump_time, cross_clamp_time, bypass_flow).
- `vascular_grafts`: (id, session_id, tenant_id, graft_type, diameter, location).

## 3. Golden Access Rule
- `requireRole('cardio_thoracic_surgeon')` enforced.
