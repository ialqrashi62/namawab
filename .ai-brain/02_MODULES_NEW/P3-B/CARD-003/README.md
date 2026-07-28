<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-003
name: "Electrophysiology"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Electrophysiology — CARD-003

## Mission
Comprehensive EP lab: EP study, ablation (SVT, AF, VT, WPW), device implant (PPM, ICD, CRT-D, leadless), LAA closure (post-Watchman follow-up).

## Scope
Diagnostic EP study; ablation (SVT, typical AFL, AF PVI, VT, idiopathic VT, AVNRT, AVRT); device implant (single/dual chamber PPM, ICD, CRT-D, leadless PPM); lead extraction; generator change.

## Top 10 Conditions
1. AVNRT (I45.6) 2. AVRT/WPW (I45.6) 3. Typical AFL (I48.3) 4. AF (I48.91) 5. Idiopathic VT (I47.2) 6. SCD survivor (I46.9) 7. Symptomatic bradycardia (R00.1) 8. Heart block (I44.3) 9. HFrEF for CRT (I50.22) 10. Lead failure (T82.1)

## Top 20 Procedures
EP study 93620, SVT ablation 93653, AF ablation 93656, AFL ablation 93655, VT ablation 93654, AVNRT ablation 93653, ICD single 33240, ICD dual 33249, CRT-D 33249+33225, PPM single 33206, PPM dual 33207, leadless PPM 33274, lead extraction 33234, generator change 33262, TEE for AF ablation 93312, CT for AF 71275, tilt table 93660, signal-averaged ECG 93278, Holter 93224, loop recorder 33285

## 12 Red Flags
Sustained VT · VF cardiac arrest · Complete heart block · SSS with syncope · ICD shock storm · Lead fracture · Cardiac tamponade (post-ablation) · Esophageal injury (post-AF ablation) · Phrenic nerve injury · Pulmonary vein stenosis · AV fistula (post-lead extraction) · Device infection

## Database (8 tables, RLS-forced)

## 16 Endpoints

## 5 LangChain Chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/PDPL/SFDA/HIPAA. EP-specific: ACT for irrigated ablation, heparin ACT 300-400s, reversal with protamine.

## Engine: $engineName (10 functions)
EPSInterpretation, AVNRTvsAVRT, AFLIsthmus, AFPVICircumference, VTLVMap, ICDShockAppropriateness, SSSDiagnosis, CRT_D_QRS_Morphology, LeadImpedanceCheck, GeneratorBatteryERI

## Sub-Departments
EP Lab 1, EP Lab 2, Device Clinic, Remote Monitoring Hub

## Sign-off
CMO/AIE/SA/DSL/PM/CQO/ORC: L1 DRAFT complete.