# CARD-304_ROBOTIC — BPMN Workflow

## Phase 1: Heart Team Consultation
```
[Cardiac Surgery Referral]
       ↓
[Heart Team MDT (Cardiology + Surgery + Anesthesia)]
       ↓
[Decision: Robotic / Open / Catheter]
       ↓
[Document MDT decision + Consent (PDPL)]
```

## Phase 2: Pre-Op Workup
```
[Heart Team Approval]
       ↓
[Echo (within 30 days) + Coronary anatomy]
       ↓
[PFTs + Renal function + Frailty]
       ↓
[Blood typing + Crossmatch]
       ↓
[Anesthesia + Perfusionist consult]
       ↓
[All 10 checklist items complete]
```

## Phase 3: Day of Surgery
```
[Pre-op Verification]
       ↓
[Anesthesia Induction]
       ↓
[Robotic Docking (DaVinci)]
       ↓
[Cardiopulmonary Bypass]
       ↓
[Procedure]
       ↓
[Weaning from Bypass]
       ↓
[Transfer to ICU]
```

## Phase 4: Post-Op ICU
```
[ICU Admission]
       ↓
[24-48 hours: Hemodynamic monitoring]
       ↓
[Weaning Ventilation]
       ↓
[Inotropes → Off]
       ↓
[Transfer to Step-Down]
```

## Phase 5: Step-Down + Cardiac Rehab
```
[Step-Down Admission]
       ↓
[Mobilization + Telemetry]
       ↓
[Cardiac Rehab Phase 1]
       ↓
[Education + Discharge planning]
       ↓
[Discharge 5-7 days]
```

## Phase 6: Follow-Up
```
[1-week visit]
       ↓
[1-month echo]
       ↓
[3-month echo]
       ↓
[1-year echo + ECG]
       ↓
[Annual valve function]
       ↓
[5-year survival]
```

## Actors

| Lane | Actor | Responsibility |
|---|---|---|
| Cardiac Surgeon | MD | Procedure |
| Cardiologist | MD | Heart Team, post-op |
| Anesthesia | MD | Intra-op |
| Perfusionist | Perfusion | CPB |
| ICU Intensivist | MD | Post-op |
| Cardiac Rehab | PT | Recovery |
| Nurse Coordinator | RN | Logistics |
| Patient | — | Self-monitoring |
