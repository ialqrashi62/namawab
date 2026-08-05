# P3-ID → P3-IF — v3.184.0 → v3.186.0 — Live on port 3201

## 9 Modules shipped, tested, and live

| Phase | Version | Modules |
|---|---|---|
| P3-ID | 3.184.0 | pcc_advanced_heart_failure, pcc_pulmonary_hypertension, pcc_cardiac_rehab_ext |
| P3-IE | 3.185.0 | pcc_valvular_intervention, pcc_arrhythmia_advanced, pcc_lipidology |
| P3-IF | 3.186.0 | pcc_aortic_intervention, pcc_peripheral_vascular, pcc_venous_thromboembolism |

## Tests: 351/351 PASS

- Unit tests: 180/180 (20 per module × 9 modules)
- Integration tests: 171/171 (19 per module × 9 modules)

## Live verified on port 3201

```
GET  /api/v1/pcc-advanced-heart-failure/list         v3.184.0 (10 funcs)
GET  /api/v1/pcc-pulmonary-hypertension/list         v3.184.0 (10 funcs)
GET  /api/v1/pcc-cardiac-rehab-ext/list              v3.184.0 (10 funcs)
GET  /api/v1/pcc-valvular-intervention/list          v3.185.0 (10 funcs)
GET  /api/v1/pcc-arrhythmia-advanced/list            v3.185.0 (10 funcs)
GET  /api/v1/pcc-lipidology/list                     v3.185.0 (10 funcs)
GET  /api/v1/pcc-aortic-intervention/list            v3.186.0 (10 funcs)
GET  /api/v1/pcc-peripheral-vascular/list            v3.186.0 (10 funcs)
GET  /api/v1/pcc-venous-thromboembolism/list         v3.186.0 (10 funcs)
```

## Live verified with tenant_id

- CHA2DS2-VASc(80, stroke, CHF, HTN) = 6 → anticoagulation ✅
- HeartFailureStage(HFrEF, dyspnea) = C-HFrEF ✅
- WellsScoreDVT(cancer, paralysis, bedrest) = 3 likely ✅
- LDLTarget(very_high) = 55 mg/dL ✅

## Skills created (3, all Global batch scope)

- `.agents/skills/pcc-p3-batch-shipper/SKILL.md` — multi-phase batch (124 phases)
- `.agents/skills/pcc-multi-agent/SKILL.md` — parallel 3-agent
- `.agents/skills/pcc-loop-engineering/SKILL.md` — loop control (4/8/20 caps)

## Generator script

- `pcc/gen_p3master.py` — produces all 124 phases (399 modules) in 33 seconds
- `pcc/scratch/restore_hand_written_engines.js` — restores 9 hand-written modules
- `pcc/scratch/regen_tests.js` — regenerates matching tests
- `pcc/scratch/test_p3id_to_p3if.js` — runs all 9 module tests
