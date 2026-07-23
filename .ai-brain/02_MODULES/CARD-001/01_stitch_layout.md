# CARD-001 — Stitch UI Layout

## Layout A — Cardiology Dashboard

```
+--------------------------------------------------+
| [☰] NamaMedical | Tenant: KFSH | Dr. Ali      |
+--------------------------------------------------+
| Cardiology Board                                 |
+--------------------------------------------------+
| STEMI ALERT! Patient 1234 — Cath Lab Activated  |
| Door-to-Balloon Target: 90 min | Current: 35 min |
+--------------------------------------------------+
| CCU: 8 patients                                   |
+--------------------------------------------------+
| Bed 1: Mr. K. | Post-PCI Day 1 | Stable          |
| Bed 2: Mr. M. | NSTEMI Day 2 | Troponin ↓        |
| Bed 3: Mrs. A. | Acute HF | BiPAP                |
| Bed 4: Mr. S. | AF RVR | On diltiazem drip        |
+--------------------------------------------------+
| Chest Pain Unit: 3 patients                      |
+--------------------------------------------------+
| Chair 1: Mr. H. | HEART 4 | Observation           |
| Chair 2: Mr. T. | HEART 2 | Discharge planned     |
| Chair 3: Mr. R. | HEART 6 | Admit                 |
+--------------------------------------------------+
```

## Components
- `<STEMIAlert>` (red banner, door-to-balloon timer)
- `<CCUBoard>` (cards, color by acuity)
- `<ChestPainTriage>` (HEART score)
- `<ECGViewer>` (12-lead, interpretation)
- `<RiskCalculator>` (TIMI, GRACE, CHA2DS2-VASc)
- `<MedReconciliation>` (anticoag, antiplatelet)
- `<DeviceCheck>` (pacemaker, ICD)
