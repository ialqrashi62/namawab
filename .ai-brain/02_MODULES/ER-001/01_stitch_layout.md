---
module_id: ER-001
section: 05_ux_ui
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 UX/UI — Stitch Layout E (Timeline)

## Layout: E — Timeline-based (ED board)

### Wireframe

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Top Bar                                                                    │
│  [ER Board]  [Active: 12]  [Waiting: 8]  [Critical: 2]      [User: Dr. K] │
├──────────┬─────────────────────────────────────────────────────┬───────────┤
│          │                                                     │           │
│  LEFT    │              CENTER                                  │  RIGHT    │
│  Sidebar │              (Active Encounters)                     │  Sidebar  │
│          │                                                     │           │
│  Search  │   ┌─────────────────────────────────────────────┐   │  Patient  │
│  [_____] │   │ Encounter #12345 — ESI 2 — Chest Pain     │   │  Summary  │
│          │   │ MRN: ****1234 | 58M | Arrived 14:32         │   │  ───────  │
│  Filter  │   ├─────────────────────────────────────────────┤   │  Name:    │
│  ☑ ESI 1 │   │ Timeline:                                    │   │  Patient  │
│  ☑ ESI 2 │   │ 14:32  Arrival                                │   │  (encrypted)│
│  ☐ ESI 3 │   │ 14:35  Triage ESI 2 (AI 0.92, RN confirm)    │   │           │
│  ☐ ESI 4 │   │ 14:42  Provider first seen                    │   │  Age: 58  │
│  ☐ ESI 5 │   │ 14:43  Vitals: BP 145/90, HR 88, SpO2 96%    │   │  Sex: M   │
│          │   │ 14:45  ECG: NSR, no STEMI                     │   │  Allergies│
│  Sort:   │   │ 14:48  Troponin pending                       │   │  PCN (rash)│
│  [ESI ▼] │   │ 14:50  Aspirin 325mg PO given (no allergy)   │   │           │
│          │   │ 15:00  Troponin 0.08 (mild elevation)         │   │  PMH:     │
│  Active  │   │ 15:05  Cardiology consult requested           │   │  HTN      │
│  Count:  │   │ 15:15  Cardio responded, admit CCU            │   │  T2DM     │
│   12     │   │ 15:20  Disposition: Admit CCU                  │   │  CKD-3    │
│          │   │                                              │   │           │
│  [+] New │   │ [Admit] [Discharge] [Transfer] [AMA]          │   │  Meds:    │
│  Encounter│  │                                              │   │  ASA 81   │
│          │   │ [Critical Findings: 0] [Red Flags: 0]         │   │  Metoprolol│
│          │   │ [Allergy Alerts: 0]                          │   │  Atorvastatin│
│          │   └─────────────────────────────────────────────┘   │           │
│          │                                                     │  Vitals   │
│          │   ┌─────────────────────────────────────────────┐   │  ───────  │
│          │   │ Encounter #12346 — ESI 3 — Abdominal Pain   │   │  BP: 145/90│
│          │   │ MRN: ****5678 | 35F | Arrived 15:10         │   │  HR: 88   │
│          │   │ ...                                          │   │  RR: 18   │
│          │   └─────────────────────────────────────────────┘   │  SpO2: 96%│
│          │                                                     │           │
│          │                                                     │  Red Flags│
│          │                                                     │  ───────  │
│          │                                                     │  None     │
│          │                                                     │           │
│          │                                                     │  AI Sugges│
│          │                                                     │  ───────  │
│          │                                                     │  Add ECG? │
│          │                                                     │  D-dimer?│
│          │                                                     │           │
└──────────┴─────────────────────────────────────────────────────┴───────────┘
```

## Components Used (Stitch)
- `card` (encounter card)
- `timeline` (events)
- `badge` (ESI level color-coded)
- `alert` (red flags, allergies)
- `button` (admit, discharge, etc.)
- `patient_header` (sticky top of right sidebar)
- `vital_signs_display` (color-coded, trend arrow)
- `chat_bubble` (AI suggestions)

## Color Coding (ESI Level)
| ESI | Color | Hex | Priority |
|-----|-------|-----|----------|
| 1 | Critical Red | #DC3545 | Highest |
| 2 | Warning Orange | #FF6B6B | High |
| 3 | Info Yellow | #FFC107 | Medium |
| 4 | Success Green | #28A745 | Low |
| 5 | Neutral Gray | #6C757D | Lowest |

## Mobile Layout
```
┌──────────────────────┐
│ ER Board  [User ▼]  │
├──────────────────────┤
│ Active: 12 Waiting:8│
├──────────────────────┤
│ [Search + Filter]   │
├──────────────────────┤
│ ╔════════════════╗  │
│ ║ ESI 2  CP      ║  │
│ ║ MRN ****1234   ║  │
│ ║ 58M  14:32     ║  │
│ ║ [Open]         ║  │
│ ╚════════════════╝  │
│                      │
│ ╔════════════════╗  │
│ ║ ESI 3  Abd Pain║  │
│ ║ MRN ****5678   ║  │
│ ║ 35F  15:10     ║  │
│ ║ [Open]         ║  │
│ ╚════════════════╝  │
│                      │
│ [... more cards ...]│
└──────────────────────┘

