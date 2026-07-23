# MICU — Wireframes (10 Screens)

## Screen 1: ICU Board
- All active admissions
- Columns: Bed, Patient, Admit Dx, APACHE, SOFA, Code, MD, Nurse, Vent
- Sort: by SOFA desc (sickest first)
- Color: red (high score), green (low score)

## Screen 2: Patient Header
- Patient name, MRN, age, sex
- Admit Dx, time, APACHE, SOFA
- Code status (large badge)
- Allergies banner
- Isolation indicator
- Quick actions: Vitals, Meds, Labs, Rounds

## Screen 3: Vitals Entry (Nurse)
- Heart rate, BP, MAP, RR, SpO2, Temp, GCS, RASS
- UOP (since last entry)
- Single tap fields
- Save button
- Auto-trigger AI early warning

## Screen 4: Vitals Chart (24h)
- Line chart: HR, MAP, SpO2
- X axis: time (now -24h)
- Threshold lines
- Hover: numeric value

## Screen 5: Lab Results
- Tabular: time, test, value, unit, flag (H/L/C)
- Critical values: red background
- Action button: "Acknowledge" (with timestamp)
- Auto-callback if critical

## Screen 6: Ventilator
- Current mode, settings (rate, Vt, PEEP, FiO2)
- Compliance, plateau, peak
- ABG: pH, pO2, pCO2, P/F ratio
- Trend chart
- Weaning readiness badge

## Screen 7: Vasoactive Drips
- Drug, dose, start time
- Titration history (last 12h)
- Tap to titrate (attending only)
- Wean order (with safety check)

## Screen 8: Code Status
- Current status
- Family meeting toggle
- Documentation
- History timeline
- Advance directive attachment

## Screen 9: Daily Rounds
- Problem list (numbered)
- Plan by problem
- Goals for today
- Attendees (multi-select)
- Family communicated toggle
- Save → sign

## Screen 10: Sepsis Bundle Tracker
- Hour-1 timer
- 5 steps: lactate, cultures, ABX, fluids, vasopressors
- Status per step (done / pending / delayed)
- Compliance badge (COMPLIANT / DELAYED / MISSED)
- Alert if delayed
