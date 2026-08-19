# TIER4_ENDO-101..108 — 8 Endocrinology Subspecialties

**Date: 2026-08-15**
**Commit: 58a61c91**

## 8 Engines
| # | Module | Key Functions |
|---|---|---|
| 101 | Diabetes | diabetesClassification, insulinInitiation, diabeticKetoacidosis |
| 102 | Thyroid | hypothyroidism, hyperthyroidism, thyroidNodule |
| 103 | Adrenal | adrenalInsufficiency, cushingsEval, pheochromocytoma |
| 104 | Pituitary | prolactinoma, acromegaly, hypopituitarism |
| 105 | Bone/Ca | osteoporosisFractureRisk, hypercalcemia |
| 106 | Lipids | ldlManagement, statinIntolerance |
| 107 | Obesity | obesityClassTherapy, bariatricEval |
| 108 | Repro | pcos, hypogonadism |

## Smoke 8/8 PASS
- DM classify → t2dm_likely
- Thyroid hypo → levothyroxine_start_then_titrate
- Adrenal AI → physiologic_hydrocortisone
- Prolactinoma → cabergoline_high_dose_refer_neurosurgery
- Osteoporosis → bisphosphonate_or_denosumab_or_teriparatide
- LDL very_high → high_intensity_statin_plus_ezetimibe
- Obesity class 3 → glp1_agonist_then_bariatric_evaluation
- PCOS classic → letrozole_or_clomiphene

## Cumulative: 96 Tier-4 + 155 Tier-3 = 251 routers