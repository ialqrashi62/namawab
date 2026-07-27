# SHIP_BA — P3-BA (v3.13.0)

## Modules shipped (3 new, 122 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `wound_ostomy` | Wound-Ostomy | WOCN | 10 | 10 unit + 5 integ |
| `chronic_pain_rehab` | Chronic-Pain-Rehab | Pain-Rehab | 10 | 10 unit + 5 integ |
| `telerehab` | Telerehab | Digital-Health | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 122 (was 119)
- **Total tests:** 3012 (was 2967)
- **Audit:** 120/120 PASS (was 117)

## Wound-Ostomy engine functions
1. `WoundAssessment` — type + stage + size + exudate + tissue + infection
2. `PressureInjuryStage` — NPUAP stage + location + mobility
3. `WoundDressing` — exudate + depth + infection + tissue
4. `NPWT` — size + exudate + infection + weeks
5. `OstomySite` — stoma type + location + output + peristomal
6. `StomaComplication` — color + retraction + prolapse + hernia
7. `WoundInfection` — size + erythema + drainage + systemic
8. `Continence` — type + frequency + severity + skin
9. `WoundOutcome` — PWAT delta → effect
10. `WoundDosing` — visits/week × weeks → intensity

## Chronic-Pain-Rehab engine functions
1. `PainBiopsychosocial` — duration + emotional/social/functional
2. `OpioidStewardship` — MME + duration + indication + risk
3. `PainMedication` — class + GI + renal + duration
4. `FunctionalRestoration` — Oswestry + PCM + return-to-work
5. `PainEducation` — literacy + motivation + fear
6. `PainInterventional` — indication + severity + conservative weeks
7. `PainPedi` — age + condition + parent + school
8. `PainAndSleep` — insomnia + pain peak + sleep hygiene
9. `PainDosing` — minutes × sessions → intensity
10. `PainOutcome` — NRS + PEG delta → effect

## Telerehab engine functions
1. `TelerehabEligibility` — tech + broadband + cognitive + safety
2. `TelerehabModality` — goal + condition + tech access
3. `TelerehabSafety` — location + supervision + emergency + cognition
4. `TelerehabExercise` — type + intensity + duration + equipment
5. `TelerehabEval` — first visit + ROM + balance + equipment
6. `TelerehabAdherence` — logins + completion + visit rate
7. `TelerehabBilling` — modality + minutes + payer
8. `TelerehabTechSupport` — device + familiarity + caregiver
9. `TelerehabProgress` — pre/post DASH % change
10. `TelerehabDosing` — minutes × sessions → intensity

## Files
- Engines: `pcc/{wound_ostomy,chronic_pain_rehab,telerehab}/*_engine.js`
- Unit tests: `pcc/{wound_ostomy,chronic_pain_rehab,telerehab}/*_test.js`
- Integration: `pcc/{wound_ostomy,chronic_pain_rehab,telerehab}/*_integration_test.js`
- Routes: `pcc/{wound_ostomy,chronic_pain_rehab,telerehab}/*_routes.js`
- SQL: `pcc/migrations/p3ba_up.sql` + per-module `p3ba_{mod}_up.sql`
- Generator: `pcc/gen_p3ba.py`

## Server wiring
- `server.js` v3.13.0 (was 3.12.0)
- 3 routers added
- 3 module names in `modules[]` (122 total)
- Log line: "v3.13.0: 122 modules wired, P3-BA wound_ostomy/chronic_pain_rehab/telerehab"
- Health endpoint confirms 122 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 120 (was 117)
- All 120 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 3012 tests** (was 2967; +45 = 30 unit + 15 integ)

## Next phase
**P3-BB** — three more specialty/digital modules. Candidates: comprehensive_rehab, sleep_medicine_ext, transplant_extended, home_health, community_health, falls_prevention, frailty, geriatric_assessment, med_psych, transplant_living.
