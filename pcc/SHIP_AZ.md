# SHIP_AZ — P3-AZ (v3.12.0)

## Modules shipped (3 new, 119 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `low_vision` | Low-Vision | Sensory-Rehab | 10 | 10 unit + 5 integ |
| `voice_therapy` | Voice-Therapy | Speech-Swallowing | 10 | 10 unit + 5 integ |
| `prosthetics_orthotics` | Prosthetics-Orthotics | Devices | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 119 (was 116)
- **Total tests:** 2967 (was 2922)
- **Audit:** 117/117 PASS (was 114)

## Low-Vision engine functions
1. `LowVisionAssessment` — acuity + VF + contrast + glare
2. `MagnificationRx` — task + acuity + target + working distance
3. `VisualField` — defect + laterality + onset
4. `ContrastSensitivity` — logCS + age + lighting
5. `AssistiveTech` — task + vision + tech access + dexterity
6. `ADL` — reading + writing + self-care + meal prep
7. `MobilityOM` — vision + field + familiar env + travel
8. `LowVisionDriving` — vision + field + contrast
9. `PedLowVision` — age + condition + school type
10. `LowVisionOutcome` — pre/post % change → effect

## Voice-Therapy engine functions
1. `VoiceEval` — diagnosis + severity + profession + VHI
2. `VocalHygiene` — hydration + phonotrauma + reflux
3. `VoiceDisorder` — pitch + loudness + quality + duration
4. `SLPResonantVoice` — technique + loudness + daily practice
5. `PediatricVoice` — age + diagnosis + parent + therapy type
6. `VoiceForSinger` — voice type + complaint + performance + technique
7. `TransgenderVoice` — gender identity + current + goals + pitch
8. `VoiceLaryngectomy` — surgery + alaryngeal type + months post
9. `VoiceDosing` — minutes × sessions → intensity
10. `VoiceOutcome` — VHI + CAPE-V delta → effect

## Prosthetics-Orthotics engine functions
1. `ProstheticPrescription` — level + side + K-level + comorbidities
2. `SocketFit` — suspension + liner + stump volume + pressure
3. `OrthoticPrescription` — condition + side + activity + skin
4. `OrthoticScoliosis` — Cobb angle + age + Risser + curve
5. `ProstheticGait` — deviation + side + weeks post
6. `ProstheticTraining` — phase + weeks + level + comorbidity
7. `OrthoticComplications` — skin + pistoning + volume + pain
8. `ActivityKLevel` — community + household + age + comorbidity
9. `PediatricProsthetic` — age + level + side + etiology
10. `DeviceFollowup` — months fit + skin + function + volume

## Files
- Engines: `pcc/{low_vision,voice_therapy,prosthetics_orthotics}/*_engine.js`
- Unit tests: `pcc/{low_vision,voice_therapy,prosthetics_orthotics}/*_test.js`
- Integration: `pcc/{low_vision,voice_therapy,prosthetics_orthotics}/*_integration_test.js`
- Routes: `pcc/{low_vision,voice_therapy,prosthetics_orthotics}/*_routes.js`
- SQL: `pcc/migrations/p3az_up.sql` + per-module `p3az_{mod}_up.sql`
- Generator: `pcc/gen_p3az.py`

## Server wiring
- `server.js` v3.12.0 (was 3.11.0)
- 3 routers added
- 3 module names in `modules[]` (119 total)
- Log line: "v3.12.0: 119 modules wired, P3-AZ low_vision/voice_therapy/prosthetics_orthotics"
- Health endpoint confirms 119 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 117 (was 114)
- All 117 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 2967 tests** (was 2922; +45 = 30 unit + 15 integ)

## Next phase
**P3-BA** — three more specialty/sensory modules. Candidates: neurorehab_ext, neuromuscular, chronic_pain_rehab, wound_ostomy, comprehensive_rehab, telerehab, sleep_medicine_ext, transplant_extended, home_health, community_health.
