---
module_id: ER-001
section: 06_compliance
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 PDPL + NPHIES + Regional Compliance

## PDPL (Personal Data Protection Law — Saudi Arabia)

### Compliance Matrix

| PDPL Article | Requirement | ER-001 Implementation |
|--------------|-------------|------------------------|
| **Art. 4** (Lawful processing) | Consent or legal basis | General consent on registration, AI-specific consent for AI features |
| **Art. 5** (Purpose limitation) | Use only for stated purpose | Tenant-scoped access, audit log of access |
| **Art. 6** (Data minimization) | Only collect what's needed | Triage form has minimum required fields |
| **Art. 7** (Accuracy) | Keep data accurate | Verified at registration, periodic review |
| **Art. 8** (Storage limitation) | Don't keep longer than needed | 10-year retention (clinical), auto-purge after |
| **Art. 9** (Integrity + confidentiality) | Protect data | Encryption (DPAPI KEK), RBAC, audit |
| **Art. 10** (Accountability) | Demonstrate compliance | This document, audit logs, DPIA |
| **Art. 11** (Transparency) | Inform data subjects | Privacy policy (AR + EN) in patient portal |
| **Art. 14** (Data subject rights) | Access, rectify, erase | FHIR Patient.read, request workflow |
| **Art. 16** (DPIA) | For high-risk processing | DPIA for AI features (completed 2026-04) |
| **Art. 17** (DPO) | Appoint DPO if required | DPO appointed, contact published |
| **Art. 18** (Cross-border) | Adequacy decision or SCC | Data stays in KSA, SDAIA regulations |

### Patient Rights Implementation

#### Right to Access
- **Mechanism:** Patient portal + written request
- **Response time:** 30 days
- **Format:** PDF + structured (FHIR)
- **Fees:** None (first copy free)
- **Audit:** All access logged

#### Right to Rectification
- **Mechanism:** Patient portal + clinic visit
- **Verification:** Identity check
- **Audit:** Before/after state captured

#### Right to Erasure ("Right to be Forgotten")
- **Exception:** Medical record retention (10y) overrides
- **Mechanism:** Request review by DPO + CMO
- **Audit:** Decision documented

#### Right to Restriction
- **Mechanism:** Patient can request processing pause
- **Limitations:** Emergency care cannot be restricted

#### Right to Portability
- **Mechanism:** Export to FHIR Bundle (JSON) or PDF
- **Encryption:** Patient-provided password

#### Right to Object (AI)
- **Mechanism:** Patient can opt out of AI features
- **Fallback:** Rule-based algorithms (no LLM)
- **Audit:** Opt-out decision documented

### DPIA (Data Protection Impact Assessment)

**For AI Triage Agent (CARD-001 / ER-001):**

1. **Description:** AI processes patient data to suggest ESI level + red flags
2. **Necessity:** Triage is time-critical, AI speeds up + improves accuracy
3. **Risks:**
   - Misclassification (ESI 5 vs ESI 2) → delayed care
   - Bias (training data may not represent local population)
   - Re-identification (de-identified data may be re-identifiable)
4. **Mitigations:**
   - MD/RN always in the loop
   - Override allowed with reason + co-sign
   - Continuous monitoring + bias audit
   - Strong de-identification + encryption
5. **Residual risk:** Acceptable (MD final authority)

## NPHIES (National Platform for Health Insurance Exchange Services)

### Integration Points

| Function | NPHIES Endpoint | ER Use Case |
|----------|-----------------|-------------|
| Eligibility check | `/api/v1/eligibility` | At registration |
| Pre-authorization | `/api/v1/preauth` | For non-emergent procedures |
| Claim submission | `/api/v1/claims` | After discharge |
| Claim status | `/api/v1/claims/{id}` | Follow-up |
| Remittance advice | `/api/v1/remittance` | Payment reconciliation |
| Eligibility for emergency | (real-time) | Verify before discharge |
| Accident/emergency flag | `/api/v1/eligibility` with EMER flag | For ED encounters |

### Emergency Service Rules (NPHIES)

- **Exemption:** Emergency services do NOT require pre-authorization
- **Stabilization first:** Treat first, then process insurance
- **EMER flag:** Set on encounter.encounter_class
- **Notification to payer:** Within 24h of stabilization decision
- **Post-stabilization:** Pre-auth required for ongoing care

### Claim Flow for ED

```
Patient arrives → ED encounter
  |
  v
Triage + treatment
  |
  v
Stabilization decision (within 24h of ED arrival)
  |
  +-- Stabilized: discharge, then claim submission
  |
  +-- Need admission: pre-auth + admit
  |
  v
After discharge
  |
  v
Generate claim (CPT codes from procedures, ICD-10 from diagnoses)
  |
  v
NPHIES claim submission (UBL format)
  |
  v
Payer adjudication
  |
  v
Remittance + payment
  |
  v
Reconciliation (auto-post to GL via finance_engine)
```

