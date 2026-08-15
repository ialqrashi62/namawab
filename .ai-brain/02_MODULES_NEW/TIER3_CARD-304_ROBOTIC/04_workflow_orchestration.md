# CARD-304_ROBOTIC — Workflow Orchestration

## Phase 1: Heart Team Consultation
- **Trigger**: New cardiac surgery candidate
- **Actions**: Cardiology + Cardiac Surgery + Anesthesia review
- **SLA**: Within 14 days of referral
- **Tools**: Heart Team clinic, MDT meeting

## Phase 2: Risk Stratification
- **Trigger**: Candidate identified
- **Actions**: STS + EuroSCORE II + frailty + pulmonary + renal
- **SLA**: Within 7 days
- **Tools**: Risk calculator, geriatrics consult

## Phase 3: Pre-Op Workup
- **Trigger**: Approved candidate
- **Actions**: Echo, coronary CTA/cath, PFTs, frailty
- **SLA**: Within 30 days
- **Tools**: Echo lab, cath lab, pulmonary function lab

## Phase 4: Pre-Op Checklist
- **Trigger**: 7 days pre-op
- **Actions**: Final review, consent, blood products
- **SLA**: 7 days pre-op
- **Tools**: Pre-op clinic

## Phase 5: Robotic Surgery
- **Trigger**: Day of surgery
- **Actions**: Anesthesia, robotic docking, surgery
- **SLA**: Same-day
- **Tools**: OR, DaVinci console, perfusion

## Phase 6: Post-Op ICU
- **Trigger**: Post-surgery
- **Actions**: Hemodynamic monitoring, ventilation, analgesia
- **SLA**: 24-72 hours
- **Tools**: ICU, mechanical ventilation, vasopressors

## Phase 7: Step-Down Unit
- **Trigger**: ICU stable
- **Actions**: Mobilization, telemetry, anticoagulation
- **SLA**: 3-5 days
- **Tools**: Step-down unit, cardiac rehab

## Phase 8: Discharge Planning
- **Trigger**: Hemodynamically stable
- **Actions**: Education, medications, follow-up
- **SLA**: 5-7 days post-op
- **Tools**: Discharge coordinator, cardiac rehab

## Phase 9: 30-Day Follow-Up
- **Trigger**: 30 days post-op
- **Actions**: Echo, ECG, medications review
- **SLA**: 30 days
- **Tools**: Outpatient cardiology

## Phase 10: Long-Term Surveillance
- **Trigger**: 1 year post-op
- **Actions**: Annual echo, valve function
- **SLA**: Annual
- **Tools**: Outpatient cardiology

## Orchestration Engines
- **Heart Team Scheduler**: MDT calendar
- **STS Risk Calculator**: Risk score
- **Robotic Console**: DaVinci integration
- **Perfusion Record**: CPB parameters
- **Post-Op Tracker**: ICU, step-down
- **Device Registry**: SFDA device tracking
