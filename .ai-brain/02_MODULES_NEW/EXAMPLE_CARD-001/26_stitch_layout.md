# 26 — Stitch Layout (CARD-001)

> Owner: PM/UX · Snippet: snippet:stitch-medical, snippet:stitch-3col · Tier 1

## Primary station: Doctor Cardiology Station

**Layout: B** (Sidebar + main + timeline)

```
┌─────────────┬─────────────────────────────────────┬─────────────┐
│  NAV        │  TOP BAR (search + alert)           │  TIMELINE   │
│  RTL right  │  ────────────────────────────────    │  RTL left   │
│             │                                     │             │
│  Encounter  │  TABS:                              │  Now        │
│  ECG        │  [Encounter] [Orders] [Results]      │  ● 09:15    │
│  Echo       │  [Notes] [Rx] [Disposition]          │  ECG signed │
│  Stress     │                                     │             │
│  Holter     │  ACTIVE WORKSPACE                    │  Today      │
│  Cath       │  ┌─────────────────────────────┐     │  10:30 Echo │
│  Devices    │  │ H&P + ROS + plan            │     │  14:00 Cath │
│  Rehab      │  │                             │     │             │
│  Risk       │  │ Vital signs + meds + labs   │     │  This wk    │
│  Copilot    │  │                             │     │  ...        │
│  Red flag   │  │ CDS alerts                  │     │             │
│  NPHIES     │  │                             │     │  Last 30d   │
│             │  └─────────────────────────────┘     │  ...        │
│  Patient    │                                     │             │
│             │  FOOTER: [Save] [Sign] [Print]       │             │
└─────────────┴─────────────────────────────────────┴─────────────┘
```

**Stitch source:** project 17612445146025313712, search "doctor station cardiology"

## Secondary screens (per sub-dept)

| Sub-dept | Layout | Notes |
|----------|--------|-------|
| ECG viewer | F (wizard) + G (timeline) | Scrollable lead-by-lead |
| Echo viewer | F + G | Side-by-side measurements + cine loop |
| Cath lab | D (triage board) + G | Live case timeline |
| Device clinic | C (tabs) | Pacemaker interrogation charts |
| HF clinic | B | GDMT tracker widget |
| Co-pilot | C (tabs) | Chat + retrieval + citations |
| Red flag | C + alert banner | Critical-color banner full width |
| NPHIES | C (tabs) | Claim form + status board |

## Red flag UI

- **Top banner:** full-width, `nm.c.critical` background, sticky, AR/EN bilingual
- **Icon:** pulsing red ⚠
- **Action buttons:** [Acknowledge] [Activate CODE] [Override with reason]
- **Co-pilot alert:** side banner in co-pilot screen

## RTL handling

- Layout flips horizontally (nav moves to right, timeline to left)
- Stitch component IDs are LTR; `dir="rtl"` triggers automatic mirror
- All icons: bi-directional (arrows, chevrons)
- ECG: V1-V6 read right-to-left, but `V1` label stays on right
- Echocardiography: parasternal long-axis flipped, but anatomical labels (A, P, S, I) unchanged

## Components map (Stitch → namaweb)

| Stitch component | namaweb equivalent |
|------------------|--------------------|
| ds-header-card | `<div class="ds-card">` |
| ds-tab-group | `app.js` TabGroup |
| ds-timeline-vertical | `app.js` TimelineVertical |
| ds-alert-banner | `app.js` AlertBanner |
| ds-data-table | `app.js` DataTable |
| ds-form-wizard | `app.js` FormWizard |
| ds-kpi-card | `app.js` KpiCard |
| ds-risk-score-card | custom RiskScoreCard |
| ds-ecg-leads | custom EcgLeads |
| ds-copilot-chat | `app.js` ChatStream |
| ds-red-flag-banner | custom RedFlagBanner |
