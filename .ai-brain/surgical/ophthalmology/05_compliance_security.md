# 05_compliance_security.md - Ophthalmology Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of high-resolution retinal scans, OCT images, and surgical videos.
- **JCI:** Strict verification of the correct eye (Left/Right) and correct lens power.
- **AAO/ESCRS:** Alignment with ophthalmology and refractive surgery standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('eye_surgeon')`.
- **Audit:** All IOL calculations, visual acuity trends, and surgical logs are hash-chained.
- **Segregation of Duties:** Only eye surgeons may approve IOL power; technicians may capture biometry.

## 3. PHI Protection
- **Vaulting:** Retinal scans, OCT, and surgical videos stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for biometry and imaging data.
- **Access Logging:** Every view of retinal images writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Correct-eye verification: Left/Right requires dual confirmation.
- Alert if IOP > 30 mmHg or sudden BCVA drop.
- IOL serial number and power mandatory before session save.
