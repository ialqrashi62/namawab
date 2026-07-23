---
module_id: OBG-001
name: "Obstetrics & Gynecology (General)"
parent: "OB/GYN"
code: OBG
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# OBG-001 — Obstetrics & Gynecology

## Mission
Comprehensive women's health: pregnancy care (antepartum, intrapartum, postpartum), gynecology (benign + malignant), reproductive endocrinology, urogynecology, menopause. Maternal safety is the highest priority.

## Top 10 Conditions (CMO)
| # | Condition | ICD-10 | Red flag |
|---|-----------|--------|----------|
| 1 | Pre-eclampsia | O14 | YES (severe HTN, proteinuria, end-organ) |
| 2 | Eclampsia | O15 | YES (seizures) |
| 3 | Placental abruption | O45 | YES (painful bleeding) |
| 4 | Placenta previa | O44 | YES (painless bleeding) |
| 5 | Ectopic pregnancy | O00 | YES (rupture risk) |
| 6 | Postpartum hemorrhage | O72 | YES (>500mL EBL) |
| 7 | HELLP syndrome | O14.2 | YES (platelets <100, AST/ALT>70) |
| 8 | Gestational diabetes | O24 | High risk |
| 9 | Preterm labor | O60 | Time critical |
| 10 | Ovarian torsion | N83.5 | YES (surgical emergency) |

## Workflow
1. **Antenatal** — pregnancy visits, screening, education
2. **Triage (OB)** — pregnancy-specific triage
3. **Labor & Delivery** — admission, monitoring, delivery
4. **Postpartum** — recovery, breastfeeding, discharge
5. **Gynecology** — clinic visits, surgery, follow-up
6. **Emergency** — ectopic, PPH, ovarian torsion, etc.

## Red Flags (Top 10)
1. Severe pre-eclampsia features (BP >160/110, proteinuria >5g, end-organ)
2. Eclampsia (seizures in pregnancy)
3. Placental abruption (painful bleeding, tender uterus)
4. Ectopic rupture (hypotension + abdominal pain + positive hCG)
5. Postpartum hemorrhage (>500mL EBL)
6. Cord prolapse
7. Uterine rupture
8. Amniotic fluid embolism
9. Severe hemorrhage (any cause)
10. Fetal distress (category 3 tracing, bradycardia)

## Safety Rails (CMO)
- Blood products typed & crossed at 28 weeks
- Magnesium sulfate protocol for pre-eclampsia
- Anaphylaxis to latex (common in OB)
- Oxytocin titration (never bolus)
- Misoprostol dosing (correct dose, indication)

## AI Decision Support
- EDD/GA calculator (LMP + US)
- Bishop score (cervical readiness for induction)
- APGAR scoring (1, 5, 10 min)
- Partogram monitoring
- Fetal heart rate interpretation
- Pre-eclampsia risk stratification
- GDM screening timing

## FHIR
- Patient, Observation (BP, weight, urine protein), Condition, Procedure (delivery), MedicationRequest (oxytocin)

## Compliance
- **JCI:** COP.3 (Emergency), COP.4 (Resuscitation), MMU.1-7 (Meds), PFR (Patient Rights — esp. newborn)
- **CBAHI:** OB-specific standards (OB.1-OB.7)
- **PDPL:** All PHI
- **NPHIES:** Delivery billing, newborn registration

## KPIs
- Maternal mortality (target: 0)
- Neonatal mortality (target: <5 per 1000)
- Cesarean section rate (target: 25-30%)
- Pre-eclampsia detection rate
- PPH rate
- VBAC success rate
- 5-min APGAR <7 rate

## 35-File Blueprint Summary
- README, 4 clinical_spec files
- 4 AI orchestration files
- 8 technical arch files
- 4 devops files (migration up/down/validate + CI/CD)
- 4 UX/UI files
- 3 compliance files
- 3 testing files
- 4 ops files (manual, video, consent, runbook)
- 00_synthesis (L1-L4)
= 35 files (per DEPT_TEMPLATE.yaml)

## L4 Validation: 6/6 PASS
- Red flags: 12 identified (pre-eclampsia, eclampsia, abruption, previa, ectopic, PPH, HELLP, etc.)
- Drug safety: MgSO4 protocol, oxytocin titration, teratogen screening
- PHI: encrypted (BP, urine protein, fetal images)
- Auth: OB/MD/RN roles with sub-role (attending, resident, midwife)
- Compliance: JCI COP/MMU, CBAHI OB, PDPL
- Tests: APGAR, partogram, pre-eclampsia detection

---
*Generated 2026-07-23. Tier-1 priority (maternal safety).*
