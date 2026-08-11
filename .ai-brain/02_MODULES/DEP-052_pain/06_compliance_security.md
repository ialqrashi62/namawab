# Compliance & Security — Pain_Management (DEP-052)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- MMU-1
- MMU-2


## 2. CBAHI Standards
- PM-1
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
- pain_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- gabapentin, pregabalin, duloxetine, amitriptyline, tramadol_pain, oxycodone_pain, morphine_pain, fentanyl_patch, lidocaine_patch, capsaicin, ketamine_oral, baclofen, tizanidine, methylprednisolone_pain, celecoxib_pain
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