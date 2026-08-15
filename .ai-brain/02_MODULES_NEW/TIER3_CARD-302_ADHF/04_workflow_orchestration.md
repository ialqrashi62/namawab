# CARD-302_ADHF — Workflow & Orchestration

## Phase 1: Initial HF Assessment
- **Trigger**: New HF diagnosis or referral
- **Actions**: Echo, BNP, ECG, labs, etiology workup
- **SLA**: Complete within 48 hours
- **Tools**: Echo lab, LIS, HF pathway

## Phase 2: GDMT Optimization
- **Trigger**: Stable HF patient
- **Actions**: 4-pillar therapy initiation + titration
- **SLA**: All 4 pillars tried within 6 months
- **Tools**: HF order sets, titration schedule

## Phase 3: Acute Decompensation Admission
- **Trigger**: ED or clinic presentation
- **Actions**: IV diuretics, fluid balance, monitoring
- **SLA**: IV diuresis within 60 min
- **Tools**: HF admission order set, I&O

## Phase 4: Cardiogenic Shock Protocol
- **Trigger**: SBP <90, lactate >2, cool extremities
- **Actions**: Activate shock team, hemodynamics, MCS
- **SLA**: MCS within 90 min
- **Tools**: Shock team pager, cath lab, hybrid OR

## Phase 5: LVAD Evaluation
- **Trigger**: ACC Stage D HF
- **Actions**: Right heart cath, CPET, psychosocial, financial
- **SLA**: Complete evaluation within 30 days
- **Tools**: LVAD checklist, transplant coordinator

## Phase 6: LVAD Implantation
- **Trigger**: Patient approved
- **Actions**: Surgical implantation, post-op ICU
- **SLA**: Surgery within 7 days of approval
- **Tools**: Cardiac surgery, LVAD coordinator

## Phase 7: Heart Transplant Evaluation
- **Trigger**: LVAD failure or non-LVAD candidate
- **Actions**: SCOT listing, HLA typing, PRA
- **SLA**: Listing within 90 days
- **Tools**: Transplant coordinator, SCOT portal

## Phase 8: Post-Transplant Care
- **Trigger**: Heart transplant
- **Actions**: Immunosuppression, surveillance biopsies
- **SLA**: Biopsy schedule per protocol
- **Tools**: Endomyocardial biopsy, immunology lab

## Phase 9: Long-Term Follow-up
- **Trigger**: Stable post-intervention
- **Actions**: Clinic visits, echo, BNP, device check
- **SLA**: Every 3 months for HF, 1 month for transplant
- **Tools**: HF clinic, transplant clinic

## Phase 10: Palliative Care
- **Trigger**: Advanced directives, end-of-life
- **Actions**: Goals of care, hospice
- **SLA**: Documented within 48 hours
- **Tools**: Palliative care team

## BPMN Diagram
See `26_business_flow.md` for full BPMN 2.0 model.

## Orchestration Engines
- **GDMT Optimization Engine**: 4-pillar titration
- **Cardiogenic Shock Team**: Real-time activation
- **MCS Decision Engine**: DRIPS protocol
- **Transplant Coordinator**: SCOT submission
- **LVAD Monitoring**: Telemetry alerts
- **Palliative Consult**: Advance care planning
