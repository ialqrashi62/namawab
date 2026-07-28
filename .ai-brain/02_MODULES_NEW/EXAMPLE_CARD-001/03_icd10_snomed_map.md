# 03 — ICD-10 / SNOMED Map (CARD-001)

> Owner: CMO + CQO · Tier 1

## ICD-10 chapters (cardiology scope)

| Range | Description | Use |
|-------|-------------|-----|
| I00-I02 | Acute rheumatic fever | rare |
| I05-I09 | Chronic rheumatic heart disease | valve |
| I10-I15 | Hypertensive diseases | HTN clinic |
| I20-I25 | Ischemic heart diseases | ACS, stable angina |
| I26-I28 | Pulmonary heart disease | PE, cor pulmonale |
| I30-I52 | Other forms of heart disease | pericardial, valve, CM, arrhythmia, HF |
| I60-I69 | Cerebrovascular diseases | cardio-embolic stroke (CARD-004) |
| I70-I79 | Diseases of arteries | PVD (CARD-008) |
| I80-I89 | Diseases of veins | DVT |
| I95-I99 | Other circulatory | hypotension, shock |

## SNOMED CT top concepts

| Concept ID | FSN | Cardiology use |
|------------|-----|----------------|
| 39579001 | Angina pectoris | stable angina |
| 401303003 | Acute ST segment elevation MI | STEMI |
| 401304009 | Acute non-ST segment elevation MI | NSTEMI |
| 53741008 | Coronary arteriosclerosis | CAD |
| 84114007 | Heart failure | HF |
| 49436004 | Atrial fibrillation | AF |
| 49436004 | Atrial flutter | AFl |
| 38341003 | Hypertensive disorder | HTN |
| 70995007 | Pulmonary hypertension | PH |
| 709044004 | Chronic ischemic heart disease | CAD chronic |
| 232717008 | Coronary artery bypass graft | post-CABG |
| 415070008 | Percutaneous coronary intervention | post-PCI |
| 26160007 | Mitral valve insufficiency | MR |
| 60573004 | Aortic valve stenosis | AS |
| 85898001 | Cardiomyopathy | CM |

## Cross-walk sample (top 5 conditions)

| Condition | ICD-10 | SNOMED | NPHIES code | SFDA drug class |
|-----------|--------|--------|-------------|-----------------|
| STEMI anterior | I21.0 | 401303003 | NPH-CARD-001 | Antithrombotics |
| Heart failure NYHA II | I50.32 | 84114007 + 422968005 | NPH-CARD-014 | ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i |
| AF paroxysmal | I48.0 | 49436004 | NPH-CARD-019 | DOAC |
| Hypertension essential | I10 | 59621000 | NPH-CARD-005 | ACEi/ARB/CCB/diuretic |
| Aortic stenosis | I35.0 | 60573004 | NPH-CARD-022 | TAVR if severe |

## NPHIES bundles touched

- NPH-CARD: Cardiology outpatient bundle
- NPH-CARD-PCI: PCI bundle
- NPH-CARD-EP: EP bundle
- NPH-CARD-DEV: Device implant (PM/ICD/CRT)
- NPH-CARD-HF: HF clinic bundle
- NPH-CARD-NUC: Nuclear cardiology

## SFDA device classes

- Class III: ICD, CRT-D, TAVR, LVAD, ECMO, ablation catheters
- Class IIb: Pacemaker, DES, IVUS/OCT catheters
- Class IIa: Diagnostic catheters, guidewires

## ZATCA mapping

Cardiology services are invoiced via NPHIES bundles, not direct ZATCA. Pharmacy for DOAC prescriptions goes through ZATCA Phase 2 (UBL XAdES).
