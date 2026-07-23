# 03_technical_arch.md - ENT Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `ent_surgery_engine.js`.

### A. API Specifications
- `POST /api/surgery/ent/session`: Records an ENT surgical session.
- `POST /api/surgery/ent/audiogram`: Logs pre/post-op audiometry.
- `POST /api/surgery/ai/analyze-sinus`: Triggers AI analysis of sinus CT.

## 2. Data Model
- `ent_surgery_sessions`: (id, patient_id, tenant_id, side [L/R/Bilateral], procedure_type, implant_model).
- `ent_audiometry_logs`: (id, session_id, tenant_id, frequency_db, type [Air/Bone]).

## 3. Golden Access Rule
- `requireRole('ent_surgeon')` enforced.
