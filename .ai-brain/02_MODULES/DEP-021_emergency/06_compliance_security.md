# Compliance & Security — Emergency (DEP-021)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- IPSG-4
- IPSG-5
- IPSG-6
- MMU-1
- EM-1
- EM-2


## 2. CBAHI Standards
- EM-1
- EM-2
- EM-3
- MM-1
- SS-3


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
- triage_data: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- epinephrine, atropine, amiodarone, adenosine, naloxone, activated_charcoal, acetylcysteine, tranexamic_acid, ceftriaxone, ondansetron
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