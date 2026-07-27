# SHIP_BD — P3-BD (v3.16.0)

## Modules shipped (3 new, 131 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `comprehensive_rehab` | Comprehensive-Rehab | Rehab-IRF | 10 | 10 unit + 5 integ |
| `sleep_medicine_ext` | Sleep-Medicine-Ext | Sleep | 10 | 10 unit + 5 integ |
| `transplant_extended` | Transplant-Extended | Transplant | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 131 (was 128)
- **Total tests:** 3147 (was 3102)
- **Audit:** 129/129 PASS (was 126)

## Comprehensive-Rehab engine functions
1. `ComprehensiveRehab` — dx + weeks + FIM + goal
2. `FIMScore` — motor + cognition
3. `WeissFIMGain` — admission + discharge + LOS + dx
4. `PTIntensity` — sessions/day + minutes + weeks
5. `OT` — goal + ADL + weeks
6. `SLP` — goal + diet + cognition
7. `RehabTeam` — setting + staff + family + intensity
8. `RehabDischarge` — FIM + home support + equipment + mods
9. `RehabOutcome` — pre/post FIM + Barthel
10. `RehabPayment` — setting + payer + caseload

## Sleep-Medicine-Ext engine functions
1. `Polysomnography` — AHI + sleep efficiency + arousal + stage
2. `OSATreatment` — AHI + BMI + position + CPAP + anatomy
3. `CPAPAdherence` — hours/night + days + residual AHI
4. `InsomniaCBTI` — sleep latency + WASO + TST + sleep aid
5. `CircadianDisorder` — shift work + jet lag + phase
6. `PediatricSleep` — age + parasomnia + apnea + resistance
7. `Narcolepsy` — cataplexy + EDS + sleep onset + hallucinations
8. `RestlessLegs` — URGE + ferritin
9. `SleepAndMed` — med + insomnia + sedating
10. `SleepOutcome` — pre/post ISI + ESS

## Transplant-Extended engine functions
1. `TransplantEval` — organ + age + comorbidity + compliance + psychosocial
2. `LivingDonor` — age + BMI + GFR + comorbidity + motivation
3. `MMFMismatch` — donor age + recipient age + GFR + weight
4. `Waitlist` — status + MELD + 1A + time waited
5. `PostTransplant` — weeks + tac + infection + rejection + function
6. `TransplantImmuno` — regimen + time + infection + rejection history
7. `TransplantInfect` — pathogen + weeks + viral load + prophylaxis
8. `TransplantRejection` — type + grade + weeks + response
9. `TransplantSurgery` — organ + donor type + ischemia + retransplant
10. `TransplantOutcome` — pre/post GFR

## Files
- Engines: `pcc/{comprehensive_rehab,sleep_medicine_ext,transplant_extended}/*_engine.js`
- Unit tests: `pcc/{comprehensive_rehab,sleep_medicine_ext,transplant_extended}/*_test.js`
- Integration: `pcc/{comprehensive_rehab,sleep_medicine_ext,transplant_extended}/*_integration_test.js`
- Routes: `pcc/{comprehensive_rehab,sleep_medicine_ext,transplant_extended}/*_routes.js`
- SQL: `pcc/migrations/p3bd_up.sql` + per-module `p3bd_{mod}_up.sql`
- Generator: `pcc/gen_p3bd.py`

## Server wiring
- `server.js` v3.16.0 (was 3.15.0)
- 3 routers added
- 3 module names in `modules[]` (131 total)
- Log line: "v3.16.0: 131 modules wired, P3-BD comprehensive_rehab/sleep_medicine_ext/transplant_extended"
- Health endpoint confirms 131 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 129 (was 126)
- All 129 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 3147 tests** (was 3102; +45 = 30 unit + 15 integ)

## Next phase
**P3-BE** — three more specialty/transplant modules. Candidates: transplant_living, neonatal_ext, perinatal_ext, fertility, palliative_ext2, transplant_ext2, transplant_pediatric, transplant_immunology, transplant_pharmacy.
