# Compliance & Security — Pharmacy (DEP-053)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- MMU-1
- MMU-2
- MMU-3
- MMU-4
- MMU-5
- MMU-6
- MMU-7


## 2. CBAHI Standards
- PHARM-1
- PHARM-2
- PHARM-3
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
- medication_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- warfarin_pharm, methotrexate_pharm, digoxin_pharm, phenytoin_pharm, theophylline_pharm, lithium_pharm, aminoglycosides, vancomycin_pharm, amphotericin_pharm, chemotherapy_agents_pharm
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