# P3-V SHIP — 3 new PCCs: Radiology, Oncology, Billing/RCM

**Date:** 2026-07-24
**Version:** v1.1.0 → **v1.2.0**
**Status:** ✅ COMPLETE

---

## Executive Summary

P3-V extended the PCC sandbox from **26 to 29 modules** with **3 new departments**:
- **Radiology** — ACR, BI-RADS, Lung-RADS, TI-RADS, Fleischner, O-RADS, PI-RADS, LI-RADS
- **Oncology** — AJCC TNM 8th, ECOG, RECIST 1.1, NCCN, ESMO
- **Billing/RCM** — CPT, ICD-10, NPHIES (KSA), CMS, AAPC

**Test count:** 1054 → **1167** (+113 tests)
**Modules wired:** 26 → **29**
**Audit pass rate:** 24/24 → **27/27** (+3 new)
**Server:** v1.1.0 → **v1.2.0**

---

## New Modules (3)

### 1. Radiology (10 functions)
- `BIRADS` — breast imaging reporting
- `LungRADS` — lung nodule risk
- `TIRADS` — thyroid imaging
- `FleischnerPulmonaryNodule` — incidental pulmonary nodule
- `PIRADS` — prostate MRI
- `CADRADS` — coronary CTA reporting
- `LIRADSCategories` — liver imaging
- `MammographyRecall` — QC tracking
- `TraumaFAST` — focused assessment
- `ContrastNephropathyRisk` — CIN prevention
- 21 engine tests + 17 integration = **38 tests**

### 2. Oncology (10 functions)
- `TNMSolid` — AJCC 8th staging
- `ECOG` — performance status
- `RECISTResponse` — tumor response
- `ChemoToxicityRisk` — toxicity scoring
- `NeutropenicFever` — MASCC risk
- `TumorLysisSyndrome` — TLS prophylaxis
- `PalliativePrognosis` — PiPS-style
- `CancerScreeningIndication` — USPSTF-style
- `MutationInterpretation` — AMP/ASCO/CAP tiers
- `HospiceEligibility` — terminal care referral
- 21 engine tests + 17 integration = **38 tests**

### 3. Billing/RCM (10 functions)
- `CPTLookup` — code description + RVU
- `ICD10Lookup` — code chapter + specificity
- `ModifierValidation` — modifier 25/59/etc
- `NPHIESClaim` — KSA claim validation
- `DenialReason` — CO/PR explanation
- `ChargeCapture` — RVU aggregation
- `CodingAccuracy` — coding audit
- `AR_AgingBucket` — A/R follow-up priority
- `PreAuthRequirement` — authorization trigger
- `RevenueCycleKPI` — net collection, denial rate
- 20 engine tests + 17 integration = **37 tests**

---

## Compliance Standards (added)

- **Radiology:** ACR, BI-RADS, Lung-RADS (1.1), TI-RADS (ACR), Fleischner 2017, PI-RADS v2.1, CAD-RADS 2.0, LI-RADS 2018
- **Oncology:** AJCC 8th, ECOG, RECIST 1.1, NCCN, ESMO, MASCC, AMP/ASCO/CAP
- **Billing/RCM:** CPT (AMA), ICD-10-CM (WHO), NPHIES (KSA), CMS, AAPC, NUBC

---

## Test Summary

| Module | Unit | Integration | Total |
|--------|------|-------------|-------|
| radiology | 21 | 17 | 38 |
| oncology | 21 | 17 | 38 |
| billing_rcm | 20 | 17 | 37 |
| **New** | **62** | **51** | **113** |

**Grand total: 1167 / 1167 tests passing**

---

## Module Inventory (29)

| Category | Count | Notes |
|----------|-------|-------|
| ICU | 10 | ccu, nnicu, bicu, picu, sicu, ticu, micu, honc, cticu, nicu |
| Procedural | 4 | cath_lab, or, ed, obgyn |
| Specialty (clinical) | 11 | derma, gi, endo, rheum, nephro, heme, pharmacy, lab, cardiology, pulmonology, infectious_disease |
| Specialty (diagnostic) | 3 | radiology, oncology |
| Operational | 1 | billing_rcm |
| LLM Co-pilot | 1 | copilot |

---

## Next Steps (P3-W candidates)

- **Pedi PCC** (PEWS/PALS/Apgar extended)
- **Telehealth** (video sessions, store-and-forward)
- **Lab-extended** (microbiology, blood bank)
- **Neurology** (NIHSS/GCS/mRS — but we have NIHSS in NICU; consider Stroke PCC)
- **Gastroenterology-extended** (MELD-Na, Baveno VII — but already in GI)
- **Transplant** (organ allocation, immunosuppression)

---

**Author:** PCC sandbox build pipeline
**Status:** ✅ SHIPPED v1.2.0
