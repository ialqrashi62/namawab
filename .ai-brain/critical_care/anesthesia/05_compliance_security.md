# 05_compliance_security.md - Anesthesia Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of intra-op videos and anesthesia records.
- **JCI:** Surgical safety checklist and anesthesia documentation standards.
- **CBAHI:** Anesthesia consent and pre-op evaluation completeness.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('anesthesiologist')`.
- **Audit:** All pre-op assessments, drug administrations, and vital recordings are hash-chained.
- **Segregation of Duties:** Anesthesiologist owns the record; nurses may view but not modify the anesthesia record after sign-off.

## 3. PHI Protection
- **Vaulting:** Intra-op videos and anesthesia records stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for anesthesia records and video metadata.
- **Access Logging:** Every view of an anesthesia record writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Block anesthesia start until consent and ASA documented.
- Drug dose alerts fire when above weight-based thresholds.
- Vital trend anomalies (MAP < 60, SpO2 < 90) trigger immediate notification.
- PACU handoff is mandatory before closing the case.
- Difficult airway prediction must be reviewed before induction.
