# PEDS-002 — Stitch UI Layout

## Layout B — Incubator View for NICU

```
+--------------------------------------------------+
| [☰] NamaMedical | Tenant: KFSH | Dr. Reem      |
+--------------------------------------------------+
| Incubator 1: Baby A | 28w+4 | 1100g | Day 5    |
| Mom: Aisha M. | Apgar 6/8 | RDS on CPAP        |
+--------------------------------------------------+
| Vitals (last 1h):                                |
| HR 145 | RR 50 | SpO2 94% | Temp 36.8°C         |
+--------------------------------------------------+
| Respiratory: CPAP 5 cmH2O, FiO2 0.30            |
| Surfactant given: Yes, 200 mg/kg @ 1h           |
+--------------------------------------------------+
| Feeds: 24 mL/kg/day breast milk via NG          |
| TPN: 80 mL/kg/day                                |
+--------------------------------------------------+
| Medications:                                     |
| - Ampicillin 50 mg/kg q12h IV                    |
| - Caffeine 5 mg/kg/day PO                         |
+--------------------------------------------------+
| Plans:                                           |
| - Wean CPAP to NC if stable 24h                  |
| - Advance feeds by 1 mL/kg/day                   |
+--------------------------------------------------+
| Parents:                                         |
| - Mom present: Yes (kangaroo 2h)                 |
| - Dad present: Yes                                |
+--------------------------------------------------+
```

## Components
- `<IncubatorCard>` (active warming, color by GA)
- `<VitalsChart>` (continuous monitoring)
- `<RespiratorySupport>` (mode, settings, weaning)
- `<FeedCalculator>` (weight-based, TPN)
- `<MedList>` (weight-based, double-check for high-alert)
- `<FamilyEngagement>` (visits, kangaroo, education)
