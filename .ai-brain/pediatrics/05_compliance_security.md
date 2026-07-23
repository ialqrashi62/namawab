# 05 Compliance & Security — Pediatrics

## 1. Compliance
- Saudi MOH immunization schedule.
- CBAHI pediatric safety standards.
- Saudi PDPL for pediatric data and guardian access.

## 2. Security
- `requireRole('pediatrician')` / `requireRole('pediatric_nurse')`, `requireTenantScope`.
- Guardian-linked access for portal.
- Restricted access to sensitive pediatric notes.

## 3. Audit
- Hash-chained audit for growth entries, immunizations, medication dosing, and guardian consent.

## 4. Safety Gates
- Guardian consent for procedures.
- Weight-based dosing verification.
- Allergy and contraindication hard stop.

## 5. Data Retention
- Pediatric records retained per institutional policy; audit logs 7+ years.