### NPHIES Data Elements (ER-specific)

- **Encounter ID:** UUID
- **Encounter class:** EMER (mandatory for ED)
- **Encounter date/time:** arrival_time
- **Triage acuity:** ESI 1-5 → maps to NPHIES priority
- **Chief complaint:** free text (may be encrypted)
- **Discharge diagnosis:** ICD-10 (primary + secondary)
- **Procedures:** CPT codes (CPR, intubation, etc.)
- **Length of stay:** encounter end - arrival_time
- **Discharge disposition:** NPHIES codes (home, admit, transfer, AMA, deceased)
- **Provider:** NPHIES provider ID (linked to system_users)

## SDAIA (Saudi Data + AI Authority) Regulations

### Data Localization
- All PHI must stay in KSA
- Cloud provider: must be in KSA region (or approved)
- Backup: must be in KSA region
- DR: secondary in KSA region (not cross-border)

### AI Ethics
- **Transparency:** AI recommendations must be explainable
- **Fairness:** No bias in training data
- **Accountability:** Human-in-loop for critical decisions
- **Privacy:** Data minimization, purpose limitation
- **Safety:** Continuous monitoring, drift detection
- **Robustness:** Tested before deployment, monitored after

### Implementation
- AI features (triage, ECG interpretation, etc.) have model card
- Patient can opt out of AI (uses rule-based fallback)
- All AI decisions logged with input hash, output hash
- Bias monitoring (demographic parity, equalized odds)
- Incident reporting if AI misclassification leads to harm

## MOH (Ministry of Health) — ED Standards

| Standard | ER-001 Implementation |
|----------|------------------------|
| ED staffing | 24/7 MD, 1 RN per 4 beds minimum |
| Equipment standards | Defibrillator, airway, oxygen, suction at every bed |
| Triage | 5-level (ESI) |
| Door-to-doctor | <30 min for non-urgent, <10 for urgent |
| Referral system | Tier-based, MOH protocols |
| Reporting | Daily census, monthly KPI |
| Disaster plan | MCI protocol, regional coordination |
| Infection control | Hand hygiene, isolation, sterilization |
| Patient safety | Sentinel event reporting, root cause |

## CBAHI (Saudi Center for Healthcare Accreditation)

### ED-Specific Standards (CBAHI 3rd ed.)

| Standard | Description | ER-001 Implementation |
|----------|-------------|------------------------|
| ER.1 | 24/7 emergency services | Yes |
| ER.2 | Triage system | ESI 1-5, documented |
| ER.3 | Resuscitation services | Code blue, ACLS-trained staff |
| ER.4 | Disaster plan | MCI + HICS |
| ER.5 | ED documentation | Standardized notes (SOAP) |
| ER.6 | Quality indicators | KPI dashboard |
| ER.7 | Patient transfer | Documented, EMER flag |
| ER.8 | Telemedicine | Tele-ED for remote areas |
| ER.9 | Pediatric emergency | Peds-trained staff, equipment |

## Cross-Border (UAE + Other GCC)

### NABIDH (UAE)
- Patient summary exchange
- Real-time lab results
- Imaging exchange (DICOM)

### Riayati (UAE)
- Unified medical record
- Patient ID verification

### Malaffi (UAE)
- Abu Dhabi health information exchange
- Provider directory

### Implementation
- All cross-border via FHIR R4
- Patient consent required
- Data minimization
- Audit + DPO oversight

## Records Retention (PDPL + Saudi regulations)

| Record Type | Retention | Source |
|-------------|-----------|--------|
| Adult clinical | 10 years from last encounter | PDPL + MOH |
| Pediatric clinical | Until age 25 OR 10 years (longer) | PDPL + MOH |
| Imaging | 10 years | MOH |
| Audit log | 10 years | PDPL |
| Research consent | 99 years | Research ethics |
| Financial | 10 years | ZATCA |
| HR | 7-10 years post-termination | Labor law |
| Backups | Tiered: 30d/1y/7y/99y | Internal policy |

## Consent Capture (PDPL)

### At Registration
- **General consent:** for treatment within facility
- **AI consent:** for AI-assisted care (optional, can opt out)
- **Data sharing:** for internal care team
- **Research use:** de-identified (optional)

### At ED Encounter
- **EMER consent:** implied (life-saving care)
- **Specific procedure consent:** for invasive procedures
- **Photography consent:** for wound/clinical images
- **Teaching consent:** if used for medical education

### Re-Consent Triggers
- Change in scope of data use
- Patient requests (withdraw specific consent)
- Regulatory change

---
*Section 06.c of ER-001. Owner: CQO + DSL. L4 validated.*
