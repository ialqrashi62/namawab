# 05_compliance_security.md - Orthopedics Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of pre/post-op X-rays, CT scans, and implant images.
- **JCI:** Strict implant traceability (lot/serial number tracking) and wrong-site prevention.
- **CBAHI:** Surgical site infection (SSI) surveillance and implant registry completeness.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('orthopedic_surgeon')`.
- **Audit:** All implant serial numbers, alignment angles, and ROM scores are hash-chained.
- **Segregation of Duties:** Only orthopedic surgeons may log joint replacements; nurses may record ROM only.

## 3. PHI Protection
- **Vaulting:** Orthopedic imaging and implant certificates stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for implant serial numbers and surgical images.
- **Access Logging:** Every view of implant images writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Implant serial number must be present before session save.
- Alignment angle > 3° off target triggers quality review workflow.
- Revision surgery requires link to original implant record.
