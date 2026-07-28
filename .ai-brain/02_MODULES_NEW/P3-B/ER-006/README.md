<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-006
name: "Psychiatric Emergency"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Psychiatric Emergency — ER-006

## Mission
Psychiatric emergency: acute agitation, suicidal ideation, psychosis, substance withdrawal, medical clearance.

## Scope
Medical clearance, agitation management (verbal de-escalation, chemical, physical restraint), suicide risk assessment, involuntary commitment, substance withdrawal protocols, toxicology, transfer to inpatient psych, community resources.

## Top 10 Conditions: 1. Suicidal ideation (R45.851) 2. Acute agitation (R45.1) 3. Acute psychosis (F23) 4. Substance withdrawal (F10-F19) 5. Acute mania (F30) 6. Severe depression (F33.2) 7. Panic attack (F41.0) 8. Conversion disorder (F44) 9. Delirium (F05) 10. Personality disorder crisis (F60)
## Top 20 Procedures: Medical screening exam, toxicology screen 80307, blood alcohol, urine drug screen, ECG, agitated patient protocol, verbal de-escalation, chemical restraint (haloperidol IM, lorazepam IM, droperidol), physical restraint, suicide risk assessment (C-SSRS), homicidality assessment, capacity assessment, involuntary commitment paperwork, psychiatric consult, social work consult, discharge planning, safety plan, lethal means counseling, follow-up appointment, transfer to psych facility
## Red Flags: Active suicidal plan/means · Homicidal ideation with plan/means · Severe agitation (immediate harm) · Acute psychosis with command hallucinations · Delirium tremens (DTs) · Neuroleptic malignant syndrome · Serotonin syndrome · Catatonia · Severe withdrawal · Acute mania with psychosis
## Database: 5 tables, RLS-forced
## 10 endpoints, 3 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. KSA mental health law. WHO mental health gap. APA practice guidelines.

## Engine: psych_emergency_engine.js
CSSRS_Score, ColumbiaScale, AgitationSedationScale, WithdrawalAssessmentCIWA_Ar, DTRiskScore, CapacityAssessment, InvoluntaryCommitmentCriteria, SubstanceSeverity, RestraintIndication, DischargeSafetyPlan

## Sub-Departments: Psych ED, Quiet Room, Observation Beds

---
*L1 DRAFT complete.*