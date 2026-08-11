# Workflow Orchestration — Pediatric_Neurology (DEP-029)

## BPMN State Machine
```yaml
workflow:
  id: pedsNeuro_patient_flow
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
| assessment | pedsNeuro_specialist |
| plan | pedsNeuro_specialist |
| intervention | pedsNeuro_specialist + nurse |
| discharge | pedsNeuro_specialist |
| followup | scheduler + pedsNeuro_specialist |