# SHIP_BC — P3-BC (v3.15.0)

## Modules shipped (3 new, 128 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `home_health` | Home-Health | Home-Care | 10 | 10 unit + 5 integ |
| `community_health` | Community-Health | Public-Health | 10 | 10 unit + 5 integ |
| `med_psych` | Med-Psych | Consultation-Liaison | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 128 (was 125)
- **Total tests:** 3102 (was 3057)
- **Audit:** 126/126 PASS (was 123)

## Home-Health engine functions
1. `HomeHealthEligibility` — age + post-acute + homebound + skilled need
2. `OASISAssessment` — functional + mobility + cognition + wounds + pain
3. `HomePT` — phase + sessions + weeks + goal
4. `HomeHealthNursing` — dx + visits + weeks + med teach
5. `MedicationReconciliation` — med count + duplications + OTC + caregiver
6. `HomeHealthDischarge` — goals + family + community + followup
7. `HomeHealthOutcome` — pre/post OASIS → effect
8. `HomeHealthWound` — wound type + visits + weeks
9. `HomeHealthCardiac` — dx + EF + compliance
10. `HomeHealthPedi` — age + dx + caregivers + technology

## Community-Health engine functions
1. `CommunityRiskAssessment` — population + SDOH + age
2. `HealthDisparities` — race + insurance + language + chronic dx
3. `SDOH` — housing + food + transport + education + safety
4. `HealthLiteracy` — literacy + language + teach-back + caregiver
5. `VaccinationOutreach` — age + vaccines + population + hesitancy
6. `CommunityMaternal` — age + prenatal + income + transport
7. `CommunityMental` — depression + suicide + substance + access
8. `CommunityScreening` — age + SDOH + last screen + access
9. `CommunityOutbreak` — pathogen + cases + population + severity
10. `CommunityEval` — program + reach + outcomes + cost

## Med-Psych engine functions
1. `DepressionScreen` — PHQ-9 + duration + risk
2. `AnxietyScreen` — GAD-7 + duration + panic
3. `SuicideScreen` — C-SSRS + plan + access + prior attempt
4. `DeliriumScreen` — CAM + onset + awareness + age
5. `SubstanceUse` — AUDIT + DAST + substance
6. `PsychMed` — med + indication + age + renal/hepatic
7. `MedPsychConsult` — reason + capacity + decision + adherence
8. `SeriousMentalIllness` — dx + compliance + housing + social
9. `MedPsychPed` — age + dx + school + parent
10. `PsychOutcome` — pre/post PHQ-9 + function → effect

## Files
- Engines: `pcc/{home_health,community_health,med_psych}/*_engine.js`
- Unit tests: `pcc/{home_health,community_health,med_psych}/*_test.js`
- Integration: `pcc/{home_health,community_health,med_psych}/*_integration_test.js`
- Routes: `pcc/{home_health,community_health,med_psych}/*_routes.js`
- SQL: `pcc/migrations/p3bc_up.sql` + per-module `p3bc_{mod}_up.sql`
- Generator: `pcc/gen_p3bc.py`

## Server wiring
- `server.js` v3.15.0 (was 3.14.0)
- 3 routers added
- 3 module names in `modules[]` (128 total)
- Log line: "v3.15.0: 128 modules wired, P3-BC home_health/community_health/med_psych"
- Health endpoint confirms 128 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 126 (was 123)
- All 126 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 3102 tests** (was 3057; +45 = 30 unit + 15 integ)

## Next phase
**P3-BD** — three more community/specialty modules. Candidates: comprehensive_rehab, sleep_medicine_ext, transplant_extended, transplant_living, neonatal_ext, perinatal_ext, fertility, palliative_ext2, transplant_ext2.
