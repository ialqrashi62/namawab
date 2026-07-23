# 03_technical_arch.md - Integrative Medicine Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `integrative_engine.js`.

### A. API Specifications
- `POST /api/integrative/session/log`: Records a complementary therapy session.
- `POST /api/integrative/herbal/log`: Logs herbal prescriptions.
- `POST /api/integrative/ai/analyze-synergy`: Triggers AI synergy analysis.

## 2. Data Model
- `integrative_sessions`: (id, patient_id, tenant_id, therapy_type, practitioner_id, duration).
- `herbal_prescriptions`: (id, session_id, tenant_id, herb_name, dosage, frequency).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Integrative Specialist:** Access to `integrative_*` routes.
- **Others:** Denied via `requireRole('integrative_specialist')`.
