# Compliance & Security — Facility_Biomedical_Management (DEP-060)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- FMS-1
- FMS-2
- FMS-3
- FMS-4
- FMS-5
- FMS-6
- FMS-7


## 2. CBAHI Standards
- FAC-1
- FAC-2
- PR-1


## 3. NPHIES Bundles
- claim submission (if revenue)
- pre-auth workflow
- eligibility check

## 4. PDPL DPIA
| PII Category | Protection |
|---|---|
- vendor_data: encrypted at rest, redacted in logs
- equipment_records: encrypted at rest, redacted in logs
- employee_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- N_A_facility
- All checked via DrugCheckService

## 6. ZATCA Phase 2
- N/A (unless revenue-generating)
- VAT-inclusive pricing required

## 7. STRIDE Threat Model
| Threat | Mitigation |
|---|---|
| Spoofing | JWT + MFA |
| Tampering | Hash-chained audit log |
| Repudiation | Digital signatures |
| Information Disclosure | Encryption at rest + TLS |
| Denial of Service | Rate limiting |
| Elevation of Privilege | RBAC + least privilege |

## 8. HIPAA Alignment
- PHI encrypted
- Access logs
- Minimum necessary
- Breach notification