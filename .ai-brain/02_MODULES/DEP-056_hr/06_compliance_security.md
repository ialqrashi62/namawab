# Compliance & Security — HR_Staffing (DEP-056)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- SQE-1
- SQE-2
- SQE-3
- SQE-4
- SQE-5
- SQE-6
- SQE-7
- SQE-8


## 2. CBAHI Standards
- HR-1
- HR-2
- PR-1


## 3. NPHIES Bundles
- claim submission (if revenue)
- pre-auth workflow
- eligibility check

## 4. PDPL DPIA
| PII Category | Protection |
|---|---|
- name: encrypted at rest, redacted in logs
- national_id: encrypted at rest, redacted in logs
- salary: encrypted at rest, redacted in logs
- employee_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- N_A_hr
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