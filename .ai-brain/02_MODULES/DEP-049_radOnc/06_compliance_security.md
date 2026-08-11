# Compliance & Security — Radiation_Oncology (DEP-049)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- MMU-1
- MMU-2
- COP-1
- FMS-1
- FMS-2
- FMS-3


## 2. CBAHI Standards
- ONC-1
- ONC-2
- PR-1


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
- ct_simulation_images: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- amifostine, dexamethasone_rt, ondansetron_rt, lorazepam_rt, sucralfate, mesalamine, loperamide, diphenoxylate, topical_steroid, sunscreen
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