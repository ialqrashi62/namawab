# CARD-301_STROKE — Business Flow (BPMN)

## Phase 1: Pre-Hospital
```
[EMS Dispatch] → [Suspected Stroke] → [Prenotify ED] → [Activate Code Stroke]
```

## Phase 2: ED Triage (0-10 min)
```
[Patient Arrival] → [NIHSS Calc] → [IV Access] → [Labs] → [Weight]
       ↓
[Code Stroke Pager] → [Neurologist On-Call]
```

## Phase 3: Imaging (10-45 min)
```
[Door-to-CT ≤25 min] → [Non-contrast CT]
       ↓
[CT Result] → [Hemorrhage?]
       ├─Yes→ [ICH Protocol]
       └─No→ [CTA] → [LVO?]
              ├─Yes→ [Thrombectomy Path]
              └─No→ [ASPECTS] → [Thrombolysis Path]
```

## Phase 4: Treatment (45-60 min)
```
[Eligible Patient] → [Consent (Arabic)] → [Tenecteplase Bolus]
       ↓
[Door-to-Needle ≤60 min] → [Monitor]
```

## Phase 5: Acute Care (1-72h)
```
[Stroke Unit Admission] → [Neuro Checks q1h] → [BP Control]
       ↓
[Swallow Screen ≤24h] → [DVT Prophylaxis]
```

## Phase 6: Secondary Prevention (Day 1-7)
```
[5-Element Bundle:
 1. Antiplatelet
 2. Statin
 3. Anticoag (if AFib)
 4. BP Control
 5. Lifestyle]
```

## Phase 7: Discharge & Follow-up
```
[Discharge Checklist] → [Arabic Patient Education]
       ↓
[30-day Outpatient Appointment] → [mRS Assessment]
       ↓
[GWTG-S Database Upload]
```

## Actors (Swim Lanes)

| Lane | Actor | Responsibilities |
|---|---|---|
| EMS | Paramedic | Initial assessment, prenotify, TLKW |
| Triage Nurse | RN | NIHSS, vitals, triage |
| ER Doctor | MD | Initial eval, Code Stroke activation |
| Stroke Neurologist | MD | NIHSS, treatment decision |
| Interventional Neuroradiologist | MD | Thrombectomy |
| Pharmacist | RPh | Tenecteplase preparation |
| Stroke Unit Nurse | RN | Hourly checks |
| Rehab Team | PT/OT/SLP | Mobility, swallow, function |
| Patient Portal | Patient | Self-management, education |
| Quality Coordinator | QA | GWTG-S data, SLA tracking |
