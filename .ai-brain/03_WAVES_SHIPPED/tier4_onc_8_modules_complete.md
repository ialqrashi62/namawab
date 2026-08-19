# TIER4_ONC-101..108 — 8 Hematology/Oncology

**Date: 2026-08-15**
**Commit: 68fe2d59**

## 8 Engines
| # | Module | Key Functions |
|---|---|---|
| 101 | Solid | tnmStaging, ecogPerformanceStatus |
| 102 | Hem Malignancy | lymphomaStaging, myelomaStaging |
| 103 | SCT | transplantType, gvhdManagement |
| 104 | Radiation | radiotherapyPlan, radiationToxicity |
| 105 | Immuno-Onc | iraeManagement, iciSelection |
| 106 | Breast | breastCancerSubtype, geneticRisk |
| 107 | Lung | nsclcStaging, sclc |
| 108 | Palliative | cancerPain, cachexia, hospiceEligibility |

## Smoke 8/8 PASS
- TNM T3N2M0 → stage_3
- DLBCL iv → R-CHOP
- MM auto → melphalan
- RT 60/30 → 2.00 Gy/fx
- irAE G3 pneumonitis → IV steroids
- HR+ HER2- → endocrine + CDK4/6
- EGFR+ NSCLC → TKI
- Pain 8 → strong opioid

## Cumulative: 112 Tier-4 + 155 Tier-3 = 267 routers