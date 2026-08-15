# CARD-303_ONCO — Wireframes

## Page 1: Cardio-Onc Dashboard
```
┌────────────────────────────────────────────────────────────┐
│ Cardio-Onc Center — مركز قلب-أورام                       │
├────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│ │Active Cases│ │Very High R.│ │ICI Myocard.│ │VTE on    ││
│ │   156      │ │   12      │ │    3      │ │  Chemo 8 ││
│ │ ↑ 8%      │ │ → MDT     │ │ Critical  │ │  ↓ 12%   ││
│ └────────────┘ └────────────┘ └────────────┘ └──────────┘│
├────────────────────────────────────────────────────────────┤
│ Active Cases by Risk                                        │
│ ┌────────────────────────────────────────────────────────┐│
│ │ MRN-12345 | breast cancer | anthracycline | V.HIGH | [View] │
│ │ MRN-67890 | lung cancer | ICI | MODERATE | [View] │
│ │ MRN-11111 | lymphoma | doxorubicin | HIGH | [View] │
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

## Page 2: Cardio-Onc Case Detail
```
┌────────────────────────────────────────────────────────────┐
│ Case #67890 — Patient ID 67890                              │
├────────────────────────────────────────────────────────────┤
│ Cancer: Breast | Stage II | Therapy: Doxorubicin + Trastuzumab│
│ Baseline EF: 55% | Baseline GLS: -18% | LCA: 250 mg/m²      │
├────────────────────────────────────────────────────────────┤
│ HFA-ICOS Risk: HIGH (Score 7)                              │
│ Recommendation: Cardio-Onc + ACEi + BB + Statin               │
├────────────────────────────────────────────────────────────┤
│ Monitoring Schedule                                         │
│ Echo Q3 months: 2026-09-15, 2026-12-15, 2027-03-15          │
│ Troponin monthly: Next 2026-09-05                            │
│ Oncology visit: Next 2026-09-10                            │
├────────────────────────────────────────────────────────────┤
│ [Adjust Cardioprotection] [Order Echo] [Contact Oncologist]  │
└────────────────────────────────────────────────────────────┘
```

## Page 3: ICI Myocarditis Detection
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️ ICI MYOCARDITIS DETECTED — Critical Alert                │
├────────────────────────────────────────────────────────────┤
│ Patient: 67890 | ICI: Pembrolizumab | Cycle: 6              │
│ Troponin: 0.5 ng/mL (ULN 0.1, ratio 5.0) — SEVERE         │
│ EF: 35% | ECG: QRS widening                                │
├────────────────────────────────────────────────────────────┤
│ ACTION:                                                     │
│ 1. Pause Pembrolizumab immediately                          │
│ 2. Start Methylprednisolone 1g/day IV × 3 days             │
│ 3. ICU admission for monitoring                             │
│ 4. Cardiac MRI for confirmation                             │
│ 5. Notify oncologist for alternative therapy                │
└────────────────────────────────────────────────────────────┘
```

## Page 4: HFA-ICOS Risk Assessment Form
```
┌────────────────────────────────────────────────────────────┐
│ Cardio-Onc Risk Assessment — HFA-ICOS                       │
├────────────────────────────────────────────────────────────┤
│ Patient ID: [_____]  Age: [_____]  Cancer: [Select]         │
│ Baseline EF: [_____]%  Anthracycline Cumulative: [___] mg/m²│
│                                                             │
│ Comorbidities:                                              │
│ ☐ HTN  ☐ DM  ☐ Smoking  ☐ Hyperlipidemia                  │
│                                                             │
│ Risk Factors:                                               │
│ ☐ Prior Cardiotoxicity  ☐ AL Amyloidosis                   │
│                                                             │
│ [Calculate HFA-ICOS Risk]                                  │
│                                                             │
│ Result: Score: 7 | Risk: HIGH                              │
│ Recommendation: Cardio-Onc referral + ACEi + BB + Statin     │
└────────────────────────────────────────────────────────────┘
```
