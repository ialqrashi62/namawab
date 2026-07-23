# 04 UX/UI Stitch — Oncology Therapeutics & Infusion Services

## 1. Design Tokens
- **Palette**: oncology purple/blue, toxicity alert red, infusion green.
- **Typography**: same as Stitch clinical stations.
- **Layout**: 3-column station.

## 2. Components
- `ChemoOrderForm`: protocol, cycle/day, drugs, doses.
- `DoseCalculator`: BSA, organ function, protocol max.
- `InfusionTimeline`: scheduled and running infusions.
- `ToxicityHeatmap`: CTCAE grades by organ system.
- `ProtocolVerifier`: protocol match and deviation alerts.

## 3. User Stories
- "As an infusion nurse, I want a timeline of today's infusions with pre-medication and reaction alerts."
- "As an oncologist, I want toxicity heatmaps to decide dose modifications."

## 4. Wireframe Logic
- Left: patient list + active cycles.
- Center: order/infusion/toxicity tabs.
- Right: protocol alerts + lab thresholds + next cycle.

## 5. Accessibility
- RTL/LTR, high-contrast toxicity alerts, touch-friendly infusion controls.
