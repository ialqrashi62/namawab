# OBG-001 — Design Tokens

## Color Tokens — Risk Level
| Token | Hex | Use |
|---|---|---|
| `--obg-low-risk` | #10B981 | Low risk pregnancy (green) |
| `--obg-mod-risk` | #F59E0B | Moderate risk (yellow) |
| `--obg-high-risk` | #DC2626 | High risk (red) |

## Color Tokens — FHR Categories
| Token | Hex | Use |
|---|---|---|
| `--fhr-cat1` | #10B981 | Category I (normal, green) |
| `--fhr-cat2` | #F59E0B | Category II (yellow) |
| `--fhr-cat3` | #DC2626 | Category III (red) |

## Color Tokens — Apgar
| Token | Hex | Use |
|---|---|---|
| `--apgar-good` | #10B981 | 7-10 |
| `--apgar-fair` | #F59E0B | 4-6 |
| `--apgar-poor` | #DC2626 | 0-3 |

## Color Tokens — Stages of Labor
| Token | Hex | Use |
|---|---|---|
| `--labor-latent` | #93C5FD | Latent (light blue) |
| `--labor-active` | #10B981 | Active (green) |
| `--labor-2nd` | #3B82F6 | 2nd stage (blue) |
| `--labor-3rd` | #F59E0B | 3rd stage (yellow) |
| `--labor-pph` | #DC2626 | PPH (red) |

## Typography
- **Patient header:** 32px / 700
- **GA (weeks+days):** 24px / 600 (prominent)
- **BP:** 20px / 600 (numeric, tabular)
- **Apgar:** 36px / 700 (large, color-coded)

## Sizing
- **L&D room card:** min 200px height
- **FHR chart:** full width
- **Apgar circle:** 80px diameter

## Animations
- **PPH alert:** pulse red, 1s interval
- **Stage transition:** smooth color change
- **FHR graph:** smooth scrolling

## Accessibility
- **WCAG 2.2 AA:** Contrast ≥4.5:1
- **Critical alerts:** Icon + color + text
- **Touch targets:** ≥48px (delivery room may be sterile)
- **Color alone:** Not the only indicator

## RTL
- All numbers still LTR (BP, FHR, gestational age)
- AR translations complete
- Layout flips naturally
