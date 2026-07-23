# 03_technical_arch.md - Radiology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `radiology_engine.js` and integrates with PACS.

### A. API Specifications
- `POST /api/radiology/scan/upload`: Handles DICOM upload to `phi_vault/`.
- `GET /api/radiology/ai/analyze-scan`: Triggers AI-based lesion detection.
- `POST /api/radiology/report/finalize`: Locks the report and triggers notifications.

## 2. Data Model
- `radiology_scans`: (id, patient_id, tenant_id, modality [CT/MRI/XRAY], study_uid, image_path).
- `radiology_reports`: (id, scan_id, tenant_id, findings, impression, status [Draft/Final]).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Radiologist:** Access to `radiology_*` routes.
- **Others:** Denied via `requireRole('radiologist')`.
