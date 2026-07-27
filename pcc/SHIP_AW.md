# SHIP_AW — P3-AW (v3.9.0)

## Modules shipped (3 new, 110 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `vestibular_rehab` | Vestibular-Rehab | Neuro-Rehab | 10 | 10 unit + 5 integ |
| `lymphedema` | Lymphedema | Rehab | 10 | 10 unit + 5 integ |
| `driving_rehab` | Driving-Rehab | Driver-Rehab | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 110 (was 107)
- **Total tests:** 2832 (was 2787)
- **Audit:** 108/108 PASS (was 105)

## Vestibular-Rehab engine functions
1. `DixHallpike` — BPPV canal/etiology mapping
2. `HeadImpulse` — HIT gain + corrective saccade
3. `RombergTest` — eyes-open vs eyes-closed sway
4. `DynamicVisualAcuity` — static vs dynamic VA, classification
5. `GazeStability` — velocity + duration + symptom-graded
6. `VestibularMigraine` — duration + headache + photo/aura
7. `MeniereAttack` — AAO-HNS definite/probable/possible
8. `BalanceAssessment` — Berg + TUG + fall count
9. `VORAdaptation` — gain + phase lead + suppression
10. `PPPD` — Bárány Society criteria

## Lymphedema engine functions
1. `LymphedemaStage` — Stage 0–3 ISL classification
2. `LimbVolume` — truncated-cone volumetry
3. `LymphedemaExcess` — affected/unaffected comparison %
4. `CompressionClass` — Class 1–3 + arterial check
5. `MLDTechnique` — Vodder quadrant + fibrosis
6. `ExerciseLymphedema` — aerobic/resistance/aquatic + compression
7. `SkinCare` — cellulitis history + fungal risk
8. `LymphedemaRisk` — axillary dissection + radiation + BMI
9. `PneumaticCompression` — home/clinic + pressure + duration
10. `PediatricLymphedema` — Milroy / Meige / primary / secondary

## Driving-Rehab engine functions
1. `FitnessToDrive` — vision + cognition + motor + seizures
2. `VisionDrive` — VA + VF + contrast + glare
3. `CognitiveDrive` — MMSE + Trail Making B + clock draw
4. `MotorDrive` — ROM + strength + sensation + coordination
5. `SeizureDrive` — seizure-free months + medication compliance
6. `AdaptiveEquipment` — hand controls + lift + spinner knob
7. `OnRoadAssessment` — passed/failed + errors + CDRS cert
8. `DriverRehabPlan` — deficit + hours + simulator + behind-wheel
9. `SeniorDriving` — age + reaction + crash history
10. `DVMSubmission` — medical letter + road eval + adaptive + vision

## Files
- Engines: `pcc/{vestibular_rehab,lymphedema,driving_rehab}/*_engine.js`
- Unit tests: `pcc/{vestibular_rehab,lymphedema,driving_rehab}/*_test.js`
- Integration: `pcc/{vestibular_rehab,lymphedema,driving_rehab}/*_integration_test.js`
- Routes: `pcc/{vestibular_rehab,lymphedema,driving_rehab}/*_routes.js`
- SQL: `pcc/migrations/p3aw_up.sql` + per-module `p3aw_{mod}_up.sql`
- Generator: `pcc/gen_p3aw.py`

## Server wiring
- `server.js` v3.9.0 (was 3.8.0)
- 3 routers added
- 3 module names in `modules[]` (110 total)
- Log line updated to "v3.9.0: 110 modules wired, P3-AW vestibular_rehab/lymphedema/driving_rehab"
- Health endpoint confirms 110 modules in `modules` array
- All 3 `/api/v1/{vestibular-rehab,lymphedema,driving-rehab}/list` endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 108 (was 105)
- All 108 PASS — no rail violations

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` now includes 3 new pairs (unit + integ)
- **TOTAL: 2832 tests** (was 2787; +45 from P3-AW = 30 unit + 15 integ)

## Next phase
**P3-AX** — three more specialty/rehab modules. Candidates: music_therapy, art_therapy, recreational_therapy, hippotherapy, aquatic_therapy, child_life, low_vision, voice_therapy, prosthetics_orthotics, neurorehab_ext, neuromuscular, chronic_pain_rehab, wound_ostomy.
