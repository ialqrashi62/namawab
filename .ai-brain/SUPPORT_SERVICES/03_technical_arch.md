# 03_technical_arch.md - Support Services Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `nursing_engine.js`, `inventory_engine.js`, and `hr_engine.js`.

### A. API Specifications
- `POST /api/support/nursing/handover`: Logs a shift handover report.
- `POST /api/support/nutrition/order`: Records a therapeutic diet order.
- `POST /api/support/biomed/maintenance`: Logs equipment calibration/repair.

## 2. Data Model
- `nursing_handovers`: (id, ward_id, tenant_id, nurse_id, patient_id, status, notes).
- `nutrition_orders`: (id, patient_id, tenant_id, diet_type, calories, restrictions).
- `biomed_logs`: (id, equipment_id, tenant_id, maintenance_type, technician_id, next_due_date).

## 3. The Golden Access Rule
- **Admin/Owner:** Full access.
- **Nurse/Technician:** Access to their respective `support_*` routes.
- **Others:** Denied via `requireRole('nurse')` or `requireRole('biomed_tech')`.
