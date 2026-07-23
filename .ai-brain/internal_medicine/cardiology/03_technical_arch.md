# 03_technical_arch.md - Cardiology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic & Engine Integration
The module extends the existing `cardiology_engine.js` and `interventional_cardiology_engine.js`.

### A. API Specifications (OpenAPI)
- `POST /api/cardiology/cath-lab/procedure`: Records a new catheterization session.
- `GET /api/cardiology/ep/mapping`: Retrieves electrophysiology mapping data.
- `POST /api/cardiology/ai/analyze-ecg`: Triggers the LangChain ECG analysis pipeline.

## 2. Data Model & ERD Extensions
### New Tables / Extensions:
- `cardiology_procedures`: (id, patient_id, procedure_type, operator_id, d2b_time, contrast_vol).
- `ep_mapping_data`: (id, procedure_id, electrode_site, voltage, timing).
- `nuclear_imaging_results`: (id, patient_id, isotope, perfusion_score, ejection_fraction).

### Tenant Isolation (RLS):
- All tables implement `tenant_id` with `FORCE_RLS=150`.

## 3. The Golden Access Rule (Enforcement)
- **Admin/Owner:** Full access to all cardiology endpoints.
- **Cardiology Specialist:** Access to `cardiology_*` routes.
- **Other Specialists:** Access denied via `requireRole('cardiology_specialist')` middleware.

## 4. Infrastructure
- **Storage:** Radiology images (DICOM) stored in `phi_vault/` outside webroot.
- **Caching:** Redis for frequent AI-suggested diagnosis lookups.
