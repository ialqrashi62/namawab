# SHIP_BE — P3-BE (v3.17.0)

## Modules shipped (3 new, 134 total)

| Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|
| `transplant_living` | Transplant-Living | Transplant | 10 | 10 unit + 5 integ |
| `neonatal_ext` | Neonatal-Ext | NICU | 10 | 10 unit + 5 integ |
| `perinatal_ext` | Perinatal-Ext | Maternal-Fetal | 10 | 10 unit + 5 integ |

## Cumulative count
- **PCC modules:** 134 (was 131)
- **Total tests:** 3192 (was 3147)
- **Audit:** 132/132 PASS (was 129)

## Transplant-Living engine functions
1. `LivingDonorWorkup` — age + BMI + GFR + comorbidity + motivation
2. `DonorNephrectomy` — side + technique + vasculature + prior surgery
3. `PairedExchange` — donor + recipient + blood + paired status
4. `LivingDonorFollowup` — months + GFR + hypertension + recovery
5. `ABOiTransplant` — donor + recipient titer + plasmapheresis
6. `Desensitization` — titer + prior transplant + plasmapheresis + rituximab
7. `LDRecipient` — donor + relation + KPD + induction
8. `LDOutcomes` — donor complication + 1yr graft + return HD + donor GFR
9. `LDRecipientDose` — weight + induction + total dose
10. `LDComplications` — complication + weeks + severity + graft function

## Neonatal-Ext engine functions
1. `APHARScore` — pH + base deficit + Apgar 5 + resuscitation
2. `TherapeuticHypothermia` — qualifies + hours + target temp + duration
3. `NEC` — distension + pneumatosis + systemic + labs
4. `RDS` — GA + surfactant + CPAP + FiO2
5. `BPD` — GA + oxygen at 36w + ventilation days
6. `ROP` — GA + weeks + exam + zone + stage
7. `NEOScore` — support + GA + vasopressor + nutrition
8. `SEPSISScreen` — temp + HR + WBC + CRP + age
9. `NeuroOutcomes` — Apgar + HIE + prematurity + sepsis + MRI
10. `Dehydration` — weight loss + feeding + urine + sodium

## Perinatal-Ext engine functions
1. `PrenatalCare` — trimester + GA + visits + high-risk
2. `HighRiskPregnancy` — condition + GA + severity + maternal age
3. `Preeclampsia` — BP + proteinuria + symptoms + GA
4. `PrenatalScreen` — GA + screen + risk + ultrasound
5. `FGR` — estimated GA + actual GA + AC + doppler
6. `LaborMgmt` — stage + dilation + effacement + FHR
7. `IntrapartumMonitor` — baseline + variability + decels + category
8. `PostpartumHemorrhage` — EBL + uterine tone + placenta
9. `PerinatalMental` — Edinburgh + anxiety + support + history
10. `PerinatalOutcome` — GA + weight + Apgar 5 + breastfeeding + complications

## Files
- Engines: `pcc/{transplant_living,neonatal_ext,perinatal_ext}/*_engine.js`
- Unit tests: `pcc/{transplant_living,neonatal_ext,perinatal_ext}/*_test.js`
- Integration: `pcc/{transplant_living,neonatal_ext,perinatal_ext}/*_integration_test.js`
- Routes: `pcc/{transplant_living,neonatal_ext,perinatal_ext}/*_routes.js`
- SQL: `pcc/migrations/p3be_up.sql` + per-module `p3be_{mod}_up.sql`
- Generator: `pcc/gen_p3be.py`

## Server wiring
- `server.js` v3.17.0 (was 3.16.0)
- 3 routers added
- 3 module names in `modules[]` (134 total)
- Log line: "v3.17.0: 134 modules wired, P3-BE transplant_living/neonatal_ext/perinatal_ext"
- Health endpoint confirms 134 modules
- All 3 endpoints respond

## Audit
- `scratch/audit_all.py` modules list: 132 (was 129)
- All 132 PASS

## Test runner
- `scratch/p3_temp_scripts/test_runner.py` includes 3 new pairs
- **TOTAL: 3192 tests** (was 3147; +45 = 30 unit + 15 integ)

## Next phase
**P3-BF** — three more specialty/reproductive modules. Candidates: fertility, palliative_ext2, transplant_pediatric, transplant_immunology, transplant_pharmacy, womens_health_ext, mens_health_ext, neuro_ext2, cv_ext2.
