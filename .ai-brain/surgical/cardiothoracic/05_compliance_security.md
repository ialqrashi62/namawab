# 05_compliance_security.md - Cardiothoracic Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of intra-operative hemodynamic waveforms and echo videos.
- **JCI:** High-risk surgical site verification and blood product management.
- **STS/SVS:** Alignment with Society of Thoracic Surgeons and Society for Vascular Surgery standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('cardio_thoracic_surgeon')`.
- **Audit:** All bypass/clamp times, hemodynamic logs, and graft records are hash-chained.
- **Segregation of Duties:** Only cardiac surgeons may start bypass timer; perfusionists may update pump flow.

## 3. PHI Protection
- **Vaulting:** Hemodynamic waveforms and surgical videos stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for hemodynamic data and graft images.
- **Access Logging:** Every view of bypass records writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Cross-clamp time > 60 minutes triggers escalation.
- Graft record requires material, diameter, and anastomosis site.
- Hemodynamic critical values trigger automatic notification.
