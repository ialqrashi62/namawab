# 30 — User Stories (CARD-001)

> Owner: PM/UX · Template: user_story · Tier 1

```yaml
- id: US-CARD-001
  as_a: cardiologist
  i_want: to see the patient timeline (encounters, ECG, echo, cath, devices) on one screen
  so_that: I can make decisions in <30s without switching tabs
  acceptance_criteria:
    - timeline shows last 12 months by default
    - click any event → opens detail modal
    - RTL correct, AR primary
    - red_flag events highlighted
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-002
  as_a: cardiologist
  i_want: the system to auto-interpret uploaded ECG and flag STEMI within 30s
  so_that: I can activate CODE STEMI without delay
  acceptance_criteria:
    - upload ECG image/DICOM
    - engine runs cardiology.ecgBasic within 30s
    - if red_flag → critical banner + auto-create cardio_red_flag_activations row + page on-call
    - 4-eye review required before invasive action
  red_flag: true
  rls_required: true
  arabic_ux: true

- id: US-CARD-003
  as_a: cardiologist
  i_want: to compute HEART score from chest pain encounter data
  so_that: I can risk-stratify and decide admission vs discharge
  acceptance_criteria:
    - POST /api/cardiology/risk-scores/heart with HEARTScoreInput
    - returns {score, risk, recommendation, redFlag}
    - CDSS rule: redFlag triggers auto-admission suggestion
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-004
  as_a: cardiologist
  i_want: the co-pilot to recommend GDMT for HF patients based on EF, NYHA, labs, current meds
  so_that: I can optimize therapy with one click
  acceptance_criteria:
    - POST /api/cardiology/risk-scores/hf-gdmt
    - returns {changes, contra, monitor, redFlag}
    - applies CDS rules (hyperkalemia, eGFR, BP, HR)
    - cites ACC/AHA 2024 + ESC 2023
  red_flag: true (K>=6.0, eGFR<15, SBP<80, HR<50)
  rls_required: true
  arabic_ux: true

- id: US-CARD-005
  as_a: er_doctor
  i_want: to activate CODE STEMI from any device in the ER
  so_that: cath lab and cardiologist are paged immediately
  acceptance_criteria:
    - one-tap activation with patient + encounter + RF id
    - <30s to page (priority channel)
    - audit CRITICAL entry
    - 4-eye cardiologist review required
  red_flag: true
  rls_required: true
  arabic_ux: true

- id: US-CARD-006
  as_a: cath_lab_nurse
  i_want: to record cath lab procedure findings with structured vessels + interventions
  so_that: NPHIES claim can be auto-generated
  acceptance_criteria:
    - structured per-vessel stenosis table
    - structured per-stent table (type, size, deployed_at)
    - amount_total auto-calculated from NPHIES bundle
    - Idempotency-Key prevents duplicate submission
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-007
  as_a: device_clinic_tech
  i_want: to log PM/ICD interrogation data
  so_that: cardiologist can review remotely
  acceptance_criteria:
    - structured interrogation fields (battery, leads, thresholds, episodes)
    - auto-flag if battery ERI or lead impedance out of range
    - patient_id RLS-scoped
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-008
  as_a: hf_nurse
  i_want: to track daily weight + symptoms for HF patients
  so_that: decompensation is detected early
  acceptance_criteria:
    - simple input: weight + symptoms checkboxes
    - red_flag if weight gain > 2kg in 3 days
    - trend chart over time
    - telehealth sync from home devices
  red_flag: true
  rls_required: true
  arabic_ux: true

- id: US-CARD-009
  as_a: cardiologist
  i_want: to ask the co-pilot "is this ECG STEMI?" and get a structured answer
  so_that: I can validate my read quickly
  acceptance_criteria:
    - POST /api/cardiology/copilot/query
    - returns {answer_ar, citations, evidence_level, red_flag}
    - cites ACC/AHA 2024 §X.Y
    - refuses if no ECG context
    - LLM trace in langfuse
  red_flag: true
  rls_required: true
  arabic_ux: true

- id: US-CARD-010
  as_a: patient (portal)
  i_want: to see my upcoming appointments + recent results
  so_that: I can prepare for the visit
  acceptance_criteria:
    - read-only access
    - AR primary
    - RLS: own patient_id only
    - no LLM access from patient portal
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-011
  as_a: billing_clerk
  i_want: to submit NPHIES claim for cath procedure with one click after sign-off
  so_that: cash flow is fast
  acceptance_criteria:
    - auto-populated from cath report
    - eligibility check before submit
    - Idempotency-Key prevents double-claim
    - status tracked (queued/submitted/paid/denied)
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-012
  as_a: nurse
  i_want: to receive a CODE STEMI page on my phone with patient + location
  so_that: I can prep the cath lab
  acceptance_criteria:
    - push notification with patient + location
    - ACK button
    - SLA timer visible
    - falls back to SMS if push fails
  red_flag: true
  rls_required: true
  arabic_ux: true

- id: US-CARD-013
  as_a: anesthesiologist
  i_want: to receive preop cardiac clearance letter for a patient
  so_that: I can plan anesthesia
  acceptance_criteria:
    - preop_cardiac chain
    - RCRI score + recommendations
    - anticoag hold plan
    - clear clearance level
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-014
  as_a: admin
  i_want: to see cardiology KPIs (encounters/day, red_flag activations, cath volume, NPHIES revenue)
  so_that: I can plan resources
  acceptance_criteria:
    - dashboard with 4+ KPIs
    - drill-down to encounter list
    - AR + EN
    - tenant-scoped
  red_flag: false
  rls_required: true
  arabic_ux: true

- id: US-CARD-015
  as_a: cmio
  i_want: to audit all LLM co-pilot queries with red_flag detection rate
  so_that: I can monitor safety
  acceptance_criteria:
    - audit dashboard
    - red_flag detection rate > 99% (target)
    - false negative escalation
    - LLM cost per tenant
  red_flag: false
  rls_required: true
  arabic_ux: true
```
