# 05_compliance_security.md - Emergency Department Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of triage notes, ER imaging, and patient identification data.
- **JCI:** ATLS/ACLS compliance and time-to-treatment documentation.
- **CBAHI:** Emergency preparedness and mass casualty plans.
- **HIPAA-aligned:** Minimum-necessary access for ancillary staff.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('emergency_physician')` or `requireRole('er_nurse')`.
- **Audit:** All triage actions, bed assignments, and dispositions are hash-chained.
- **Segregation of Duties:** Triage nurse may not finalize disposition; only ER physician may.

## 3. PHI Protection
- **Vaulting:** ER imaging and triage photos stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for triage notes and PHI fields.
- **Access Logging:** Every view of an ER record writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- ESI 1 triggers immediate resus bay and visual siren across the station.
- Door-to-provider time threshold monitored per ESI; breach triggers charge-nurse alert.
- Critical lab/imaging result requires Physician Acknowledgement before discharge.
- DAMA requires patient signature capture and informed-refusal attestation.
- Mass casualty event triggers a dedicated MCI workflow with role-based overrides.
