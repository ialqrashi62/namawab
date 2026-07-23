# 03_technical_arch.md - Functional Tests Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `functional_test_engine.js`.

### A. API Specifications
- `POST /api/functional/test/log`: Records a functional test session.
- `POST /api/functional/ai/analyze-waveform`: Triggers AI waveform analysis.

## 2. Data Model
- `functional_test_results`: (id, patient_id, tenant_id, test_type, waveform_path, interpretation).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Specialist:** Access to `functional_*` routes.
- **Others:** Denied via `requireRole('functional_specialist')`.
