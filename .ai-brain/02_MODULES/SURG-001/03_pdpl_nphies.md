# SURG-001 — PDPL + NPHIES

## PDPL (Personal Data Protection Law)

### Surgical Photos / Videos
- Patient consent (specific)
- Encryption at rest
- Restricted access
- Audit log
- Retention policy

### Patient Identifiers
- Encryption in transit (TLS 1.3)
- Encryption at rest (AES-256)
- No PHI in logs
- Access control (RBAC)

### Cross-Border
- KSA-based server only
- No transfer to other countries

### Patient Rights
- Access (request own record)
- Correction
- Portability
- Object to processing

## NPHIES (Insurance)

### Eligibility
- Verify before admission
- Pre-authorization for elective
- Bundle codes (DRG)

### Claims
- CPT code
- ICD-10 code
- Bundle codes
- Pre-authorization reference
- Medical necessity documentation
- Operative report
- Pathology report

### Response
- Acknowledgment within 24h
- Adjudication within 30 days
- Appeal process

## CBAHI
- OR standards
- Surgical checklist compliance
- Quality indicators
- Outcome reporting
- Sentinel event reporting

## MOH
- Surgery license
- Surgeon credentials
- Anesthesia credentials
- OR nurse credentials
- Outcome reporting

## Sentinel Events (must report)
- Wrong-site surgery
- Wrong patient surgery
- Wrong procedure
- Retained foreign object
- Surgical fire
- Intra-op death
- Anesthesia-related death
- Massive transfusion reaction
- Unplanned return to OR
