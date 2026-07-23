# MICU — PDPL / NPHIES / CBAHI Compliance

## PDPL (Personal Data Protection Law, Saudi Arabia)

### Patient Data Rights
- [ ] Right to access (patient can request their data)
- [ ] Right to correction
- [ ] Right to deletion (with exceptions — medical record retention applies)
- [ ] Right to portability
- [ ] Right to opt-out of marketing (not applicable clinically)
- [ ] Right to object to processing

### Data Protection
- [ ] **Encryption at rest:** AES-256 (DB), AES-256 (files)
- [ ] **Encryption in transit:** TLS 1.3
- [ ] **PHI auto-redaction** before LLM calls
- [ ] **Access control:** RBAC + tenant scope
- [ ] **Audit log:** hash-chained, 7-year retention
- [ ] **Data minimization:** Only collect what is needed
- [ ] **Cross-border transfer:** Restricted (KSA-based server)

### Consent
- [ ] General consent (admission)
- [ ] Specific consent (procedure)
- [ ] Research consent (if applicable)
- [ ] AI-assisted decision consent (transparency)

### Breach Notification
- [ ] Notify SDAIA within 72h of breach
- [ ] Notify affected patients
- [ ] Document breach + response

## NPHIES (National Platform for Health Insurance Exchange Services)

### Eligibility Check
- [ ] Verify insurance before admission
- [ ] Check coverage for ICU care
- [ ] Pre-authorization if required

### Claims Submission
- [ ] Bundle codes (DRG) for ICU
- [ ] Procedure codes (CPT/SB)
- [ ] Diagnosis codes (ICD-10)
- [ ] Prior authorization reference
- [ ] Medical necessity documentation

### Response
- [ ] Acknowledgment within 24h
- [ ] Adjudication within 30 days (emergency)
- [ ] Appeal process
- [ ] Payment within 30 days

## CBAHI (Central Board for Accreditation of Healthcare Institutions)

### Hospital Standards
- [ ] ICU standards (CBAHI 4.4.1 - 4.4.10)
- [ ] Critical care staffing
- [ ] Equipment standards
- [ ] Quality and safety indicators
- [ ] Risk management

### Patient Safety
- [ ] IPSG (as in JCI)
- [ ] Adverse event reporting
- [ ] Root cause analysis (RCA) for sentinel events
- [ ] Failure Mode and Effects Analysis (FMEA) for high-risk processes

### Documentation
- [ ] Comprehensive medical record
- [ ] Nursing documentation q1h
- [ ] MD progress note daily
- [ ] Discharge summary within 24h
- [ ] Patient education documented

## SDAIA (Saudi Data and AI Authority)
- [ ] Data classification (public, internal, confidential, secret)
- [ ] AI model registration (if used clinically)
- [ ] Algorithm transparency

## MOH (Ministry of Health)
- [ ] License for ICU beds
- [ ] License for intensivists, nurses
- [ ] Reporting (weekly ICU stats)
- [ ] Disease notification (COVID, TB, measles, etc.)
- [ ] Death notification (within 24h)

## Audit & Compliance Verification
- [ ] Internal audit: quarterly
- [ ] External audit: annual (CBAHI)
- [ ] Penetration test: annual
- [ ] Risk assessment: annual
- [ ] Compliance training: all staff, annually
