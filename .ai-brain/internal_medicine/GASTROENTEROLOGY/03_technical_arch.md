# 03_technical_arch.md - Gastroenterology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic & Engine Integration
Extends the `gastro_engine.js` (S-MODE).

### A. API Specifications (OpenAPI)
- `POST /api/gastro/endoscopy/report`: Records a new endoscopy session.
- `POST /api/gastro/hepatology/meld`: Calculates and logs MELD score.
- `POST /api/gastro/ai/analyze-findings`: Triggers the AI-Brain for endoscopic image/text analysis.

## 2. Data Model & ERD Extensions
### New Tables:
- `gastro_endoscopy_reports`: (id, patient_id, tenant_id, procedure_type [EUS/ERCP], findings, biopsy_taken, outcome).
- `hepatology_metrics`: (id, patient_id, tenant_id, bilirubin, albumin, inr, creatinine, meld_score).
- `gi_motility_studies`: (id, patient_id, tenant_id, manometry_results, transit_time).

### Tenant Isolation:
- All tables implement `tenant_id` with `FORCE_RLS=150`.

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Gastroenterologist:** Access to `gastro_*` routes.
- **Others:** Denied via `requireRole('gastro_specialist')`.
