# 05_compliance_security.md - General Surgery Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of surgical videos and high-res pathology images.
- **JCI:** Strict enforcement of the WHO Surgical Safety Checklist.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('general_surgeon')`.
- **Audit:** All surgical logs and checklist completions are hash-chained.

## 3. PHI Protection
- **Vaulting:** Intra-operative videos and pathology slides stored in `phi_vault/`.
