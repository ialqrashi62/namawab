# 03_technical_arch.md - Orthopedics Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `orthopedic_engine.js`.

### A. API Specifications
- `POST /api/surgery/ortho/joint-replacement`: Records a joint replacement session.
- `POST /api/surgery/ortho/trauma`: Logs a fracture fixation procedure.
- `POST /api/surgery/ai/predict-rom`: Triggers AI Range of Motion prediction.

## 2. Data Model
- `ortho_joint_replacements`: (id, patient_id, tenant_id, joint_type, implant_model, alignment_angle).
- `ortho_trauma_logs`: (id, patient_id, tenant_id, fracture_type, fixation_method, hardware_used).

## 3. Golden Access Rule
- `requireRole('orthopedic_surgeon')` enforced.
