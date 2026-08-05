---
id: COMPLIANCE-MATRIX
version: 1.0
date: 2026-08-01
owner: CQO
status: ACTIVE
---

# Compliance — CBAHI + NPHIES + ZATCA + SFDA + PDPL + JCI + HL7 FHIR

> **Purpose:** Single source of truth for all compliance standards — per-dept mappings + global mappings.

---

## 1. Standards inventory

| Standard | Owner | Scope |
|----------|-------|-------|
| **CBAHI** (Saudi) | MOH | Hospital accreditation |
| **NPHIES** (Saudi) | NHIC | Insurance claims + clinical data exchange |
| **ZATCA Phase 2** | ZATCA | E-invoicing (UBL XAdES) |
| **SFDA** | SFDA | Drug + medical device + food |
| **PDPL** (PD_2019) | SDAIA | Data privacy |
| **JCI 7th ed** | Joint Commission International | International accreditation |
| **ISO 27001:2022** | ISO | InfoSec |
| **HL7 FHIR R4** | HL7 | Clinical data exchange |
| **ICD-10 + SNOMED CT + LOINC + RxNorm** | WHO/HL7 | Terminology |

---

## 2. CBAHI mappings (per dept)

Already done in `nm-app-discovery` + per-dept blueprints. Format:
```yaml
cbahi_mappings:
  - dept: CARD-001
    chapter: ACC (Access to Care)
    standards:
      - ACC.1: 'Triage criteria defined and applied'
      - ACC.2: 'Patient flow through cardiology units'
      - ACC.4: 'Emergency cardiology protocols'
    evidence: [...auto-tests + docs]
```

---

## 3. NPHIES bundles (15 confirmed)

Per encounter type, the bundle of resources needed:
- `bundle-patient.json`: Patient + Coverage + Organization
- `bundle-encounter-claims.json`: Encounter + Diagnosis + Procedure (CPT/SBMI)
- `bundle-preauth.json`: Condition + ServiceRequest
- ... (15 total)

Stored in `src/nphies/bundles/*.json` + generation tests.

---

## 4. ZATCA Phase 2 (blocked on real CSID)

Currently mock; ready for real CSID. UBL XAdES-BES signed invoice + QR per ZATCA spec.

**Status**: GATE 9 ⚠️ (blocked on real CSID/OTP credentials — see `docs/GATE9_ZATCA_UBL_XADES_BLOCKED_AR.md`).

---

## 5. SFDA

Drug database lookup:
- API: SFDA Drug Master + Saudi National Drug Formulary
- Verification: at order-entry time
- Side effect reporting: SAEFI via aSide channel

Medical device: tracking + recall workflow.

---

## 6. PDPL (Saudi Data & AI Protection Law)

```yaml
pdpl_compliance:
  lawful_basis:
    - consent (clinical care)
    - legitimate_interest (research)
    - legal_obligation (claims)
  rights:
    - access (provide within 30 days)
    - correction (within 30 days)
    - deletion (with regulatory exceptions)
    - portability (Patient Bundle format)
  security:
    - encryption at rest + in transit
    - access control
    - breach notification within 72h
  governance:
    - DPIA per processing activity
    - DPO appointed per tenant
    - data inventory maintained
```

DPIA: `.ai-brain/19-compliance/dpia_template.md` (per processing activity).

---

## 7. JCI 7th ed mappings

10 chapters:
- IPE (International Patient Safety Goals)
- ACC (Access to Care)
- PFR (Patient & Family Rights)
- AOP (Assessment of Patients)
- COP (Care of Patients)
- MMU (Medication Management & Use)
- QPS (Quality Improvement & Patient Safety)
- PCI (Prevention & Control of Infections)
- GLD (Governance, Leadership & Direction)
- FMS (Facility Management & Safety)

Per dept: relevant chapters marked.

---

## 8. ISO 27001:2022

16 control groups mapped → `src/compliance/iso27001/`.

---

## 9. HL7 FHIR R4

Resources mapped: Patient, Encounter, Condition, Observation, MedicationRequest, Procedure, AllergyIntolerance, Coverage, Claim, Bundle...

Custom profiles in `src/fhir/profiles/`.

---

## 10. Audit trail

```sql
CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,    -- 'CREATE_ORDER','READ_PATIENT','BILL_EDIT',...
  resource_type TEXT,
  resource_id TEXT,
  before JSONB,
  after JSONB,
  ip INET,
  ts TIMESTAMPTZ DEFAULT now(),
  prev_hash TEXT,
  hash TEXT NOT NULL,       -- chain
  -- RLS, retention 7y
);
```

Hash chain ensures tamper-evidence.

---

## 11. Penetration tests + audits

| Test | Frequency |
|------|-----------|
| Penetration test (third party) | quarterly |
| Internal ZAP scan | weekly |
| RBAC matrix review | monthly |
| Audit log review | monthly |
| Compliance audit | annual |
| DPIA refresh | per new processing activity |

---

## 12. Files

```
src/compliance/
├── cbahi/         # per-dept mappings
├── nphies/
│   ├── bundles/
│   └── engine.js
├── zatca/
├── sfda/
├── pdpl/
│   ├── dpia_template.md
│   ├── data_inventory.yaml
│   └── rights_api.js
├── jci/           # 10 chapters
├── iso27001/      # 16 controls
├── fhir/
├── audit/
└── pentest/
```

---

*Owner: CQO — version 1.0 — 2026-08-01*
