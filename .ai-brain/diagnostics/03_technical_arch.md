# 03 Technical Architecture — Diagnostics Suite

## 1. API Endpoints
- `POST /api/diagnostics/lab/order`
- `POST /api/diagnostics/radiology/order`
- `POST /api/diagnostics/pathology/specimen`
- `POST /api/diagnostics/blood-bank/crossmatch`
- `POST /api/diagnostics/functional-test`

## 2. Data Model
- `lab_orders`, `lab_specimens`, `lab_results`.
- `radiology_orders`, `radiology_reports`, `pacs_studies`.
- `pathology_specimens`, `pathology_reports`.
- `blood_bank_inventory`, `transfusion_records`.
- `functional_test_studies`.

## 3. Integration
- CPOE, LIS, RIS-PACS, billing, nursing station.

## 4. Security
- `requireRole('lab_technologist')` / `requireRole('radiologist')` / `requireRole('pathologist')` / `requireRole('blood_bank_officer')`, `requireTenantScope`.

## 5. Migration
- `eXX_diagnostics_hub_up.sql` / `_down.sql`.
