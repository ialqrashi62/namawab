# Compliance & Security — Quality_Safety (DEP-059)

> **CO:** Mr. Turki Al-Otaibi · Generated 2026-08-08

## 1. JCI Controls
- QPS-1
- QPS-2
- QPS-3
- QPS-4
- QPS-5
- QPS-6
- QPS-7
- QPS-8
- QPS-9
- QPS-10
- QPS-11
- IPSG-1
- IPSG-2
- IPSG-3
- IPSG-4
- IPSG-5
- IPSG-6


## 2. CBAHI Standards
- QPS-1
- QPS-2
- PR-1
- SS-1
- SS-2
- SS-3
- SS-4
- SS-5


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
- incident_records: encrypted at rest, redacted in logs


## 5. SFDA Drug Class
- N_A_quality
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