<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-004
name: "Preventive Cardiology"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Preventive Cardiology — CARD-004

## Mission
Cardiovascular risk reduction: ASCVD risk assessment, lipid management, BP control, lifestyle intervention, primary+secondary prevention.

## Scope
Risk assessment (ASCVD calculator), lipid panel + Lp(a), coronary calcium score, carotid intima-media thickness, statin/ezetimibe/PCSK9i prescription, BP management, smoking cessation, lifestyle (diet, exercise, weight), cardiac rehab referral.

## Top 10 Conditions
1. Primary prevention (Z13.6) 2. Hypercholesterolemia (E78.0) 3. Familial hypercholesterolemia (E78.01) 4. Hypertension (I10) 5. DM2 (E11.9) 6. Metabolic syndrome (E88.81) 7. Stable CAD (I25.10) 8. Post-MI (I25.2) 9. Post-PCI (Z95.5) 10. Pre-eclampsia history (O14.9)

## Top 20 Procedures
Lipid panel 80061, Lp(a) 83695, ApoB 82172, hsCRP 86141, HbA1c 83036, BMP 80048, coronary calcium 75571, CIMT 93880, stress ECG 93015, echo 93306, ABI 93923, PWV, statin Rx, ezetimibe Rx, PCSK9i Rx, bempedoic acid Rx, aspirin 81mg, antihypertensive Rx, smoking cessation counseling, cardiac rehab referral

## Red Flags
Familial hypercholesterolemia (LDL>190 untreated) · Statin-induced myopathy (CK>10x) · Statin + macrolide interaction · Pregnancy on statin (teratogen) · Severe HTN (>180/120) · Acute chest pain (refer to CARD-002) · New DM on statin (monitor) · LFT >3x ULN on statin · Bleeding on aspirin · Suicidal ideation (post-MI depression)

## Database: 6 tables, RLS-forced
## 12 endpoints
## 4 LangChain chains

## Compliance
JCI: ACC/COP/MMU/QPS; U.S. PREVENTIVE SERVICES TASK FORCE; ESC CV prevention 2021; ACC/AHA ASCVD 2018+; CBAHI; NPHIES (preventive bundles); SFDA (statin + PCSK9i REMS); PDPL; HIPAA

## Engine: preventive_cardiology_engine.js
ASCVDRiskScore(age, race, chol, hdl, sbp, dm, smoker, htntx), FamilialHypercholesterolemiaDutch, StatinBenefitEstimator, StatinMyopathyRisk, LpaThreshold, CoronaryCalciumScore, ABICalculator, BPGoalTarget, ASCVD10Year30Year, CardiacRehabEligibility

## Sub-Departments
Lipid Clinic, Hypertension Clinic, Cardiac Rehab, Smoking Cessation

---
*L1 DRAFT complete.*