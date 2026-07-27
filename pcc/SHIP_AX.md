# SHIP_AX — P3-AX (v3.10.0)

## Modules shipped (3 new, 113 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `music_therapy` | Music-Therapy | Expressive-Arts | 10 | 10 unit + 5 integ |
| `art_therapy` | Art-Therapy | Expressive-Arts | 10 | 10 unit + 5 integ |
| `recreational_therapy` | Recreational-Therapy | RT | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 113 (was 110)
- **Total tests:** 2877 (was 2832)
- **Audit:** 111/111 PASS (was 108)

## Music-Therapy engine functions
1. `MusicTherapyAssessment` — engagement + musical background + population
2. `RhythmicEntrainment` — RAS for gait, UE, speech, pain
3. `NeuroMusicTherapy` — MIT, singing, RAS, neglect, memory, DOC
4. `MusicPain` — patient-preferred listening + procedural music
5. `PediatricMusic` — infant lullaby, parent-child, procedural coping
6. `MusicPalliative` — legacy songwriting, comfort, spiritual
7. `MusicInpatient` — ICU delirium, cardiac, oncology, NICU, burn
8. `MusicPsychiatric` — schizophrenia/PTSD/depression/anxiety/SUD
9. `MusicDosing` — active + receptive minutes → intensity
10. `MusicOutcome` — pre/post % change → effect size

## Art-Therapy engine functions
1. `ArtTherapyAssessment` — engagement + medium + population
2. `ArtMedium` — clay, drawing, collage, painting, digital
3. `ArtTrauma` — safety/stabilization, disclosure, dissociation
4. `ArtGroup` — population-specific + focus + duration
5. `ArtPediatric` — scribble, parent-child, medical-play, legacy
6. `ArtGeriatric` — reminiscence, sensory, bedside, reluctant
7. `ArtDosing` — sessions × minutes → intensity
8. `ArtInpatient` — burn procedural, oncology, palliative, psych
9. `ArtOutcome` — pre/post % change → effect size
10. `ArtDigital` — Procreate, memory book, eye-tracking, hybrid

## Recreational-Therapy engine functions
1. `RTAssessment` — diagnosis + leisure history + goals
2. `LeisureBarriers` — physical/cognitive/social/financial
3. `CommunityReintegration` — home/group/sports/arts
4. `AdaptedSports` — wheelchair basketball, handcycle, amputee running
5. `RTPediatric` — play, structured, school, palliative
6. `RTGeriatric` — reminiscence, sensory, institutional, reluctant
7. `RTDosing` — sessions × minutes → intensity
8. `RTInpatient` — rehab/LTACH/psych/burn
9. `RTWellness` — burnout, sedentary, social isolation
10. `RTDischarge` — plan + family + community + equipment + followup

## Files
- Engines: `pcc/{music_therapy,art_therapy,recreational_therapy}/*_engine.js`
- Unit tests: `pcc/{music_therapy,art_therapy,recreational_therapy}/*_test.js`
- Integration: `pcc/{music_therapy,art_therapy,recreational_therapy}/*_integration_test.js`
- Routes: `pcc/{music_therapy,art_therapy,recreational_therapy}/*_routes.js`
- SQL: `pcc/migrations/p3ax_up.sql` + per-module `p3ax_{mod}_up.sql`
- Generator: `pcc/gen_p3ax.py`

## Server wiring
- `server.js` v3.10.0 (was 3.9.0)
- 3 routers added
- 3 module names in `modules[]` (113 total)
- Log line updated to "v3.10.0: 113 modules wired, P3-AX music_therapy/art_therapy/recreational_therapy"
- Health endpoint confirms 113 modules in `modules` array
- All 3 `/api/v1/{music-therapy,art-therapy,recreational-therapy}/list` endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 111 (was 108)
- All 111 PASS — no rail violations

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` now includes 3 new pairs (unit + integ)
- **TOTAL: 2877 tests** (was 2832; +45 from P3-AX = 30 unit + 15 integ)

## Next phase
**P3-AY** — three more expressive/specialty modules. Candidates: hippotherapy, aquatic_therapy, child_life, low_vision, voice_therapy, prosthetics_orthotics, neurorehab_ext, neuromuscular, chronic_pain_rehab, wound_ostomy.
