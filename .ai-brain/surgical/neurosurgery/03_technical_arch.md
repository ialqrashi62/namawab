# 03_technical_arch.md - Neurosurgery Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `neuro_surgery_engine.js`.

### A. API Specifications
- `POST /api/surgery/neuro/session`: Records a neurosurgical session.
- `POST /api/surgery/spine/fusion`: Logs spinal fusion details.
- `POST /api/surgery/ai/analyze-neuromonitoring`: Triggers AI analysis of MEP/SSEP.

## 2. Data Model
- `neuro_surgery_sessions`: (id, patient_id, tenant_id, icp_max, anesthesia_type, navigation_system_used).
- `spine_fusion_records`: (id, session_id, tenant_id, levels_fused, hardware_type, stability_score).

## 3. Golden Access Rule
- `requireRole('neuro_surgeon')` enforced.
