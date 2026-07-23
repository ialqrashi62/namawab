# PEDS-002 — Design Tokens

## Color Tokens — Gestational Age
| Token | Hex | Use |
|---|---|---|
| `--peds-ga-extreme` | #DC2626 | <28 weeks (red) |
| `--peds-ga-very-preterm` | #EA580C | 28-32 weeks (orange) |
| `--peds-ga-moderate-preterm` | #F59E0B | 32-36 weeks (yellow) |
| `--peds-ga-term` | #10B981 | ≥37 weeks (green) |

## Color Tokens — Weight Status
| Token | Hex | Use |
|---|---|---|
| `--peds-elbw` | #DC2626 | <1000g |
| `--peds-vlbw` | #EA580C | <1500g |
| `--peds-lbw` | #F59E0B | <2500g |
| `--peds-normal` | #10B981 | ≥2500g |

## Color Tokens — Respiratory Support
| Token | Hex | Use |
|---|---|---|
| `--peds-room-air` | #10B981 | Room air |
| `--peds-nc` | #93C5FD | Nasal cannula |
| `--peds-cpap` | #3B82F6 | CPAP |
| `--peds-vent` | #DC2626 | Ventilator |
| `--peds-ecmo` | #7C3AED | ECMO |

## Sizing
- **Vitals font:** 32px / 700 (large, scannable)
- **Weight display:** 36px (large, prominent)
- **Touch target:** 48px (minimal handling)
- **Color contrast:** ≥4.5:1 (clinical setting)

## Animations
- **Minimal:** Preterm infants are sensitive to stimulation
- **No flashy transitions**
- **Critical alerts:** persistent + audible

## Accessibility
- **WCAG 2.2 AA**
- **Color alone:** Not the only indicator
- **Icon + color + text**
- **Sound on/off** (default off for premature infants)
