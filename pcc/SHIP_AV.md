# SHIP_AV — P3-AV (v3.8.0)

## Modules shipped (3 new, 107 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `hand_therapy` | Hand-Therapy | OT | 10 | 10 unit + 5 integ |
| `cardiac_rehab` | Cardiac-Rehab | Cardiology | 11 | 10 unit + 5 integ |
| `pelvic_rehab` | Pelvic-Rehab | Pelvic PT | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 107 (was 104)
- **Total tests:** 2787 (was ~2742)
- **Audit:** 105/105 PASS

## Hand-Therapy engine functions
1. `GripStrength` — grip kg, age-adjusted expected, classification
2. `PinchStrength` — tip/lateral/three-jaw pinch grading
3. `CARPA` — total thumb ROM in degrees
4. `CARPATotal` — upper extremity AROM sum
5. `TinelSign` — nerve percussion sign mapping
6. `PhalenTest` — Phalen / reverse-Phalen by duration
7. `DupuytrenContracture` — nodule/cord/contracture staging
8. `FlexorTendonRepair` — zone + weeks + glide status
9. `RSDSCRPS` — Budapest-like staging (warm → dystrophic → atrophic)
10. `Splinting` — CTS/trigger/Dupuytren/RA/burn splint selection

## Cardiac-Rehab engine functions
1. `CRPhase` — Phase 1–4 selection
2. `ExercisePrescriptionMET` — Karvonen target HR + target MET
3. `CardiopulmonaryExerciseTest` — VO2 max classification
4. `RiskStratificationCR` — EF, angina, arrhythmia, DM, age
5. `CREnrollment` — class I/IIa/IIb indication
6. `ExerciseResponse` — RPE / HR / SpO2 / BP response
7. `HeartFailureRehab` — EF + NYHA + fragility-adjusted
8. `PostCABGRehab` — weeks + sternal precautions + walk
9. `PADExercise` — ABI + supervised status
10. `CardiomyopathyExercise` — HCM/DCM + arrhythmia gating
11. `PediatricCardiacRehab` — age + surgery + parent

## Pelvic-Rehab engine functions
1. `PelvicFloorStrength` — strength/endurance/fast-twitch grading
2. `IncontinenceImpact` — pad count/weight/frequency + urge component
3. `PelvicOrganProlapse` — POP-Q stage + management
4. `PelvicPain` — vulvar/dyspareunia/dysmenorrhea differential
5. `PregnancyPelvic` — trimester + diastasis recti + pain
6. `PostProstatectomy` — weeks + pad use + ED + PF status
7. `DyspareuniaEval` — superficial/deep + primary/secondary
8. `PelvicFloorEMGBiofeedback` — sEMG-driven PF plan
9. `PelvicSurgeryRecovery` — weeks + pain + bladder + sexual
10. `MalePelvicPain` — UPOINT / NIH CPPS categories

## Files
- Engines: `pcc/{hand_therapy,cardiac_rehab,pelvic_rehab}/*_engine.js`
- Unit tests: `pcc/{hand_therapy,cardiac_rehab,pelvic_rehab}/*_test.js`
- Integration: `pcc/{hand_therapy,cardiac_rehab,pelvic_rehab}/*_integration_test.js`
- Routes: `pcc/{hand_therapy,cardiac_rehab,pelvic_rehab}/*_routes.js`
- SQL: `pcc/migrations/p3av_up.sql` + per-module `p3av_{mod}_up.sql`
- Generator: `pcc/gen_p3av.py`

## Server wiring
- `server.js` v3.8.0 (was 3.7.0)
- 3 routers added
- 3 module names in `modules[]`
- Log line updated to "v3.8.0: 107 modules wired, P3-AV hand_therapy/cardiac_rehab/pelvic_rehab"
- Health endpoint confirms 107 modules in `modules` array
- All 3 `/api/v1/{hand-therapy,cardiac-rehab,pelvic-rehab}/list` endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 105 (was 102)
- All 105 PASS — no rail violations (no hardcoded secrets, no DROP, no red-flag comments, all routes have authenticate, all modules have unit + integration tests)

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` now includes 3 new pairs (unit + integ)
- **TOTAL: 2787 tests** (was 2742; +45 from P3-AV = 30 unit + 15 integ)

## Next phase
**P3-AW** — three more specialty/rehab modules. Candidates: vestibular_rehab, lymphedema, driving_rehab, music_therapy, art_therapy, recreational_therapy, wound_ostomy, low_vision, voice_therapy, hand_surgery_ext, prosthetics_orthotics, vestibular_audio, hippotherapy, aquatic_therapy, child_life, music_medicine, infant_stimulation, neurorehab_ext, neuromuscular, chronic_pain_rehab.
