# Compliance & Security — Cardiology (DEP-001)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- ACC-1
- ACC-2
- MMU-1
- MMU-2
- IPSG-1
- IPSG-2
- IPSG-3
- IPSG-4
- IPSG-5
- QPS-1
- QPS-2
- PFR-1


## 2. CBAHI Standards
- CARE-1
- EM-1
- MM-1
- PR-1
- RC-1
- SS-1


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
- phone: encrypted at rest, redacted in logs
- email: encrypted at rest, redacted in logs
- national_id: encrypted at rest, redacted in logs
- address: encrypted at rest, redacted in logs
- insurance_card: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- aspirin, clopidogrel, warfarin, apixaban, metoprolol, lisinopril, atorvastatin, amiodarone, digoxin, furosemide
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