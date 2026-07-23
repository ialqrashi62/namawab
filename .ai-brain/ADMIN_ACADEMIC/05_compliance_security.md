# 05 Compliance & Security — Administration, HR & Academic Affairs

## 1. Compliance
- SCFHS credentialing and CME requirements.
- CBAHI governance and quality standards.
- Saudi PDPL for staff and audit data.
- JCI human resources management.

## 2. Security
- `requireRole('hr_manager')` / `requireRole('admin_officer')` / `requireRole('auditor')`, `requireTenantScope`.
- Audit viewer read-only; export logged as audit event.
- Staff PII encrypted at rest.

## 3. Audit
- Hash-chained audit for credential changes, scheduling, leave approval, CME entries, and audit exports.

## 4. Safety Gates
- Block scheduling if license/credential expired.
- Maker-checker for leave and payroll approvals.
- Auditor role cannot modify clinical or financial data.

## 5. Data Retention
- HR records retained per labor law; audit logs 7+ years.
