# CARD-301_STROKE — Workflow & Orchestration

## Phase 1: Pre-Hospital (EMS)
- **Trigger**: Suspected stroke symptoms
- **Actions**: Dispatch stroke-trained ambulance, prenotify stroke team, calculate TLKW
- **SLA**: <10 min dispatch
- **Tools**: EMS app, dispatch system, prenotification API

## Phase 2: ED Triage (Minutes 0-10)
- **Trigger**: Patient arrival + suspected stroke
- **Actions**: Code Stroke activation, immediate NIHSS, IV access, labs, weight
- **SLA**: Door-to-Physician ≤10 min
- **Tools**: Code Stroke pager, EHR alert, NIHSS calculator

## Phase 3: Imaging (Minutes 10-45)
- **Trigger**: Code Stroke activated
- **Actions**: Non-contrast CT head, CTA, ASPECTS scoring, CT perfusion
- **SLA**: Door-to-CT ≤25 min, Door-to-CT-result ≤45 min
- **Tools**: CT scanner, PACS, ASPECTS calculator, AI CT triage (Viz.ai)

## Phase 4: Treatment Decision (Minutes 45-60)
- **Trigger**: Imaging results available
- **Actions**:
  - If AIS + within 4.5h + no contraindication → IV Tenecteplase
  - If LVO + within 6h → Mechanical thrombectomy
  - If ICH → BP control, reversal, neurosurgery consult
- **SLA**: Door-to-Needle ≤60 min
- **Tools**: Decision support AI, drug formulary, consent forms

## Phase 5: Acute Care (Hours 1-72)
- **Trigger**: Treatment initiated
- **Actions**: Stroke unit admission, neuro checks q1h, BP monitoring, swallowing screen
- **SLA**: Stroke unit within 3h of treatment
- **Tools**: Stroke unit bed board, eMAR, vitals module

## Phase 6: Secondary Prevention (Days 1-7)
- **Trigger**: Acute phase stabilized
- **Actions**: Antiplatelet, statin, BP control, AF detection, lifestyle counseling
- **SLA**: All 5 elements documented by discharge
- **Tools**: Order sets, patient education, follow-up scheduler

## Phase 7: Rehabilitation (Days 3-30)
- **Trigger**: Acute phase stabilized
- **Actions**: PT/OT/Speech referral, mobility assessment, discharge planning
- **SLA**: Rehab consult within 48h
- **Tools**: Rehab order set, multidisciplinary notes

## Phase 8: Follow-up (Days 30-90)
- **Trigger**: Discharge
- **Actions**: 30-day clinic visit, medication adherence, mRS assessment
- **SLA**: 30-day follow-up rate ≥80%
- **Tools**: Outreach scheduler, patient portal reminders

## BPMN Diagram Index
See `26_business_flow.bpmn` for full BPMN 2.0 model with swim lanes.

## Orchestration Engines
- **Code Stroke Orchestrator**: Real-time SLA tracker
- **Thrombolysis Decision Engine**: Eligibility + contraindication check
- **Thrombectomy Routing Engine**: LVO → transfer coordination
- **Secondary Prevention Bundle Tracker**: 5-element verification
- **Follow-up Outreach Engine**: Patient reminder automation
