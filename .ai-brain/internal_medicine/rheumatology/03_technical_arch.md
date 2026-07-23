# 03_technical_arch.md - Rheumatology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `rheumatology_engine.js`.

### A. API Specifications
- `POST /api/rheuma/das28/log`: Records DAS28 score.
- `POST /api/rheuma/serology/log`: Logs ANA, RF, anti-CCP.
- `POST /api/rheuma/ai/analyze-cluster`: Triggers AI autoimmune cluster analysis.

## 2. Data Model
- `rheuma_scores`: (id, patient_id, tenant_id, das28, sledai, la28).
- `autoimmune_markers`: (id, patient_id, tenant_id, ana_titer, rf_level, anti_ccp).

## 3. Golden Access Rule
- `requireRole('rheuma_specialist')` enforced.
