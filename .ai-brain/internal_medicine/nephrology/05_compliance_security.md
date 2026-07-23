# 05_compliance_security.md - Nephrology Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of transplant waiting lists and donor data.
- **JCI:** Strict monitoring of water purity for hemodialysis (AAMI standards).

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('nephrology_specialist')`.
- **Audit:** All changes to dialysis prescriptions are hash-chained.

## 3. PHI Protection
- **Vaulting:** High-resolution renal ultrasound and CT scans stored in `phi_vault/`.
