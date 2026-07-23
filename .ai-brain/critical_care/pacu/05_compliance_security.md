# 05_compliance_security.md - PACU Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of PACU records and any post-op imaging.
- **JCI:** Discharge criteria documentation and PACU staffing standards.
- **CBAHI:** PACU outcomes reporting.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('pacu_nurse')` or `requireRole('anesthesiologist')`.
- **Audit:** All Aldrete scores, vitals, and discharge events are hash-chained.
- **Segregation of Duties:** Nurses record assessments; anesthesiologist signs discharge override when needed.

## 3. PHI Protection
- **Vaulting:** PACU records and any post-op imaging stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for PACU records.
- **Access Logging:** Every view of a PACU record writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Block discharge unless Aldrete ≥ 9 or anesthesiologist override with reason.
- Severe pain (NRS ≥ 7) or uncontrolled nausea triggers analgesic/antiemetic prompt.
- Re-admission to OR or ICU requires documented handoff.
- Pain reassessment after analgesic within 30 minutes.
