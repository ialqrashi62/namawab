# P3-AG — Cardio-Surgery + Transplant-Nephrology + BMT (SHIPPED)

> **Phase 3 · AG**
> **v2.3.0** — 62 modules · 60 audit · 2112 tests
> **Sandbox:** `c:\Users\ice\Desktop\NMEDCALVSCODE\pcc`

---

## 1. Summary

P3-AG adds three new PCC modules in the **surgical/transplant** tier:
**Cardiothoracic-Surgery**, **Transplant-Nephrology**, **Bone-Marrow-Transplant (HSCT)**.

Each follows the canonical PCC pattern:

- 1 `*_engine.js` — 10 pure deterministic functions (no I/O)
- 1 `*_test.js` — 10 unit tests
- 1 `*_integration_test.js` — 5 scenarios / 17 assertions
- 1 `*_routes.js` — 5 Express endpoints
- 1 `*_up.sql` — 4 tables (admissions, assessments, orders, audit_log) + indices

Compliance references:

- **cardio_surg** — STS, ACC/AHA, ESC, EACTS, ISHLT, AATS
- **transplant_neph** — KDIGO, Banff, UNOS/OPTN, AST, EBMT
- **bmt** — EBMT, CIBMTR, ASBMT, NMDP, JACIE, FACT

---

## 2. Module inventory (this phase)

### 2.1 Cardio-Surgery — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `CABGEuroSCOREII` | EuroSCORE II risk |
| 2 | `AorticStenosisValveIndication` | ACC/AHA AVR Class I/IIa |
| 3 | `ECMOWeaningReadiness` | VA-ECMO liberation score |
| 4 | `VasoactiveInotropicScore` | VIS post-cardiotomy |
| 5 | `PredictedPostOpFEV1` | Lung resection FEV1 |
| 6 | `AorticDissectionStanford` | Type A vs B management |
| 7 | `PostCABGAFStrokeRisk` | CHA2DS2-VASc |
| 8 | `MitralValveCarpentier` | Type I/II/IIIa classification |
| 9 | `EsophagectomyRisk` | ASA + FEV1 composite |
| 10 | `MediastinitisElGamel` | El Gamel class I-IV |

### 2.2 Transplant-Nephrology — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `KDIGOAKIStage` | KDIGO 2012 AKI |
| 2 | `KidneyTransplantEPTS` | Estimated Post-Transplant Survival |
| 3 | `DonorKidneyKDPI` | Kidney Donor Profile Index |
| 4 | `BanffRejectionClassification` | Banff 2019 TCMR/ABMR |
| 5 | `DialysisAdequacyKtV` | KDOQI Kt/V targets |
| 6 | `BKNephropathyRisk` | BK viral load + biopsy |
| 7 | `NephroticSyndromeRelapse` | Proteinuria + albumin |
| 8 | `CKDMineralBone` | KDIGO CKD-MBD |
| 9 | `RenalArteryStenosis` | Class I/IIa stenting |
| 10 | `DSAManagement` | Donor-specific antibody MFI |

### 2.3 BMT (HSCT) — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `HCTComorbidityIndex` | Sorror HCT-CI |
| 2 | `AcuteGVHDGrade` | Glucksberg / IBMTR |
| 3 | `EngraftmentAssessment` | ANC + platelet + chimerism |
| 4 | `VenoOcclusiveDiseaseEBMT` | EBMT SOS criteria |
| 5 | `ConditioningIntensity` | MAC / RIC / NMA |
| 6 | `PostTransplantCytopenias` | Day-stratified differential |
| 7 | `HSCTRelapseRisk` | Disease + status + DLI risk |
| 8 | `VZVReactivationRisk` | Serostatus + GVHD |
| 9 | `SOSProphylaxisIndication` | Defibrotide vs ursodiol |
| 10 | `DLIEligibility` | Donor lymphocyte infusion |

---

## 3. Audit & test results

### Audit (60 modules)
```
SUMMARY: 60 PASS, 0 FAIL
```

### Tests (2112 total)

```
UNIT:   1147
INTEG:  965
TOTAL:  2112
```

3 new modules × (10 unit + 5 integration) = **45 new tests** added in P3-AG.

---

## 4. Server v2.3.0 — live

- `GET  /health` → `status: ok, version: 2.3.0, modules: 62`
- `POST /api/v1/cardio-surg/admissions` → 201 ✓
- `POST /api/v1/transplant-neph/admissions` → 201 ✓
- `POST /api/v1/bmt/admissions` → 201 ✓

Tenant isolation: all routes return 401 without `Authorization: Bearer ...`.
sql.js enforces `tenant_id` at query layer.

---

## 5. Generator

`gen_p3ag.py` (workspace root) produces routes + integration + SQL for any
list of modules. Idempotent — safe to re-run.

---

## 6. Phase history (v0.1.0 → v2.3.0)

| Phase | Version | Modules | Tests | Audit |
|---|---|---|---|---|
| P0 | v0.9.0 | 19 | 700 | 19 |
| P3-A | v1.2.0 | 29 | 1150 | 29 |
| P3-Z | v1.6.0 | 41 | 1597 | 39 |
| P3-AC | v1.9.0 | 50 | 1853 | 48 |
| P3-AD | v2.0.0 | 53 | 1936 | 51 |
| P3-AE | v2.1.0 | 56 | 2022 | 54 |
| P3-AF | v2.2.0 | 59 | 2067 | 57 |
| **P3-AG** | **v2.3.0** | **62** | **2112** | **60** |

(Full 15-phase history in `MEMORY_PHASE_STATE.md`.)

---

## 7. Out-of-scope (deferred)

- Real ZATCA / NPHIES CSID/OTP — GATE 9 still blocked on real credentials
- Live HAPI FHIR / Mirth / Orthanc — sandbox-only per PHASE B D1/D2/D5
- `namaweb/` integration — out of sandbox scope; this is a pure PCC sandbox

---

## 8. Next-phase candidates (P3-AH)

- **Rehab-Extended PCC** — FIM, Barthel, Rancho Los Amigos
- **Dental / Maxillofacial PCC** — DMF, OHI-S, Malocclusion
- **Public-Health PCC** — outbreak, contact-tracing, vaccination cohorts
- **Forensic-Medicine PCC** — manner, mechanism, time-of-death
- **Sports-Medicine PCC** — return-to-play, concussion SCAT5
- **Occupational-Medicine PCC** — OSHA, fitness-for-duty, ergonomics
- **Pain-Extended PCC** — chronic opioid, WHO ladder, ketamine
- **Aerospace-Medicine PCC** — altitude, G-forces, hypoxia
- **Disaster-Medicine PCC** — START triage, mass-casualty

Recommendation: **P3-AH = Rehab-Extended + Sports-Medicine + Forensic-Medicine** (next three service gaps).

---

**Shipped by:** autonomous PCC build loop
**Branch:** `integration/all-epics`
**Sandbox port:** 3100
**Audit:** 60 PASS / 0 FAIL
**Tests:** 2112 PASS / 0 FAIL
**Modules:** 62 wired
**Status:** ✅ **v2.3.0 SHIPPED**
