# 03 Technical Architecture — Surgical Suite

## 1. API Endpoints
- `GET /api/surgery/subspecialties`
- `POST /api/surgery/booking`
- `POST /api/surgery/safety-checklist`
- `POST /api/surgery/implant-log`
- `PUT /api/surgery/complete`

## 2. Data Model
- `surgical_bookings` (id, patient_id, tenant_id, subspecialty, procedure, scheduled_date, status).
- `surgical_safety_checklists` (id, booking_id, tenant_id, sign_in, time_out, sign_out, completed_by).
- `surgical_implant_logs` (id, booking_id, tenant_id, implant_type, serial_number, lot_number).

## 3. Integration
- Anesthesia, PACU, CSSD, inventory, billing, pathology, radiology.

## 4. Security
- `requireRole('surgeon')` / `requireRole('or_nurse')` / `requireRole('anesthesiologist')`, `requireTenantScope`.

## 5. Migration
- `eXX_surgical_hub_up.sql` / `_down.sql`.
