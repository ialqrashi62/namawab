# MICU — Design Tokens (Material 3 + Clinical)

## Color Tokens — Severity
| Token | Hex | Use |
|---|---|---|
| `--icu-critical` | #DC2626 | Life-threatening (red) |
| `--icu-high` | #EA580C | High priority (orange) |
| `--icu-medium` | #F59E0B | Medium (yellow) |
| `--icu-low` | #10B981 | Low / stable (green) |
| `--icu-info` | #3B82F6 | Info (blue) |
| `--icu-neutral` | #6B7280 | Neutral (gray) |

## Color Tokens — Code Status
| Token | Hex | Use |
|---|---|---|
| `--code-full` | #10B981 | Full code (green) |
| `--code-dnr` | #6B7280 | DNR (gray) |
| `--code-dni` | #6B7280 | DNI (gray) |
| `--code-and` | #4B5563 | AND (dark gray) |
| `--code-comfort` | #7C3AED | Comfort (purple) |

## Color Tokens — Vitals Status
| Token | Hex | Use |
|---|---|---|
| `--vitals-normal` | #10B981 | Normal range |
| `--vitals-abnormal` | #F59E0B | Mildly abnormal |
| `--vitals-critical` | #DC2626 | Critical |
| `--vitals-missing` | #9CA3AF | No data |

## Typography
- **Font:** Inter (Latin) + Noto Sans Arabic (AR)
- **Hero:** 36px / 700 (patient name)
- **Title:** 24px / 600 (section)
- **Body:** 16px / 400
- **Caption:** 12px / 400 (metadata)
- **Numeric:** Tabular nums (vitals, doses)

## Spacing
- **XS:** 4px
- **S:** 8px
- **M:** 16px
- **L:** 24px
- **XL:** 32px
- **2XL:** 48px

## Elevation (Material 3)
- **0:** Flat (data)
- **1:** Card (vital entry)
- **2:** Raised (timeline event)
- **3:** Modal (alert, code status change)
- **4:** Critical alert (red shadow)

## Sizing
- **Touch target:** ≥48px
- **Button height:** 40px (M3)
- **Input height:** 56px (M3 outlined)
- **Card padding:** 16px
- **Mobile breakpoint:** 600px
- **Tablet breakpoint:** 900px
- **Desktop breakpoint:** 1200px

## Animations
- **Micro:** 100ms (hover, focus)
- **Standard:** 200ms (transitions)
- **Emphasis:** 300ms (alerts, code status change)
- **Reduced motion:** Respect user preference (medical setting)

## Iconography
- **Material Symbols:** Rounded, 24px
- **Critical alerts:** Filled red
- **Clinical icons:** Heart, lung, kidney, brain
- **AR mirrors:** All directional icons

## Accessibility (WCAG 2.2 AA)
- **Contrast ratio:** ≥4.5:1 (text), ≥3:1 (UI)
- **Focus ring:** 2px solid + 2px offset
- **Color alone:** Not the only indicator (icon + text)
- **Keyboard:** All actions accessible
- **Screen reader:** ARIA labels (EN + AR)
- **Touch:** ≥48px, ≥8px spacing
