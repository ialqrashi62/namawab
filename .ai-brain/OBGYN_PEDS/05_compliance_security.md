# 05_compliance_security.md - OBGYN & Pediatrics Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Extreme encryption for IVF donor data and genetic screening.
- **JCI:** Strict newborn identification and "Safe-Sleeper" protocols in NICU.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('obgyn_specialist')` and `requireRole('pediatrician')`.
- **Audit:** All changes to fetal diagnosis and IVF cycles are hash-chained.

## 3. PHI Protection
- **Vaulting:** High-res 4D ultrasound videos and fetal imaging stored in `phi_vault/`.
