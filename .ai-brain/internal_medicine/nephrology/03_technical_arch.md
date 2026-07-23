# 03_technical_arch.md - Nephrology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic & Engine Integration
Extends the `nephrology_engine.js` (S-MODE).

### A. API Specifications (OpenAPI)
- `POST /api/nephrology/dialysis/session`: Records a dialysis session.
- `POST /api/nephrology/transplant/followup`: Logs post-transplant metrics.
- `POST /api/nephrology/ai/analyze-biopsy`: Triggers the AI biopsy analysis pipeline.

## 2. Data Model & ERD Extensions
### New Tables:
- `dialysis_sessions`: (id, patient_id, tenant_id, session_type [HD/PD], pre_weight, post_weight, uf_volume, ktv_value).
- `renal_transplant_records`: (id, patient_id, tenant_id, donor_id, transplant_date, immunosuppressant_regimen).
- `nephrology_labs`: (id, patient_id, tenant_id, creatinine, urea, potassium, phosphorus, calcium).

### Tenant Isolation:
- All tables implement `tenant_id` with `FORCE_RLS=150`.

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Nephrologist:** Access to `nephrology_*` routes.
- **Others:** Denied via `requireRole('nephrology_specialist')`.
