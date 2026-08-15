# CARD-302_ADHF — Wireframes

## Page 1: AHF Dashboard
```
┌────────────────────────────────────────────────────────────┐
│ مركز قصور القلب المتقدم — Advanced Heart Failure         │
├────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│ │GDMT 4-Pillar│ │Active LVAD │ │Transplant  │ │30d Mortal││
│ │   3.5/4    │ │    12      │ │ Waitlist 8 │ │   8%    ││
│ │ ↑ from 3.0 │ │ stable     │ │ 1A: 2 1B: 3│ │ ↓ target││
│ └────────────┘ └────────────┘ └────────────┘ └──────────┘│
├────────────────────────────────────────────────────────────┤
│ Active GDMT Optimization (12 pending)                      │
│ [Patient NYHA III, EF 25] [NO ARNI] → Start ARNI 24/26  │
│ [Patient NYHA III, EF 30] [NO SGLT2i] → Add Dapagliflozin│
│ ...                                                          │
└────────────────────────────────────────────────────────────┘
```

## Page 2: HF Case Detail
```
┌────────────────────────────────────────────────────────────┐
│ Case #67890 — Patient ID 67890                              │
├────────────────────────────────────────────────────────────┤
│ LVEF: 25%   NYHA: III   ACC Stage: C  INTERMACS: 4         │
│ NT-proBNP: 1850 pg/mL   eGFR: 60                            │
├────────────────────────────────────────────────────────────┤
│ GDMT 4-Pillar                                                │
│ ✓ ARNI (Sacubitril/Valsartan 97/103) [Started 6 months ago]│
│ ✓ Bisoprolol 10 mg                                          │
│ ✓ Spironolactone 25 mg                                      │
│ ✓ Dapagliflozin 10 mg                                       │
├────────────────────────────────────────────────────────────┤
│ Recent Admissions (3)                                       │
│ 2026-07-15: 4 days, diuresis 8L, discharged                │
│ 2026-04-20: 5 days, diuresis 7L, discharged                │
│ 2026-01-10: 7 days, intubated, discharged                  │
├────────────────────────────────────────────────────────────┤
│ [Refill Prescription] [Schedule Visit] [Edit GDMT]          │
└────────────────────────────────────────────────────────────┘
```

## Page 3: LVAD Detail
```
┌────────────────────────────────────────────────────────────┐
│ LVAD Patient — HeartMate 3 — ID 55555                       │
├────────────────────────────────────────────────────────────┤
│ Implant Date: 2025-03-15                                     │
│ Indication: Destination Therapy                              │
│ Current Speed: 5400 RPM | Power: 4.5 W | Flow: 4.5 L/min  │
│ MAP Target: 75-85 mmHg | INR Target: 2.0-3.0              │
├────────────────────────────────────────────────────────────┤
│ [Pump Speed Trend Chart]                                    │
│ [Recent Alarms: Power spike 2026-08-10 → resolved]         │
├────────────────────────────────────────────────────────────┤
│ [Driveline Site] [INR Today] [Recent Labs]                  │
└────────────────────────────────────────────────────────────┘
```

## Page 4: Transplant Detail
```
┌────────────────────────────────────────────────────────────┐
│ Heart Transplant — Patient ID 77777                          │
├────────────────────────────────────────────────────────────┤
│ Status: 1A (ICU + ECMO)                                     │
│ Listed on SCOT: 2025-09-01 (180 days)                       │
│ Blood Group: O+, PRA: 5%, HLA-A: 2, 28                     │
├────────────────────────────────────────────────────────────┤
│ Recent Biopsies:                                            │
│ 2026-08-01: Grade 0 (No rejection)                          │
│ 2026-07-15: Grade 1R (Mild)                                  │
│ 2026-07-01: Grade 0                                          │
├────────────────────────────────────────────────────────────┤
│ [Immunosuppression Compliance] [Biopsy Schedule]           │
└────────────────────────────────────────────────────────────┘
```
