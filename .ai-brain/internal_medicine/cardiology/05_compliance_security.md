# 05_compliance_security.md - Cardiology Compliance & Security
**Expert: Compliance & Quality Officer / DevOps Lead**

## 1. Regulatory Framework
- **Saudi PDPL:** All cardiology data must be stored within KSA borders.
- **NPHIES:** Integration of cardiology procedure codes (CPT/ICD-10) for insurance claims.
- **JCI Standards:** Mandatory "Time-Out" verification before any invasive procedure (Cath Lab).

## 2. The Golden Access Rule (Technical Enforcement)
- **Logic:** `IF (user.role !== 'Admin' AND user.specialty !== 'Cardiology') THEN DENY_ACCESS`.
- **Implementation:** 
    - Middleware: `requireRole('cardiology_specialist')`.
    - Database: RLS policies on `cardiology_procedures` table.

## 3. PHI Protection
- **Encryption:** All imaging reports and sensitive notes are encrypted using `crypto_envelope.js`.
- **Vaulting:** DICOM files for Nuclear/Echo imaging are stored in `phi_vault/` outside the webroot.

## 4. Audit Trail
- **Hash-Chaining:** Every change to a cardiology report is logged in the hash-chained audit log.
- **Retention:** 7-year retention policy for all surgical/interventional records.
