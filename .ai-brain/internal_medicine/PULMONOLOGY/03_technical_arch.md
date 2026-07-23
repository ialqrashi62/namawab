# 03_technical_arch.md - Pulmonology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic & Engine Integration
Extends the `pulmonology_engine.js` (S-MODE).

### A. API Specifications (OpenAPI)
- `POST /api/pulmonology/spirometry`: Records PFT results.
- `POST /api/pulmonology/sleep-study`: Logs polysomnography metrics.
- `POST /api/pulmonology/ai/analyze-pft`: Triggers the AI PFT analysis pipeline.

## 2. Data Model & ERD Extensions
### New Tables:
- `pulmonary_function_tests`: (id, patient_id, tenant_id, fev1, fvc, ratio, peak_flow).
- `sleep_study_results`: (id, patient_id, tenant_id, ahi, odi, arousal_index, cpap_pressure).
- `bronchoscopy_reports`: (id, patient_id, tenant_id, site_sampled, biopsy_result, sedation_type).

### Tenant Isolation:
- All tables implement `tenant_id` with `FORCE_RLS=150`.

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Pulmonologist:** Access to `pulmonology_*` routes.
- **Others:** Denied via `requireRole('pulmonology_specialist')`.
