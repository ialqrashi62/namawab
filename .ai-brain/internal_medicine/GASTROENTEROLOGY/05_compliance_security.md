# 05_compliance_security.md - Gastroenterology Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of endoscopic imagery and biopsy reports.
- **JCI:** Monitoring of sedation and recovery times during ERCP/EUS.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('gastro_specialist')`.
- **Audit:** All changes to endoscopy reports are hash-chained.

## 3. PHI Protection
- **Vaulting:** High-resolution endoscopic videos and images stored in `phi_vault/`.
