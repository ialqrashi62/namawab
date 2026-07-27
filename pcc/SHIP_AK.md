# P3-AK — Aviation + Military + Veterinary (SHIPPED)

> **Phase 3 · AK**
> **v2.7.0** — 74 modules · 72 audit · 2292 tests
> **Sandbox:** `c:\Users\ice\Desktop\NMEDCALVSCODE\pcc`

---

## 1. Summary

P3-AK adds three new PCC modules covering **aviation, military, and veterinary medicine** (zoonoses & One Health).

Each follows the canonical PCC pattern (engine + test + integration + routes + SQL).

Compliance references:

- **aviation** — ICAO, FAA, EASA, IATA, AOPA, AsMA, AMDA, ICAO-9184
- **military** — NATO-STANAG, TCCC, JTS-CPG, DHA, AFHSB, USAMRMC, CoTCCC
- **veterinary** — OIE-WOAH, WHO-One-Health, CDC, AVMA, FAO, IDSA

---

## 2. Module inventory (this phase)

### 2.1 Aviation-Medicine — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `AltitudeHypoxia` | TUC + SpO2 severity |
| 2 | `GLOCAssessment` | G-force + AGSM |
| 3 | `RapidDecompression` | Class I/II/III |
| 4 | `PilotMedicalClass` | FAA Class I/II/III |
| 5 | `CosmicRadiationDose` | Flight hours + altitude |
| 6 | `DVTLongFlightRisk` | Economy class syndrome |
| 7 | `JetLagDisorder` | Time zones + direction |
| 8 | `BarotraumaAssessment` | Ear/sinus/lung |
| 9 | `SpatialDisorientation` | Night + IMC |
| 10 | `CabinAirQuality` | CO2 + humidity |

### 2.2 Military-Medicine — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `CombatTourniquet` | TCCC hemorrhage |
| 2 | `MildTraumaticBrainInjury` | LOC + PTA + symptoms |
| 3 | `PTSDRiskAssessment` | DSM-5 criteria |
| 4 | `BlastInjuryType` | Primary/secondary/tertiary |
| 5 | `TCCCAlgorithm` | Tactical MARCH |
| 6 | `MilitaryTriageMASS` | Mass-casualty |
| 7 | `HypothermiaCombat` | Core temp + immersion |
| 8 | `ChemicalWarfareExposure` | Nerve/blister/blood agents |
| 9 | `AeroEvacPriority` | Priority 1/2/3 |
| 10 | `FieldDentalEmergency` | Field treatment |

### 2.3 Veterinary-Medicine — 10 functions

| # | Function | Reference |
|---|---|---|
| 1 | `RabiesPetExposurerisk` | Animal + behavior |
| 2 | `BrucellosisRisk` | Occupational + unpasteurized |
| 3 | `AnthraxExposure` | Cutaneous/inhalation |
| 4 | `LeptospirosisSeverity` | Weil's disease |
| 5 | `QFeverChronic` | IGG Phase 1 |
| 6 | `HendraNipahRisk` | Bat/pig exposure |
| 7 | `CatScratchDisease` | Bartonella |
| 8 | `WestNileNeuroinvasive` | Encephalitis + paralysis |
| 9 | `ToxoplasmaPregnancy` | IgM/IgG/avidity |
| 10 | `MycobacteriumBovis` | Unpasteurized milk |

---

## 3. Audit & test results

### Audit (72 modules)
```
SUMMARY: 72 PASS, 0 FAIL
```

### Tests (2292 total)

```
UNIT:   1267
INTEG:  1025
TOTAL:  2292
```

3 new modules × (10 unit + 5 integration) = **45 new tests** added in P3-AK.

---

## 4. Server v2.7.0 — live

- `GET  /health` → `status: ok, version: 2.7.0, modules: 74`
- `POST /api/v1/aviation/admissions` → 201 ✓
- `POST /api/v1/military/admissions` → 201 ✓
- `POST /api/v1/veterinary/admissions` → 201 ✓

Tenant isolation: all routes return 401 without `Authorization: Bearer ...`.
sql.js enforces `tenant_id` at query layer.

---

## 5. Generator

`gen_p3ak.py` (workspace root) produces routes + integration + SQL for any
list of modules. Idempotent — safe to re-run.

---

## 6. Phase history (v0.1.0 → v2.7.0)

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
| **P3-AK** | **v2.7.0** | **74** | **2292** | **72** |

---

## 7. Out-of-scope (deferred)

- Real ZATCA / NPHIES CSID/OTP — GATE 9 still blocked on real credentials
- Live HAPI FHIR / Mirth / Orthanc — sandbox-only per PHASE B D1/D2/D5
- `namaweb/` integration — out of sandbox scope; this is a pure PCC sandbox

---

## 8. Next-phase candidates (P3-AL)

- **Neuropsychology PCC** — MoCA, MMSE, ACE-III, neuropsych batteries
- **Speech-Language PCC** — dysarthria, aphasia, swallowing
- **Audiology PCC** — pure-tone, ABR, hearing aid
- **Nuclear-Medicine PCC** — dosimetry, radiopharmacy, MIBG
- **Aerodigestive PCC** — dysphagia, airway, swallowing complex
- **Palliative-Care-Ext PCC** — symptom burden, ESAS, opioid rotation
- **Hospice PCC** — Karnofsky, comfort measures
- **Hospital-Admin PCC** — bed management, throughput, LOS
- **Clinical-Pharmacology PCC** — drug interactions, renal/hepatic dosing

Recommendation: **P3-AL = Neuropsychology + Speech-Language + Audiology** (next three service gaps).

---

**Shipped by:** autonomous PCC build loop
**Branch:** `integration/all-epics`
**Sandbox port:** 3100
**Audit:** 72 PASS / 0 FAIL
**Tests:** 2292 PASS / 0 FAIL
**Modules:** 74 wired
**Status:** ✅ **v2.7.0 SHIPPED**
