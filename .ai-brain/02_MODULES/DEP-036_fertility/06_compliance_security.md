# Compliance & Security — Reproductive_Medicine_IVF (DEP-036)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- MMU-1
- COP-2


## 2. CBAHI Standards
- CARE-1
- MM-1
- OB-2


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
- fertility_data: encrypted at rest, redacted in logs
- partner_info: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- clomiphene, letrozole, gonadotropins, hCG_trigger, progesterone_vaginal, estrogen, GnRH_agonist, GnRH_antagonist, metformin, doxycycline
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