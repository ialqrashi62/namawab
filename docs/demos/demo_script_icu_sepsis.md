# Demo — ICU + ED Sepsis 1-Hour Bundle (10 min)

> Showcases: NEWS2/qSOFA detection, 1-hour bundle compliance, ICU handover, daily goals.

## Script

### 0. Opening
> "We'll see how NamaMedical helps catch sepsis early on the ward and drives 1-hour
> bundle compliance from detection to ICU admission."

### 1. Ward deterioration (2 min)
- Patient on med-surg ward; nurse posts vitals: BP 95/55, HR 118, T 38.7, RR 28, SpO2 92.
- System computes NEWS2 = 9; qSOFA = 2.
- Alert fires: **"Possible sepsis — apply 1-hour bundle"**.

### 2. Apply bundle (2 min)
- Charge nurse opens patient → "Apply Sepsis 1h bundle".
- 5 items pre-selected: cultures, lactate, fluids, broad-spectrum, ECG.
- CDS warns: penicillin allergy → suggests cefepime instead.
- Nurse signs; doctor approves.

### 3. Bundle countdown (1 min)
- Banner shows 60:00 timer with checklist: each item ticks as completed.
- Cultures sent → lactate result back at 30 min showing 4.2 mmol/L.
- Cefepime hung at 25 min — within target.

### 4. ICU admission (2 min)
- Patient deteriorates; ICU bed allocated.
- Handover SBAR auto-generated from chart.
- ICU MD confirms; admitted with APACHE-II computed.

### 5. ICU daily goals (2 min)
- FAST-HUG-BID checklist on dashboard.
- Vent settings: ARDSnet TV 6 mL/kg PBW; plateau ≤ 30.
- Sedation goal RASS -1 to 0; SAT/SBT today.

### 6. Quality dashboard (1 min)
- Show monthly KPI:
  - 1-hour bundle compliance: 92%
  - Sepsis mortality (risk-adjusted) trending down
  - Time from alert → bundle applied: median 12 min

## Talking points
- "Sepsis is the largest preventable hospital killer; bundle compliance literally saves lives."
- "Our system **enables** the bundle, not replaces clinical judgment."
- "Every alert tunable per facility to reduce fatigue."
