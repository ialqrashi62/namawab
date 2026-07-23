# 05_compliance_security.md - Radiology (RIS/PACS) Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Extreme encryption for DICOM images stored in `phi_vault/dicom/`.
- **JCI:** Strict adherence to radiation safety and contrast allergy screening.
- **ACR:** American College of Radiology appropriateness criteria and reporting standards.
- **CBAHI:** Imaging accreditation and report turnaround requirements.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('radiologist')` (interpretation) or `requireRole('radiology_tech')` (acquisition).
- **Audit:** All report drafts, finalizations, and critical-finding communications are hash-chained.
- **Segregation of Duties:** Techs acquire images; radiologists interpret. Technologists cannot finalize reports.

## 3. PHI Protection
- **Vaulting:** DICOM studies stored in `phi_vault/dicom/` outside webroot; served via `/api/phi-files/:id`.
- **Encryption:** DPAPI KEK envelope for DICOM metadata and report text.
- **Access Logging:** Every DICOM view and report view writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- ALARA principle: dose tracking recorded per study; alerts for cumulative dose thresholds.
- Contrast allergy check mandatory before contrast administration; positive history blocks protocol.
- Critical findings require documented read-back with ordering physician name and timestamp.
- AI lesion detections are advisory only; radiologist sign-off is required for finalization.
- Prior comparison: report finalization blocked if no priors loaded for oncology follow-up.
