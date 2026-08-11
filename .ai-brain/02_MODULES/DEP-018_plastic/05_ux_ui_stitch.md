# UX/UI Stitch Design — Plastic_Burns (DEP-018)

> **UXL:** Ms. Layla Hassan · Generated 2026-08-08

## 1. Wireframe (Main Page)
```
┌──────────────────────────────────────────────────────────────┐
│ [Header: التجميل والحروق | Plastic_Burns] [Lang AR/EN]   │
├──────────────────────────────────────────────────────────────┤
│ SIDEBAR (240px)               │ MAIN AREA                     │
│ ┌─────────────────────────┐  │ ┌───────────────────────────┐  │
│ │ Patient ID Card        │  │ │ Tabs: Overview|Orders|Results|Notes│
│ │ MRN 100045 · 45y · M   │  │ ├───────────────────────────┤  │
│ │ Allergies: ⚠ Penicillin │  │ │ Vitals Panel              │  │
│ └─────────────────────────┘  │ │  HR:72 BP:120/80 SpO2:98 │  │
│ ┌─────────────────────────┐  │ │                           │  │
│ │ Risk Stratifier        │  │ │ Risk: NEWS2=2 LOW        │  │
│ │ Score: 2 (LOW)         │  │ │                           │  │
│ └─────────────────────────┘  │ │ Active Orders: 3          │  │
│                              │ └───────────────────────────┘  │
│ Nav:                         │                                  │
│ - Overview                   │                                  │
│ - Orders (3)                 │                                  │
│ - Results                    │                                  │
│ - Notes                      │                                  │
│ - AI Assistant 🤖            │                                  │
└──────────────────────────────────────────────────────────────�
```

## 2. Components (from Stitch)
- VitalPanel
- AllergyBanner
- RiskStratifier
- OrderCard
- PatientIDCard
- CDSAlertBar
- NotesEditor

## 3. Pages
1. `/station/plastic` — main (2-col)
2. `/station/plastic/orders` — full-width list
3. `/station/plastic/results` — 2-col with chart
4. `/station/plastic/notes` — editor + sign

## 4. RTL/LTR
- Logical CSS: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`
- Direction: `dir=""` on root

## 5. A11y (WCAG 2.1 AA)
- Contrast ≥4.5:1
- Tap target ≥44×44px
- Keyboard nav: Tab/Shift+Tab/Enter/Space
- Screen reader: aria-label, role, aria-live