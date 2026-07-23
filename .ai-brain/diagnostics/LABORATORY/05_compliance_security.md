# 05_compliance_security.md - Laboratory (LIS) Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of genetic reports and pathology results stored in `phi_vault/`.
- **JCI / ISO 15189:** Strict adherence to quality control and specimen traceability.
- **CLSI:** Clinical and Laboratory Standards Institute guidelines for pre-analytical/analytical/post-analytical phases.
- **CBAHI:** Lab accreditation standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('lab_specialist')` (technologist) or `requireRole('lab_pathologist')` (validation).
- **Audit:** All critical-value alerts, validation logs, and result amendments are hash-chained.
- **Segregation of Duties:** Technologists enter results; pathologists validate. Modifications after release require documented reason.

## 3. PHI Protection
- **Vaulting:** Pathology images, genetic reports, and large result PDFs stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for all result records and genetic data.
- **Access Logging:** Every view of a lab result writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Block result reporting without QC pass for the analyzer/run.
- Critical (panic) values require read-back acknowledgment before marking as communicated.
- Delta check vs prior result fires when deviation exceeds institutional threshold.
- Reflex testing rules must be visible and auditable.
- Specimen rejection must be documented with reason; rejected specimens never billed.
