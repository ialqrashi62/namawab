# 05_compliance_security.md - Critical Care Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of high-frequency vitals and critical care notes.
- **JCI:** Strict adherence to "Code Blue" and "Rapid Response" documentation.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('critical_care_specialist')`.
- **Audit:** All critical medication changes (e.g., Norepinephrine) are hash-chained.

## 3. PHI Protection
- **Vaulting:** High-resolution ICU monitoring logs stored in `phi_vault/`.
