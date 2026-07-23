# 05_compliance_security.md - NICU Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of neonatal imaging, family data, and growth records.
- **JCI:** Newborn identification, parent-infant matching, and newborn screening compliance.
- **CBAHI:** Neonatal screening program (hearing, metabolic) and breastfeeding support.
- **AAP / WHO:** Neonatal resuscitation and feeding guidelines.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('neonatologist')` or `requireRole('nicu_nurse')`.
- **Audit:** All APGAR scores, vital recordings, and growth logs are hash-chained.
- **Segregation of Duties:** Nurses record vitals; neonatologist owns the medical plan and discharge.

## 3. PHI Protection
- **Vaulting:** Neonatal imaging and family data stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for growth records and TPN logs.
- **Access Logging:** Every view of a NICU record writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Parent-infant identity match must be verified at admission and before any procedure.
- SpO2 < 85% or glucose < 40 mg/dL triggers critical alert.
- Newborn screening (hearing, metabolic) must be completed before discharge.
- TPN changes require pharmacy sign-off.
- Breastfeeding support and kangaroo-care documentation tracked.
