# 06_implementation_plan.md - Radiology (RIS/PACS) Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e81_radiology_up.sql`.
- Tables: `radiology_orders`, `radiology_schedules`, `radiology_scans`, `radiology_reports`, `critical_finding_alerts`, `pacs_studies`, `radiation_dose_logs`.
- Reverse: `e81_radiology_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `radiology_engine.js` and integrate with PACS (DICOM C-STORE/C-FIND).
- Implement `ai_radiology_orchestrator.js` (lesion detection + report synthesizer).
- Add routes to `server.js` with `requireRole('radiologist')` / `requireRole('radiology_tech')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `radiology-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add DICOM viewer, structured report editor, and critical finding banner.

## 4. Phase 4: QA
- Unit tests for critical finding communication and ALARA dose threshold alerts.
- Integration tests with CPOE, PACS, and billing.
- Security audit for Golden Access Rule and PHI vault DICOM access.
