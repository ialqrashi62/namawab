<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — PDPL, NPHIES, ZATCA, SFDA, CBAHI

## PDPL (Personal Data Protection Law — KSA)
- **Retention:**
  - Clinical records: 7 years
  - Imaging (DICOM): 10 years
  - **Lifetime for implants:** stents (DES, BMS, BVS), TAVR valves, MitraClip, Watchman, PFO/ASD occluders, alcohol septal ablation scars
  - Pediatric: until age 25 OR 10 years (whichever longer)
- **Consent:** explicit, informed, withdrawable; AI-assisted care consent separate
- **Breach notification:** 72h to NDMOOTH (National Data Management Office)
- **Data localization:** all PHI stored in KSA
- **Cross-border transfer:** requires NDMOOTH approval
- **DPO (Data Protection Officer):** mandatory for healthcare

## NPHIES (National Platform for Health Insurance Exchange Services)
- **Cardiac procedure bundles:**
  - PCI with DES: DRG mapping per lesion count + vessel count
  - TAVR: bundled (procedure + valve + ICU + 30-day follow-up)
  - MitraClip: bundled
  - Watchman: bundled
- **FHIR R4 profile:** Claim.cardiacProcedure
- **Pre-authorization:** required for elective procedures (≥48h)
- **Bundle excludes:** DAPT (separate claim), follow-up visits (separate)
- **VAT:** 15% on procedure (ZATCA)

## ZATCA (Zakat, Tax, and Customs Authority)
- **E-invoicing Phase 2:** required for all B2B + B2C transactions
- **XML format:** UBL 2.1
- **Cryptographic stamp:** XAdES-BES (currently BLOCKED on CSID/OTP credentials per GATE 9)
- **Hash chain:** SHA-256 of previous invoice + current invoice fields
- **Counter value:** monotonically increasing per device
- **Retention:** 6 years (10 for tax-relevant)

## SFDA (Saudi Food and Drug Authority)
- **Drug-eluting stent registry:** all DES implants must be reported within 7 days
  - UDI (Unique Device Identifier)
  - Manufacturer, model, batch, lot
  - Vessel, segment, deployment pressure
- **Contrast media:** approved list (Iohexol, Iopamidol, Iodixanol)
- **Allergy documentation:** required for iodinated contrast
- **Reporting:** adverse events to SFDA within 7 days

## CBAHI (Central Board for Accreditation of Healthcare Institutions)
- **Cardiac program standards:**
  - 24/7 interventional cardiology coverage
  - ≥2 cath labs (medical_city, tertiary)
  - Cardiac surgery backup (for TAVR, high-risk PCI)
  - Structural Heart MDT (Heart Team) for advanced procedures
- **Quality indicators:**
  - D2B compliance (≥90%)
  - PCI mortality (<2% elective, <5% STEMI)
  - TAVR 30-day mortality (<3%)
  - CIN rate (<5%)

## HIPAA (US reference for international JCI alignment)
- 164.312(a)(2)(iv) — Encryption at rest
- 164.312(b) — Audit controls
- 164.312(e)(1) — Transmission security (TLS 1.3)
- 164.312(c)(1) — Integrity controls (hash-chained audit)

---
*Section 26 of CARD-002. CQO voice. L1 DRAFT.*