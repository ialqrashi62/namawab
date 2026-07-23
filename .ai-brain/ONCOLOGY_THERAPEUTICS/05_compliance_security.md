# 05 Compliance & Security — Oncology Therapeutics & Infusion Services

## 1. Compliance
- Saudi MOH oncology protocols.
- CBAHI medication safety and chemotherapy standards.
- JCI high-alert medication management.
- Saudi PDPL for patient data.

## 2. Security
- `requireRole('oncologist')` / `requireRole('oncology_pharmacist')` / `requireRole('infusion_nurse')`, `requireTenantScope`.
- Chemotherapy orders require dual verification.
- PHI vault for infusion records and reaction documentation.

## 3. Audit
- Hash-chained audit for order verification, dose changes, infusion start/stop, and toxicity entries.

## 4. Safety Gates
- Protocol and dose hard stop before verification.
- Organ function threshold alerts.
- Infusion reaction emergency workflow.

## 5. Data Retention
- Oncology records retained per policy; audit logs 7+ years.
