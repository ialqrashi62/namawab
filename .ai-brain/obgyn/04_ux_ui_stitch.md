# 04 UX/UI Stitch — Obstetrics & Gynecology

## 1. Design Tokens
- **Palette**: maternal care pink/blue accents, alert red for high-risk, calm neutrals.
- **Typography**: same as Stitch clinical stations.
- **Layout**: 3-column station.

## 2. Components
- `PregnancyTimeline`: gestational age, EDD, visit history.
- `PartogramChart`: cervical dilation and fetal station over time.
- `APGARPanel`: 1- and 5-minute scoring.
- `AntenatalVisitForm`: risk flags, vitals, fetal status.
- `DeliverySummary`: mode, complications, newborn link.

## 3. User Stories
- "As a midwife, I want a Partogram that alerts me when labor progression stalls."
- "As an obstetrician, I want high-risk pregnancy flags visible at every visit."

## 4. Wireframe Logic
- Left: pregnant patient list + risk filters.
- Center: pregnancy tabs (antenatal/partogram/delivery/postpartum).
- Right: alerts + next visit + APGAR + newborn link.

## 5. Accessibility
- RTL/LTR, high-contrast alerts, touch-friendly Partogram.
