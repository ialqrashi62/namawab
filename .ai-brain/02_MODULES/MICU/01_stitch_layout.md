# MICU — Stitch UI Layout (Material 3)

## Layout E — Timeline for ICU Rounds

```
+--------------------------------------------------+
| [☰] NamaMedical | Tenant: KFSH | Dr. Ali        |
+--------------------------------------------------+
| Patient: Ahmed M. (MRN 12345) | Bed 12 | 65M    |
| Admit: 2026-07-23 14:00 | Dx: Septic shock      |
| APACHE II: 22 | SOFA: 14 | Code: FULL           |
+--------------------------------------------------+
| [Vitals] [Labs] [Meds] [Vent] [Notes] [Rounds]  |
+--------------------------------------------------+
| Timeline:                                        |
| 14:00  Admit, MAP 50, Lactate 6                  |
| 14:15  Blood cx drawn                            |
| 14:30  Pip-tazo 4.5g IV                          |
| 14:45  Norepi 0.1 mcg/kg/min (MAP 65)            |
| 16:00  Lactate 3.2 (down) | UOP 30mL/h          |
+--------------------------------------------------+
| [Critical Alerts]                                |
| ! K+ 6.5 at 18:00 → calcium given                |
+--------------------------------------------------+
| Daily Rounds:                                    |
| Goals: Hemodynamic stability, O2 sat            |
| Plan: Wean norepi, SBT tonight                  |
+--------------------------------------------------+
```

## Components Used
- `<PatientHeader>` (sticky, color-coded by code status)
- `<VitalsChart>` (line chart, 24h)
- `<TimelineEvent>` (chronological, color by event type)
- `<CriticalAlert>` (red, dismissable)
- `<RoundsNote>` (editable, autosave)
- `<ScoreCard>` (APACHE, SOFA, qSOFA, GCS, RASS, CAM-ICU)

## Color Coding
- Critical: red (#DC2626)
- High: orange (#EA580C)
- Medium: yellow (#F59E0B)
- Low: green (#10B981)
- Code DNR: gray (#6B7280)
- Code COMFORT: purple (#7C3AED)
