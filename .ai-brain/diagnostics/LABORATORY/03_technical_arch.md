# 03_technical_arch.md - Laboratory Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `lis.js` (Laboratory Information System).

### A. API Specifications
- `POST /api/lab/result/upload`: Records a new lab result.
- `GET /api/lab/ai/analyze-trends`: Triggers AI longitudinal lab analysis.
- `POST /api/lab/qc/verify`: Logs quality control verification.

## 2. Data Model
- `lab_results`: (id, patient_id, tenant_id, test_code, value, unit, reference_range, status [Preliminary/Final]).
- `lab_qc_logs`: (id, test_code, tenant_id, control_value, expected_value, variance).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Pathologist/Lab Tech:** Access to `lab_*` routes.
- **Others:** Denied via `requireRole('lab_specialist')`.
