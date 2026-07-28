<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-004
name: "Chest Pain Unit"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Chest Pain Unit — ER-004

## Mission
Chest Pain Unit: low-risk ACS workup, accelerated diagnostic protocol, observation 6-23h, same-day discharge vs admit.

## Scope
Accelerated diagnostic protocol (ADP), 0/3h troponin, stress testing, CT coronary, observation, ADAPT-ADP, MACS rule, HEART score, EDACS, outpatient follow-up.

## Top 10 Conditions: 1. Chest pain unspecified (R07.9) 2. Low-risk ACS (I24.9) 3. Atypical chest pain (R07.89) 4. GERD (K21.9) 5. Musculoskeletal (M54.5) 6. Anxiety (F41.1) 7. Stable angina (I20.8) 8. Costochondritis (M94.0) 9. PE ruled out (Z03.89) 10. Pericarditis (I31.9)
## Top 20 Procedures: Initial troponin 84484, repeat troponin 3h 84484, 0/1h troponin (high-sensitivity) 84484, ECG 93000, continuous rhythm monitor, CXR 71046, stress ECG 93015, stress echo 93350, MPI 78452, CT coronary 75574, D-dimer 85379, observation 99234, ADAPT rule, HEART score, EDACS, GRACE, TIMI, accelerated diagnostic protocol, shared decision-making, same-day discharge
## Red Flags: STEMI (transfer to cath lab) · NSTEMI high-risk (admit) · PE with hemodynamic instability · Aortic dissection · Pericardial tamponade · Tension PTX · Esophageal rupture (Boerhaave) · Pneumothorax · Pneumomediastinum
## Database: 5 tables, RLS-forced
## 10 endpoints, 4 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. ACC/AHA NSTE-ACS 2024. ACEP clinical policy. AHA scientific statement ADP.

## Engine: chest_pain_unit_engine.js
HEARTScore, EDACSScore, TIMIScore, GRACEInHosp, ADAPTRule, MacsScore, 0HourTroponin, 1HourDeltaTroponin, ADPEligibility, StressTestRecommendation

## Sub-Departments: CPU Beds, Observation Unit, Stress Lab

---
*L1 DRAFT complete.*