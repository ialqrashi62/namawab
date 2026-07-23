# 03_technical_arch.md - Urology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `urology_surgery_engine.js`.

### A. API Specifications
- `POST /api/surgery/urology/session`: Records a urological surgical session.
- `POST /api/surgery/urology/stone-log`: Logs stone characteristics and removal success.
- `POST /api/surgery/ai/analyze-prostate`: Triggers AI prostate cancer staging.

## 2. Data Model
- `urology_surgery_sessions`: (id, patient_id, tenant_id, procedure_type, stent_used, duration).
- `urology_stone_logs`: (id, session_id, tenant_id, stone_size_mm, location, fragmentation_rate).

## 3. Golden Access Rule
- `requireRole('urology_surgeon')` enforced.
