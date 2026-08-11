# Compliance & Security — Pediatric_Surgery (DEP-032)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- IPSG-1
- IPSG-4
- MMU-1


## 2. CBAHI Standards
- CARE-1
- EM-1


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
- parent_info: encrypted at rest, redacted in logs
- surgical_photos: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- cefazolin_pediatric, metronidazole_pediatric, paracetamol_pediatric, morphine_pediatric, ondansetron_pediatric, lactulose_pediatric, enoxaparin_pediatric, midazolam_pediatric, fentanyl_pediatric, ketorolac_pediatric
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