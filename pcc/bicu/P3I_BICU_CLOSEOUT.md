<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-I-PCC-BICU
title: PCC #4 — BICU (Burn ICU) CLOSEOUT
date: 2026-07-24
status: COMPLETE
prior: P3-G (NNICU, v0.3.0)
---

# P3-I — PCC #4: BICU CLOSEOUT

## 1. Headline

| Metric | Before (P3-G) | After (P3-I) |
|---|---|---|
| PCC depts | 3 | **4 (CARD-007 + CCU + NNICU + BICU)** |
| Engine functions | 30 | **40** |
| Tables | 12 | **16** |
| Endpoints | 15 | **20** |
| Unit tests | 144 | **187** |
| Integration tests | 51 | **68** |
| **Total automated tests** | **195** | **255** |
| **Pass rate** | 100% | **100%** |
| Server version | v0.3.0 | **v0.4.0** |

## 2. The 10 BICU engine functions

| # | Function | Clinical use |
|---|---|---|
| 1 | `ParklandFormula` | 4 mL × kg × %TBSA fluid resuscitation |
| 2 | `TBSACalculation` | Rule of 9s burn assessment |
| 3 | `InhalationInjurySeverity` | Bronchoscopy grading + intubation decision |
| 4 | `EscharotomyIndication` | Compartment-syndrome escharotomy |
| 5 | `BurnSepsisDiagnosis` | ABA criteria (3+ triggers) |
| 6 | `FluidResuscitationAdjustment` | UOP-driven rate adjustment |
| 7 | `NutritionalNeeds` | Curreri (adult) / Galveston (pediatric) |
| 8 | `ScarAssessment` | Vancouver Scar Scale |
| 9 | `BurnMortalityScore` | Modified Baux (with inhalation) |
| 10 | `BauxScore` | Classic Baux (age + %TBSA) |

## 3. Live HTTP test (v0.4.0)

```bash
$ curl -H "x-pcc-role: BICU" ".../bicu/decision/parkland?weightKg=80&tbsaPct=50&hoursSinceBurn=4"
{"total24hMl":16000,"first8hMl":8000,"next16hMl":8000,"rateFirst8hMlPerHour":2000,"crystalloid":"lactated_ringers","rationale":"Parkland: 4 mL × kg × %TBSA, half in first 8h, half in next 16h. Lactated Ringers."}
```

## 4. Test results
- 43/43 BICU engine tests pass
- 17/17 BICU integration tests pass

## 5. PCC v0.4.0 — 4 modules live
cath_lab, ccu, nnicu, bicu — 20 endpoints, 40 engine functions, 16 tables.

---
*ORC: P3-I complete. BICU + v0.4.0. 4 distinct populations (adult intra-procedure, adult post-event, neonatal, burn).*
