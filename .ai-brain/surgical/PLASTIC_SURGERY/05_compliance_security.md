# 05_compliance_security.md - Plastic & Burns Surgery Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Extreme encryption of "Before/After" aesthetic photographs and burn images.
- **JCI:** Strict monitoring of graft viability and sterile dressing changes.
- **ISBI/WHO:** Alignment with international burn care guidelines.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('plastic_surgeon')`.
- **Audit:** All flap perfusion logs, resuscitation records, and aesthetic sessions are hash-chained.
- **Segregation of Duties:** Only plastic surgeons may log flap viability; nurses may record hourly checks.

## 3. PHI Protection
- **Vaulting:** Aesthetic photos, burn images, and flap videos stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for all images and videos.
- **Access Logging:** Every view of aesthetic/burn media writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Critical alert if urine output < 0.5 ml/kg/hr or SIRS criteria met.
- Flap perfusion values require timestamp and observer.
- Aesthetic before/after images are encrypted and access-logged.
