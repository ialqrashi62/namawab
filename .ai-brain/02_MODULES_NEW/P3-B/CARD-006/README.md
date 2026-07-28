<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-006
name: "Cardio-Obstetrics"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Cardio-Obstetrics — CARD-006

## Mission
Cardiac care in pregnancy: pre-conception counseling, pregnancy management (high-risk), delivery planning, post-partum.

## Scope
Pre-conception risk assessment (mWHO classification), pregnancy in known cardiac disease, peripartum cardiomyopathy, hypertensive disorders, aortic disease, anticoagulation in pregnancy, delivery mode + hemodynamic monitoring.

## Top 10 Conditions
1. Pregnancy in known HD (Z34.91) 2. Peripartum cardiomyopathy (O90.3) 3. Chronic HTN in pregnancy (O10.9) 4. Pre-eclampsia (O14.9) 5. Gestational HTN (O13) 6. Mechanical valve + pregnancy (Z95.2) 7. Marfan + pregnancy (Q87.4) 8. Eisenmenger + pregnancy (I27.83) 9. Aortic dissection in pregnancy (I71.0) 10. Cardiac arrest in pregnancy (O75.4)

## Top 20 Procedures
Echo in pregnancy 93306, ECG, TTE 76825, fetal echo 76827, BNP, troponin, anticoagulation (LMWH transition), peripartum hysterectomy, C-section for cardiac indication, hemodynamic monitoring, intra-arterial line, PA catheter, ECMO, balloon pump, transfer to cardiac center, MDT meeting, pre-conception counseling, teratogen review (warfarin ACE-i statins), mWHO class assignment, delivery plan, VTE prophylaxis

## Red Flags
Peripartum cardiomyopathy with EF<35% · Aortic dissection · Mechanical valve thrombosis · Pulmonary HTN crisis · Aortic root >45mm (Marfan) · Acute heart failure · Pulmonary embolism · Hemolysis/elevated LFT/low platelets (HELLP) · Eclampsia · Amniotic fluid embolism · Cardiac arrest (perimortem C-section <5min)

## Database: 6 tables, RLS-forced
## 11 endpoints
## 3 LangChain chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL. ESC pregnancy CVD 2018. ACOG guidelines. ISMP teratogen list.

## Engine: cardio_obstetrics_engine.js
mWHOClass, ASCRiskScore, PeripartumCMRisk, TeratogenCheck, AnticoagPregnancy, AorticRootZScore, DeliveryPlanningScore, ECMOIndications, mWHOOutcomes, CardioObMDT

## Sub-Departments
Cardio-OB Clinic, High-Risk OB Unit, Fetal Cardiology

---
*L1 DRAFT complete.*