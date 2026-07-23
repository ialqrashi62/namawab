# 03_technical_arch.md - Oncology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `oncology_engine.js`.

### A. API Specifications
- `POST /api/oncology/chemo/cycle`: Logs a chemotherapy session.
- `POST /api/oncology/bmt/engraftment`: Records stem cell engraftment metrics.
- `POST /api/oncology/ai/analyze-genomics`: Triggers the AI genomic analysis.

## 2. Data Model
- `oncology_chemo_logs`: (id, patient_id, tenant_id, drug_name, dose, cycle_number, toxicity_grade).
- `bmt_monitoring`: (id, patient_id, tenant_id, cd34_count, engraftment_date, gvhd_grade).

## 3. Golden Access Rule
- `requireRole('oncology_specialist')` enforced.
