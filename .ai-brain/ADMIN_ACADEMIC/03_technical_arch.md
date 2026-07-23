# 03_technical_arch.md - Administrative Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `finance_engine.js`, `hr_engine.js`, and `quality_engine.js`.

### A. API Specifications
- `POST /api/admin/quality/audit`: Records a quality audit finding.
- `POST /api/admin/research/irb`: Submits a research project for IRB approval.
- `POST /api/admin/hr/credential`: Logs a doctor's license verification.

## 2. Data Model
- `quality_audits`: (id, tenant_id, auditor_id, standard_ref, finding, severity, action_plan).
- `research_projects`: (id, tenant_id, principal_investigator, irb_status, patient_cohort_size).
- `staff_credentials`: (id, user_id, tenant_id, license_number, expiry_date, specialty_verified).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Quality/HR Manager:** Access to their respective `admin_*` routes.
- **Others:** Denied via `requireRole('quality_manager')` or `requireRole('hr_manager')`.
