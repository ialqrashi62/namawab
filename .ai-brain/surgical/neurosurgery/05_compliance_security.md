# 05_compliance_security.md - Neurosurgery Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of high-resolution MRI/CT surgical navigation maps and neuromonitoring traces.
- **JCI:** Wrong-site prevention in spinal surgery and time-out documentation.
- **CBAHI:** Neuro-critical care documentation and ICP monitoring standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('neuro_surgeon')`.
- **Audit:** All ICP logs, GCS trends, and surgical interventions are hash-chained.
- **Segregation of Duties:** Only neurosurgeons may log spine stability; ICU nurses may record ICP only.

## 3. PHI Protection
- **Vaulting:** Neuro-imaging and neuromonitoring data stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for navigation maps and ICP waveforms.
- **Access Logging:** Every view of neuro-imaging writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- ICP > 20 mmHg or GCS drop ≥ 2 points triggers critical alert.
- Spinal level selection requires dual confirmation.
- Neuromonitoring logs must include timestamp and technician ID.
