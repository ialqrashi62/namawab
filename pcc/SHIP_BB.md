# SHIP_BB — P3-BB (v3.14.0)

## Modules shipped (3 new, 125 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `falls_prevention` | Falls-Prevention | Geriatric-Rehab | 10 | 10 unit + 5 integ |
| `frailty` | Frailty | Geriatric | 10 | 10 unit + 5 integ |
| `geriatric_assessment` | Geriatric-Assessment | CGA | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 125 (was 122)
- **Total tests:** 3057 (was 3012)
- **Audit:** 123/123 PASS (was 120)

## Falls-Prevention engine functions
1. `FallsRiskAssessment` — age + history + gait + balance + meds
2. `TimedUpAndGo` — TUG seconds + device + footwear
3. `BergBalance` — Berg total score
4. `MedicationFallRisk` — benzo + opioid + anticholinergic
5. `HomeSafety` — lighting + rugs + grab bars + stairs + pets
6. `Footwear` — type + fit + sole
7. `VisionAndFalls` — acuity + depth + cataract + glasses
8. `ExerciseForFalls` — Otago + Tai-Chi + strength progression
9. `BoneHealth` — age + sex + t-score + fragility fx
10. `FallsOutcome` — pre/post falls rate → effect

## Frailty engine functions
1. `FrailtyIndex` — 5 Fried criteria
2. `ClinicalFrailtyScale` — CFS 1-9 + comorbidities
3. `FriedFrailty` — weight loss + exhaustion + activity + walk + grip
4. `Sarcopenia` — muscle mass + grip + gait speed + age
5. `NutritionInFrail` — albumin + BMI + intake + weight loss %
6. `FrailtyTrajectory` — baseline CFS + current + months
7. `FrailtyAndSurgery` — CFS + surgery type + age
8. `PolypharmacyInFrail` — med count + high-risk list + CFS
9. `CognitiveFrailty` — MMSE + CFS + depression + social isolation
10. `FrailtyOutcome` — pre/post CFS delta

## Geriatric-Assessment engine functions
1. `ComprehensiveGeriatric` — 8 CGA domains
2. `MiniCog` — word recall + clock draw
3. `MoCA` — score + education-adjusted
4. `ADL_IADL` — Katz + Lawton scores
5. `GeriatricDepression` — GDS-15 score
6. `NutritionMNA` — MNA + BMI + weight loss
7. `PolypharmacyGeri` — med count + Beers + age
8. `ContinenceGeri` — type + frequency + severity + cognition
9. `GeriatricPain` — pain + type + meds + cognition
10. `GoalsOfCare` — code status + prognosis + goals

## Files
- Engines: `pcc/{falls_prevention,frailty,geriatric_assessment}/*_engine.js`
- Unit tests: `pcc/{falls_prevention,frailty,geriatric_assessment}/*_test.js`
- Integration: `pcc/{falls_prevention,frailty,geriatric_assessment}/*_integration_test.js`
- Routes: `pcc/{falls_prevention,frailty,geriatric_assessment}/*_routes.js`
- SQL: `pcc/migrations/p3bb_up.sql` + per-module `p3bb_{mod}_up.sql`
- Generator: `pcc/gen_p3bb.py`

## Server wiring
- `server.js` v3.14.0 (was 3.13.0)
- 3 routers added
- 3 module names in `modules[]` (125 total)
- Log line: "v3.14.0: 125 modules wired, P3-BB falls_prevention/frailty/geriatric_assessment"
- Health endpoint confirms 125 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 123 (was 120)
- All 123 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 3057 tests** (was 3012; +45 = 30 unit + 15 integ)

## Next phase
**P3-BC** — three more specialty/geriatric modules. Candidates: comprehensive_rehab, sleep_medicine_ext, transplant_extended, home_health, community_health, med_psych, transplant_living, neonatal_ext, perinatal_ext, fertility.
