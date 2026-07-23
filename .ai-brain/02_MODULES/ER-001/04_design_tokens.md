---
module_id: ER-001
section: 05_ux_ui
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Design Tokens (Inherits from medical-ds-v1)

## Color Tokens (Clinical-specific)

### ESI Level Colors
| Level | Color | Hex | Use |
|-------|-------|-----|-----|
| 1 | Critical Red | #DC3545 | Resuscitation, immediate |
| 2 | Warning Red | #FF6B6B | Emergent, high priority |
| 3 | Warning Yellow | #FFC107 | Urgent, medium priority |
| 4 | Success Green | #28A745 | Less urgent, low priority |
| 5 | Neutral Gray | #6C757D | Non-urgent, lowest |

### Vital Signs Status
| Status | Color | Hex | Condition |
|--------|-------|-----|-----------|
| Normal | Green | #28A745 | Within range |
| Abnormal | Yellow | #FFC107 | Outside range but not critical |
| Critical | Red | #DC3545 | Critical value |
| Pending | Gray | #6C757D | Not yet resulted |

### Lab Results
| Status | Color | Hex |
|--------|-------|-----|
| Normal | #28A745 | Green |
| Abnormal high | #FF6B6B | Red |
| Abnormal low | #4D96FF | Blue |
| Critical high | #DC3545 | Dark Red |
| Critical low | #0066CC | Dark Blue |
| Pending | #FFC107 | Yellow |

### Code Status
| Code | Color | Hex |
|------|-------|-----|
| Code Blue (active) | Red | #DC3545 |
| Code STEMI (active) | Orange | #FF6B6B |
| Code Stroke (active) | Yellow | #FFC107 |
| Code Trauma (active) | Dark Orange | #C79100 |
| Code Sepsis (active) | Purple | #9C27B0 |
| Code Resolved | Gray | #6C757D |

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (board title) | Inter (EN) / Noto Sans Arabic (AR) | 30px | 700 | 1.2 |
| H2 (encounter title) | Inter / Noto Sans Arabic | 24px | 600 | 1.2 |
| H3 (section title) | Inter / Noto Sans Arabic | 20px | 600 | 1.3 |
| Body (vitals, labels) | Inter / Noto Sans Arabic | 14-16px | 400-500 | 1.5 |
| Mono (codes, IDs) | JetBrains Mono | 14px | 500 | 1.4 |
| Critical (ESI 1, red flag) | Inter / Noto Sans Arabic | 16px | 700 | 1.4 |

## Spacing (Tailwind)
- Padding: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Margin: same scale
- Gap: 4, 8, 12, 16, 20, 24, 32
- Border radius: 4, 8, 12, 16

## Shadows
- `sm`: 0 1px 2px rgba(0,0,0,0.05) — cards
- `md`: 0 4px 6px rgba(0,0,0,0.07) — encounter cards
- `lg`: 0 10px 15px rgba(0,0,0,0.1) — modals
- `xl`: 0 20px 25px rgba(0,0,0,0.1) — code activation modal

## Animation
- Subtle transitions: 150ms ease-in-out (color, opacity, transform)
- Loading: spinning indicator (not flashy)
- Red flag alert: pulse 1s infinite (critical)
- Code activation: shake + sound
- No motion: respect `prefers-reduced-motion`

## Icons (Material Symbols)
- `+` (new encounter)
- `🔍` (search)
- `▼` (filter)
- `↻` (refresh)
- `⚠` (warning, red flag)
- `✕` (close, cancel)
- `✓` (confirm, sign)
- `💊` (medication)
- `🩺` (procedure)
- `🧪` (lab)
- `📷` (imaging)
- `📞` (consult)
- `🚨` (code activation)
- `📋` (notes)
- `🚑` (discharge)

## Dark Mode
- All colors adjusted for dark mode
- Background: #212529 (dark) vs #FFFFFF (light)
- Text: #F8F9FA (dark) vs #212529 (light)
- ESI color codes: same in both modes (high contrast)
- Tailwind: `dark:` prefix

## Accessibility
- Focus: 2px solid #0066CC outline
- Focus offset: 2px
- High-contrast mode: more vivid colors
- Color-blind safe: use shapes + colors (e.g., ESI level + icon)
- Screen reader: ARIA labels, semantic HTML

## Spacing in ER Board
- Card padding: 16px
- Card gap: 16px
- Sidebar width: 320px
- Top bar height: 64px
- Footer: 40px

## Responsive Breakpoints
- Mobile: <640px (single column)
- Tablet: 640-1024px (2 columns)
- Desktop: >1024px (3 columns: sidebar + main + right sidebar)
- Wide: >1440px (4 columns: nav + sidebar + main + right sidebar)

## Print Styles (for discharge instructions)
- Black on white
- 12pt font
- Generous margins
- No color (grayscale acceptable)
- Page break before signature
- Footer with provider name, license, date

---
*Section 05.d of ER-001. Owner: PM + UX. Inherits from DESIGN_SYSTEM.yaml. L4 validated.*
