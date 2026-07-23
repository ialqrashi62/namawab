# 05_compliance_security.md - ENT Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of endoscopic videos, audio recordings, and audiometry data.
- **JCI:** Strict airway management and aspiration prevention protocols.
- **AAO-HNS:** Alignment with otolaryngology quality standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('ent_surgeon')`.
- **Audit:** All audiograms, implant mappings, and sinus procedures are hash-chained.
- **Segregation of Duties:** Only ENT surgeons may log cochlear implants; audiologists may record audiograms.

## 3. PHI Protection
- **Vaulting:** Endoscopic videos and audio recordings stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for audiometry and implant data.
- **Access Logging:** Every view of endoscopic media writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- SSNHL detection triggers urgent workflow.
- Side selection (Left/Right/Bilateral) requires confirmation.
- Cochlear implant serial number mandatory for registry entry.
