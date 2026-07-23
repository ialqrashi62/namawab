# 03_technical_arch.md - Plastic Surgery Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `plastic_surgery_engine.js`.

### A. API Specifications
- `POST /api/surgery/plastic/session`: Records a plastic surgery session.
- `POST /api/surgery/plastic/flap-log`: Logs flap perfusion and viability.
- `POST /api/surgery/ai/analyze-symmetry`: Triggers AI facial symmetry analysis.

## 2. Data Model
- `plastic_surgery_sessions`: (id, patient_id, tenant_id, procedure_type, flap_used, perfusion_index).
- `aesthetic_logs`: (id, session_id, tenant_id, target_area, material_used, session_count).

## 3. Golden Access Rule
- `requireRole('plastic_surgeon')` enforced.
