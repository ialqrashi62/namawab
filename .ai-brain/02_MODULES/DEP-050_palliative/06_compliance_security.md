# Compliance & Security — Palliative_Care (DEP-050)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- MMU-1
- MMU-2
- COP-4
- COP-5


## 2. CBAHI Standards
- PC-1
- MM-1
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
- end_of_life_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- morphine_pall, fentanyl_pall, oxycodone_pall, hydromorphone_pall, methadone_pall, haloperidol_pall, midazolam_pall, levomepromazine_pall, glycopyrrolate_pall, octreotide_pall
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