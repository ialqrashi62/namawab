# 05_compliance_security.md - Urology Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of cystoscopy videos, urodynamic curves, and prostate MRI reports.
- **JCI:** Strict sterile technique for urinary catheters and stents.
- **AUA/EAU:** Alignment with urological surgery and oncology standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('urology_surgeon')`.
- **Audit:** All stone logs, PSA trends, and oncology metrics are hash-chained.
- **Segregation of Duties:** Only urologists may log prostatectomy details; nurses may record urine output.

## 3. PHI Protection
- **Vaulting:** Cystoscopy videos and urodynamic data stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for urodynamic and imaging data.
- **Access Logging:** Every view of cystoscopy media writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Alert if post-op urine output drops below threshold or fever > 38.5°C.
- Stent removal due-date reminder with escalation.
- PSA doubling time calculation triggers oncology referral prompt.
