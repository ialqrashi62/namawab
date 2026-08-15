# CARD-304_ROBOTIC — Wireframes

## Page 1: Robotic CV Surgery Dashboard
```
┌────────────────────────────────────────────────────────────┐
│ مركز جراحة القلب الروبوتية — Robotic CV Surgery Center    │
├────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│ │Pending     │ │Procedures  │ │TAVI        │ │Conv. Rate││
│ │   8        │ │  (90d) 24  │ │  12        │ │   4%     ││
│ │   3        │ │ ↑ from 18  │ │  ↑ from 8  │ │ ↓ from 6%││
│ └────────────┘ └────────────┘ └────────────┘ └──────────┘│
├────────────────────────────────────────────────────────────┤
│ Active Cases (8)                                           │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Patient | Diagnosis | Procedure | STS | Action │
│ │ 12345   | MR Grade 4 | Robotic Mitral Repair | 2.3% | View │
│ │ 67890   | Severe AS  | TAVI                | 6.5% | View │
│ │ 55555   | AF + High   | WATCHMAN            | 4.0% | View │
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

## Page 2: Robotic CV Case Detail
```
┌────────────────────────────────────────────────────────────┐
│ Case #67890 — Patient ID 67890                              │
├────────────────────────────────────────────────────────────┤
│ Diagnosis: Severe Aortic Stenosis | Procedure: TAVI        │
│ EF: 50% | Creatinine: 1.2 | STS: 6.5%                       │
├────────────────────────────────────────────────────────────┤
│ Heart Team Decision (2026-08-01):                          │
│ - Dr. Ali (Cardiologist): APPROVE                           │
│ - Dr. Ahmed (Cardiac Surgeon): APPROVE                      │
│ - Dr. Sara (Anesthesia): APPROVE                            │
│ Final: TAVI recommended                                      │
├────────────────────────────────────────────────────────────┤
│ Pre-Op Checklist (10/10 ✓)                                  │
│ ✓ Echo (2026-08-10) ✓ PFTs ✓ Renal ✓ Frailty               │
│ ✓ Coag ✓ Blood ✓ Consent ✓ Anesthesia ✓ Perfusionist ✓ ECG │
├────────────────────────────────────────────────────────────┤
│ [Schedule Surgery] [Order Devices] [Update Status]          │
└────────────────────────────────────────────────────────────┘
```

## Page 3: Robotic OR Detail
```
┌────────────────────────────────────────────────────────────┐
│ Robotic OR — DaVinci Xi Console                             │
├────────────────────────────────────────────────────────────┤
│ Procedure: Robotic Mitral Valve Repair                       │
│ Console Surgeon: Dr. Ahmed | Assistant: Dr. Omar            │
│ Console Hours: 3.5h | Bypass Time: 95 min                   │
│ Cross Clamp: 65 min | Conversion to Open: NO                │
├────────────────────────────────────────────────────────────┤
│ Outcome: Successful | No complications                       │
│ Patient: Stable, transferred to ICU                          │
├────────────────────────────────────────────────────────────┤
│ [Post-Op Orders] [Schedule Follow-Up]                       │
└────────────────────────────────────────────────────────────┘
```

## Page 4: STS Risk Calculator
```
┌────────────────────────────────────────────────────────────┐
│ STS Risk Calculator — حاسبة المخاطر                         │
├────────────────────────────────────────────────────────────┤
│ Patient: 67890  Age: 80  EF: 50%  Creatinine: 1.2           │
│ ☑ Dialysis  ☑ Emergency  ☐ Prior Surgery  ☐ DM  ☐ HTN  ☐ COPD│
├────────────────────────────────────────────────────────────┤
│ [Calculate STS Risk]                                       │
│                                                             │
│ Result: STS Score: 6.5% | Risk: HIGH                       │
│ Recommendation: Consider TAVI or transcatheter approach      │
└────────────────────────────────────────────────────────────┘
```
