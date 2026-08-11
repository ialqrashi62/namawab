# Compliance & Security — ICU_Adult (DEP-022)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- IPSG-4
- IPSG-5
- MMU-1
- MMU-2
- COP-1


## 2. CBAHI Standards
- CARE-1
- MM-1
- MM-2


## 3. NPHIES Bundles
- claim submission (if revenue)
- pre-auth workflow
- eligibility check

## 4. PDPL DPIA
| PII Category | Protection |
|---|---|
- name: encrypted at rest, redacted in logs
- mrn: encrypted at rest, redacted in logs
- dob: encrypted at rest, redacted in logs
- icu_monitoring: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- norepinephrine, vasopressin, dobutamine, milrinone, fentanyl, propofol, midazolam, piperacillin_tazobactam, meropenem, vancomycin
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