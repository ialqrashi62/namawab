# OBG-001 — Stitch UI Layout

## Layout D — Split View for L&D

```
+--------------------------------------------------+
| [☰] NamaMedical | Tenant: KFSH | Dr. Aisha       |
+--------------------------------------------------+
| L&D Board                                        |
+--------------------------------------------------+
| ROOM 1: Aisha M. (G2P1)                          |
| 39+2 wks | 4 cm | Cat I FHR | Cervidil          |
| Stage: Active | AROM 1h ago | Epi                |
+--------------------------------------------------+
| ROOM 2: Sara K. (G1P0)                           |
| 40+1 wks | 7 cm | Cat I FHR | Active pushing    |
| Stage: 2nd | 1h pushing                          |
+--------------------------------------------------+
| ROOM 3: Noura A. (G3P2)                          |
| 38+5 wks | SROM 2h ago | 3 cm | Cat I FHR        |
| Stage: Latent | Admit                             |
+--------------------------------------------------+
| [PPH Active] ROOM 4: Reem - EBL 800, 2 uterotonics |
+--------------------------------------------------+
```

## Components
- `<LDRoom>` (room card, color by stage)
- `<FHRMonitor>` (live graph, category I/II/III)
- `<ContractionTimer>` (frequency, duration, intensity)
- `<CervicalExam>` (dilation, effacement, station)
- `<PPHAlert>` (red banner if EBL >500)
- `<NewbornCard>` (Apgar, weight, vitals)

## Color Coding
- Latent labor: yellow
- Active labor: green
- Stage 2: blue
- 3rd stage: orange
- PPH active: red
