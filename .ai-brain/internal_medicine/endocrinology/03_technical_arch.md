# 03_technical_arch.md - Endocrinology Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `endocrine_engine.js`.

### A. API Specifications
- `POST /api/endocrine/glucose/log`: Records glucose/HbA1c.
- `POST /api/endocrine/thyroid/metrics`: Logs TSH/T4/T3.
- `POST /api/endocrine/ai/predict-glucose`: Triggers AI glucose trend analysis.

## 2. Data Model
- `diabetes_logs`: (id, patient_id, tenant_id, glucose_value, hba1c, insulin_dose).
- `thyroid_metrics`: (id, patient_id, tenant_id, tsh, t4, t3, nodule_size).

## 3. Golden Access Rule
- `requireRole('endocrine_specialist')` enforced.
