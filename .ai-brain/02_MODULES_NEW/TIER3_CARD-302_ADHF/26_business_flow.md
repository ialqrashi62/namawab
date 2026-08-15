# CARD-302_ADHF — BPMN Workflow

## Phase 1: Initial Assessment
```
[Patient Referral] → [HF Pathway] → [Echo + BNP + ECG]
       ↓
[HF Diagnosis] → [Classify: HFrEF / HFmrEF / HFpEF]
       ↓
[Start GDMT 4-Pillar]
```

## Phase 2: GDMT Optimization
```
[EF <40%] → [Start All 4 Pillars]
       ↓
[4-Pillar Initiation] → [Titration Schedule]
       ↓
[4-Pillar Optimization] → [Loop 6 months]
```

## Phase 3: Acute Decompensation
```
[ED/Clinic Presentation] → [Acute HF Workup]
       ↓
[IV Loop Diuretic] → [I/O Monitoring]
       ↓
[Daily Weight] → [Daily BMP]
       ↓
[Discharge Planning] → [GDMT Continuation]
```

## Phase 4: Cardiogenic Shock Protocol
```
[SBP <90 + Lactate >2] → [Activate Shock Team]
       ↓
[SCAI Stage] → [DRIPS Protocol]
       ↓
[Outcome] → [Recovery / LVAD / Transplant]
```

## Phase 5: LVAD Pathway
```
[Stage D HF] → [LVAD Evaluation] → [Heart Team Review]
       ↓
[LVAD Implant] → [ICU] → [Floor] → [Rehab]
       ↓
[Outpatient LVAD Clinic] → [Lifetime Care]
```

## Phase 6: Transplant Pathway
```
[End-Stage HF] → [SCOT Listing]
       ↓
[Status 1A / 1B / 2] → [Match Run]
       ↓
[Transplant Surgery] → [ICU]
       ↓
[Induction Immunosuppression] → [Biopsies]
       ↓
[Long-Term Surveillance]
```

## Phase 7: Palliative Care
```
[End-Stage HF] → [Palliative Care Consult]
       ↓
[Goals of Care] → [Advance Directives]
       ↓
[Hospice] → [End-of-Life Care]
```

## Actors (Swim Lanes)

| Lane | Actor | Responsibilities |
|---|---|---|
| HF Cardiologist | MD | GDMT, screening, listing |
| Heart Team | MD | LVAD/transplant decision |
| Cardiac Surgeon | MD | LVAD/transplant surgery |
| EP Cardiologist | MD | ICD/CRT implant |
| HF Nurse | RN | Daily I&O, education |
| Pharmacist | RPh | GDMT titration, TDM |
| Transplant Coordinator | RN | SCOT, donor match |
| Dietitian | RD | Low sodium, HF diet |
| Physical Therapist | PT | Cardiac rehab |
| Social Worker | LCSW | Psychosocial, financial |
| Palliative Care | MD | Advanced directives |
| Patient | — | Self-monitoring |
