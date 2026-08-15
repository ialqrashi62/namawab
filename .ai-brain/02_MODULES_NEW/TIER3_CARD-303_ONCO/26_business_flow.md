# CARD-303_ONCO — BPMN Workflow

## Phase 1: Pre-Treatment Assessment
```
[Cancer Diagnosis] → [Cardio-Onc Referral]
       ↓
[Baseline Echo + GLS + Biomarkers]
       ↓
[HFA-ICOS Risk Score]
```

## Phase 2: Risk Stratification
```
[Low Risk] → [Standard Surveillance]
       ↓
[Moderate Risk] → [Echo every 3-6 months]
       ↓
[High Risk] → [Echo every 3 months + Cardioprotection]
       ↓
[Very High Risk] → [Cardio-Onc + MDT + Cardioprotection]
```

## Phase 3: Anthracycline Monitoring
```
[Chemo Start] → [Echo every 3 months]
       ↓
[GLS drop >15%] → [Hold Chemo]
       ↓
[EF drop >10% to <50%] → [Hold + Optimize]
       ↓
[EF <50% Persistent] → [Permanent D/C]
```

## Phase 4: ICI Myocarditis
```
[ICI Start] → [Baseline ECG + Troponin]
       ↓
[Every Cycle] → [Troponin check]
       ↓
[Troponin ↑] → [Pause ICI + Steroids]
       ↓
[Methylprednisolone 1-2 mg/kg]
       ↓
[If no response] → [Verify MRI + Biopsy]
```

## Phase 5: Cancer VTE
```
[Suspected VTE] → [CTPA / Doppler US]
       ↓
[Confirmed VTE] → [Drug Choice]
       ↓
[Non-Gastric Cancer] → [DOAC]
       ↓
[Gastric/UGI] → [LMWH]
       ↓
[6 months minimum]
```

## Phase 6: HTN on VEGF Inhibitor
```
[VEGF Start] → [Weekly BP Monitor]
       ↓
[BP >140/90] → [Start ACEi/ARB]
       ↓
[BP >180/110] → [Hold + Hospitalize]
```

## Phase 7: Survivorship
```
[End of Treatment] → [Annual CV Risk]
       ↓
[5 Years] → [Cumulative Risk Assessment]
       ↓
[10+ Years] → [Cardiac Amyloid Workup]
       ↓
[15+ Years] → [Annual Echo + ECG]
```

## Actors

| Lane | Actor | Responsibility |
|---|---|---|
| Cardio-Onc Specialist | MD | Risk stratify, monitor |
| Medical Oncologist | MD | Cancer therapy decisions |
| Pharmacist | RPh | Drug interactions |
| Echo Tech | Sonographer | Baseline + serial echoes |
| Hematologist | MD | Blood cancers, amyloid |
| Radiation Oncologist | MD | Radiotherapy decisions |
| Nurse | RN | Coord + patient education |
| Patient | — | Self-monitoring |