Swipe up to open encounter → full timeline view
Swipe right to mark as critical
Long press → disposition menu
```

## Interaction Patterns
- **Auto-refresh:** every 30 seconds (configurable)
- **Sound alerts:** on red flag detection, code activation
- **Notifications:** on critical lab result, code team response
- **Drag-and-drop:** encounter cards (e.g., move to different zone)
- **Keyboard shortcuts:**
  - `N` = new triage
  - `R` = reassign
  - `D` = disposition
  - `Esc` = close detail view
  - `↑/↓` = navigate encounters

## Accessibility (WCAG 2.2 AA)
- Color contrast: 4.5:1 minimum
- Keyboard navigation: all functions
- Screen reader: ARIA labels, semantic HTML
- Focus indicators: visible 2px outline
- Text resize: 200% without loss
- Language: html `lang="ar"` for Arabic UI
- RTL: full support

## Bilingual (AR/EN)
- All text via i18n keys: `er.board.title`, `er.encounter.esi_level`, etc.
- en.json + ar.json
- RTL/LTR automatic based on user preference
- Number formats: 1,234.56 (EN) / ١٬٢٣٤٫٥٦ (AR)
- Date formats: MM/DD/YYYY (EN) / DD/MM/YYYY (AR)

## 3 Personas

### 1. Emergency Physician (MD)
- View: All encounters in zone
- Actions: Triage review, treatment orders, disposition, consults
- Notifications: Critical labs, red flags, code activations
- Mobile-friendly: yes (use on the move)

### 2. Triage RN
- View: New arrivals, ESI 1-2 priority
- Actions: Triage assessment, vitals, red flag acknowledge
- Notifications: New arrival, ambulance inbound
- Mobile-friendly: yes

### 3. Charge Nurse / Unit Coordinator
- View: All zones, all encounters
- Actions: Zone assignment, staffing, code activation, transfer coordination
- Notifications: High volume, long waits, bed availability
- Mobile-friendly: yes (overview role)

## State Management
- Global: WebSocket connection for real-time updates
- Local: per-encounter state in React (or vanilla JS with module pattern)
- Cache: most recent 100 encounters (for quick back-navigation)
- Persist: server-side, multi-tenant

## Stitch Import
```yaml
stitch_google:
  layout: E
  component_library: medical-ds-v1
  design_tokens: .ai-brain/05_SHARED/DESIGN_SYSTEM.yaml
  output: namaweb/public/stitch/er.html
  react: namaweb/public/js/er-station.js
  tailwind: enabled
  i18n: en + ar
  a11y: WCAG 2.2 AA
```

---
*Section 05.a of ER-001. Owner: PM. L4 validated.*
