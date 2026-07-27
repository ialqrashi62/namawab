# P3-AL — Audiology + Neuropsychology + Speech-Language (SHIPPED)

> **Phase 3 · AL**
> **v2.8.0** — 77 modules · 75 audit · 2337 tests
> **Sandbox:** `c:\Users\ice\Desktop\NMEDCALVSCODE\pcc`

---

## 1. Summary

P3-AL adds three new PCC modules covering **audiology, neuropsychology, and speech-language pathology**.

Each follows the canonical PCC pattern (engine + test + integration + routes + SQL).

Compliance references:

- **audiology** — ASHA, AAA, EHDI-JCIH, WHO-PHC, BSA, NHSP, NICE-Hearing
- **neuropsych** — APA-Division-40, NINDS, EAN, NIA-AA, DSM-5, ICD-11, INS
- **speech_lang** — ASHA, AAP, NIDCD, WHO-ICF, JCAHO, CMS, NSDA

---

## 2. Module inventory (this phase)

### 2.1 Audiology — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `PureToneAudiometry` | WHO 2018 grading |
| 2 | `AsymmetricHearingLoss` | 15/30 dB rule |
| 3 | `TinnitusSeverity` | Loudness + distress |
| 4 | `ABRThreshold` | Wave V / interpeak |
| 5 | `OtoacousticEmissions` | Pass/refer |
| 6 | `WordRecognitionScore` | PB max |
| 7 | `CochlearImplantCandidate` | CI candidacy |
| 8 | `Hyperacusis` | LDL threshold |
| 9 | `VestibularAssessment` | Central vs peripheral |
| 10 | `PresbycusisProgression` | Age-related |

### 2.2 Neuropsychology — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `MoCAScore` | Montreal Cognitive Assessment |
| 2 | `MMSEFolstein` | Mini-Mental State Exam |
| 3 | `ACE3Addenbrokes` | Addenbrooke's Cognitive Exam |
| 4 | `BeckDepressionInventory` | BDI-II |
| 5 | `HamiltonAnxietyScale` | HAM-A |
| 6 | `TrailMakingTestA` | TMT-A processing |
| 7 | `TrailMakingTestB` | TMT-B set-shifting |
| 8 | `ConfusionAssessmentMethod` | CAM-ICU delirium |
| 9 | `FABFrontal` | Frontal Assessment Battery |
| 10 | `WAISFSIQEstimate` | WAIS FSIQ |

### 2.3 Speech-Language — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `AphasiaTypeAssessment` | Boston classification |
| 2 | `DysarthriaAssessment` | Type + severity |
| 3 | `DysphagiaFEES` | PAS scale |
| 4 | `StutteringSeverity` | SSI-4 |
| 5 | `VoiceDisorderGRBAS` | GRBAS |
| 6 | `AphasiaSeverityAQ` | AQ score |
| 7 | `AACNeed` | Augmentative comm |
| 8 | `ChildLanguageDisorder` | Expressive/receptive |
| 9 | `DysphagiaOralCareCognitive` | MMSE + oral care |
| 10 | `CognitiveCommunicationDisorder` | Cog-comm severity |

---

## 3. Audit & test results

### Audit (75 modules)
```
SUMMARY: 75 PASS, 0 FAIL
```

### Tests (2337 total)

```
UNIT:   1297
INTEG:  1040
TOTAL:  2337
```

3 new modules × (10 unit + 5 integration) = **45 new tests** added in P3-AL.

---

## 4. Server v2.8.0 — live

- `GET  /health` → `status: ok, version: 2.8.0, modules: 77`
- `POST /api/v1/audiology/admissions` → 201 ✓
- `POST /api/v1/neuropsych/admissions` → 201 ✓
- `POST /api/v1/speech-lang/admissions` → 201 ✓

Tenant isolation: all routes return 401 without `Authorization: Bearer ...`.
sql.js enforces `tenant_id` at query layer.

---

## 5. Generator

`gen_p3al.py` (workspace root) produces routes + integration + SQL for any
list of modules. Idempotent — safe to re-run.

---

## 6. Phase history (v0.1.0 → v2.8.0)

| Phase | Version | Modules | Tests | Audit |
|---|---|---|---|---|
| P0 | v0.9.0 | 19 | 700 | 19 |
| P3-A | v1.2.0 | 29 | 1150 | 29 |
| P3-Z | v1.6.0 | 41 | 1597 | 39 |
| P3-AC | v1.9.0 | 50 | 1853 | 48 |
| P3-AD | v2.0.0 | 53 | 1936 | 51 |
| P3-AE | v2.1.0 | 56 | 2022 | 54 |
| P3-AF | v2.2.0 | 59 | 2067 | 57 |
| P3-AG | v2.3.0 | 62 | 2112 | 60 |
| P3-AH | v2.4.0 | 65 | 2157 | 63 |
| P3-AI | v2.5.0 | 68 | 2202 | 66 |
| P3-AJ | v2.6.0 | 71 | 2247 | 69 |
| P3-AK | v2.7.0 | 74 | 2292 | 72 |
| **P3-AL** | **v2.8.0** | **77** | **2337** | **75** |

---

## 7. Out-of-scope (deferred)

- Real ZATCA / NPHIES CSID/OTP — GATE 9 still blocked on real credentials
- Live HAPI FHIR / Mirth / Orthanc — sandbox-only per PHASE B D1/D2/D5
- `namaweb/` integration — out of sandbox scope; this is a pure PCC sandbox

---

## 8. Next-phase candidates (P3-AM)

- **Nuclear-Medicine PCC** — dosimetry, radiopharmacy, MIBG
- **Aerodigestive PCC** — dysphagia, airway, swallowing complex
- **Palliative-Care-Ext PCC** — symptom burden, ESAS, opioid rotation
- **Hospice PCC** — Karnofsky, comfort measures
- **Hospital-Admin PCC** — bed management, throughput, LOS
- **Clinical-Pharmacology PCC** — drug interactions, renal/hepatic dosing
- **Pharmacy-Clinical PCC** — therapeutic drug monitoring, pharmacokinetics
- **Bioethics PCC** — capacity, surrogate, withdrawal
- **Chaplaincy PCC** — spiritual assessment, FICA

Recommendation: **P3-AM = Nuclear-Medicine + Palliative-Care-Ext + Hospital-Admin** (next three service gaps).

---

**Shipped by:** autonomous PCC build loop
**Branch:** `integration/all-epics`
**Sandbox port:** 3100
**Audit:** 75 PASS / 0 FAIL
**Tests:** 2337 PASS / 0 FAIL
**Modules:** 77 wired
**Status:** ✅ **v2.8.0 SHIPPED**
