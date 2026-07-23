# 05_compliance_security.md - Pulmonology Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of sleep study waveforms.
- **JCI:** Monitoring of sedation and recovery times during bronchoscopy.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('pulmonology_specialist')`.
- **Audit:** All changes to PFT interpretations are hash-chained.

## 3. PHI Protection
- **Vaulting:** High-resolution lung CT scans stored in `phi_vault/`.
