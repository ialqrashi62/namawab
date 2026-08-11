# Workflow Orchestration — Endocrinology (DEP-002)

## BPMN State Machine
```yaml
workflow:
  id: endocrinology_patient_flow
  states: [triage, assessment, plan, intervention, discharge, followup]
  transitions:
    - { from: triage, to: assessment, on: vitals_recorded }
    - { from: assessment, to: plan, on: dx_made }
    - { from: plan, to: intervention, on: order_signed }
    - { from: intervention, to: discharge, on: stable }
  sla_minutes: { triage: 15, assessment: 60, intervention: 240 }
```

## States Detail
1. **triage**: ESI 1-5 + red flags
2. **assessment**: history + exam + scoring
3. **plan**: differential + order set
4. **intervention**: procedure + medication
5. **discharge**: summary + education
6. **followup**: clinic + reminders

## Roles per State
| State | Roles |
|---|---|
| triage | nurse |
| assessment | endocrinology_specialist |
| plan | endocrinology_specialist |
| intervention | endocrinology_specialist + nurse |
| discharge | endocrinology_specialist |
| followup | scheduler + endocrinology_specialist |