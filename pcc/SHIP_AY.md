# SHIP_AY — P3-AY (v3.11.0)

## Modules shipped (3 new, 116 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `hippotherapy` | Hippotherapy | Animal-Assisted-PT | 10 | 10 unit + 5 integ |
| `aquatic_therapy` | Aquatic-Therapy | Aquatic-PT | 10 | 10 unit + 5 integ |
| `child_life` | Child-Life | Pediatric-Support | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 116 (was 113)
- **Total tests:** 2922 (was 2877)
- **Audit:** 114/114 PASS (was 111)

## Hippotherapy engine functions
1. `HippotherapyEval` — age + indication + GMFCS + contraindications + weight
2. `HorseSelection` — rider level + indication pairing
3. `GaitOnHorse` — cadence + symmetry + pelvic motion
4. `PediatricHippotherapy` — CP diplegia/hemiplegia, ASD, Down, speech
5. `AdultHippotherapy` — stroke, MS, SCI, amputee
6. `HippotherapyContra` — scoliosis, hip, fracture, seizure, allergy
7. `SessionStructure` — mount, warm-up, therapy, cool-down
8. `ProgressMeasure` — Berg + GMFM deltas
9. `SafetyProtocol` — helmet, vest, stirrups, weather
10. `HippotherapyDischarge` — transition to recreational riding

## Aquatic-Therapy engine functions
1. `AquaticAssessment` — indication + water comfort + contraindications
2. `PoolSelection` — temp + depth + modality
3. `AquaticExercise` — goal + joint + minutes
4. `BadelogicJoint` — TKA, THA, rotator cuff, Achilles
5. `RheumatologyAquatic` — RA, fibromyalgia, AS, OA, lupus
6. `NeuroAquatic` — stroke, CP, MS, PD, SCI
7. `AquaticSafety` — depth, CPR staff, emergency, floor
8. `Hallwick` — 10-point + ASD + adult adaptations
9. `AquaticCardiac` — post-MI, CHF, angina timing
10. `AquaticDosing` — sessions × minutes → intensity

## Child-Life engine functions
1. `ChildLifeAssessment` — age + stress + coping + family + prior
2. `ProceduralPreparation` — age + procedure + child + parent
3. `MedicalPlay` — age + materials + setting + goal
4. `DistractionToolbox` — age + procedure + sensory modality
5. `PainCoping` — pain + anxiety + parent presence
6. `HospitalSchool` — grade + admission length + learning needs
7. `SiblingSupport` — sib age + stress + parent capacity
8. `EndOfLifeChild` — lucidity + family + legacy wishes
9. `ChildLifeDosing` — sessions × minutes → intensity
10. `ChildLifeDischarge` — preparation + family + community + followup

## Files
- Engines: `pcc/{hippotherapy,aquatic_therapy,child_life}/*_engine.js`
- Unit tests: `pcc/{hippotherapy,aquatic_therapy,child_life}/*_test.js`
- Integration: `pcc/{hippotherapy,aquatic_therapy,child_life}/*_integration_test.js`
- Routes: `pcc/{hippotherapy,aquatic_therapy,child_life}/*_routes.js`
- SQL: `pcc/migrations/p3ay_up.sql` + per-module `p3ay_{mod}_up.sql`
- Generator: `pcc/gen_p3ay.py`

## Server wiring
- `server.js` v3.11.0 (was 3.10.0)
- 3 routers added
- 3 module names in `modules[]` (116 total)
- Log line updated to "v3.11.0: 116 modules wired, P3-AY hippotherapy/aquatic_therapy/child_life"
- Health endpoint confirms 116 modules in `modules` array
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 114 (was 111)
- All 114 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 2922 tests** (was 2877; +45 from P3-AY = 30 unit + 15 integ)

## Next phase
**P3-AZ** — three more specialty/sensory modules. Candidates: low_vision, voice_therapy, prosthetics_orthotics, neurorehab_ext, neuromuscular, chronic_pain_rehab, wound_ostomy, comprehensive_rehab, telerehab.
