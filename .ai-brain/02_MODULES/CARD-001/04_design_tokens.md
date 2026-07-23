# CARD-001 — Design Tokens

## Color Tokens — STEMI
| Token | Hex | Use |
|---|---|---|
| `--card-stemi` | #DC2626 | STEMI alert (red) |
| `--card-acs` | #EA580C | ACS / NSTEMI (orange) |
| `--card-stable` | #10B981 | Stable (green) |

## Color Tokens — Door-to-Balloon
| Token | Hex | Use |
|---|---|---|
| `--dtb-on-target` | #10B981 | <90 min |
| `--dtb-near-target` | #F59E0B | 60-90 min |
| `--dtb-off-target` | #DC2626 | >90 min |

## Color Tokens — Anticoag Risk
| Token | Hex | Use |
|---|---|---|
| `--anticoag-low` | #10B981 | CHA2DS2-VASc 0 |
| `--anticoag-mod` | #F59E0B | CHA2DS2-VASc 1-2 |
| `--anticoag-high` | #DC2626 | CHA2DS2-VASc ≥3 |

## Color Tokens — Rhythm
| Token | Hex | Use |
|---|---|---|
| `--rhythm-sinus` | #10B981 | Sinus (green) |
| `--rhythm-afib` | #F59E0B | AFib (yellow) |
| `--rhythm-vt` | #DC2626 | VT/VF (red) |
| `--rhythm-block` | #EA580C | Heart block (orange) |

## Typography
- **ECG strip:** 24px (large, scannable)
- **Patient header:** 32px / 700
- **BP / HR:** 28px / 600 (prominent)
- **Risk score:** 36px / 700 (large, color-coded)

## Sizing
- **ECG viewer:** full screen
- **12-lead grid:** 5mm = 1mV, 25mm/s
- **Touch target:** 48px (sterile gloves)
- **Code blue button:** 64px (large, prominent)

## Animations
- **STEMI alert:** pulse red, audio
- **Door-to-balloon:** countdown timer
- **ECG:** scroll real-time
- **Arrest:** red screen + audio

## Accessibility
- **WCAG 2.2 AA**
- **Color + icon + text**
- **Audio on/off** (default on for arrests)
- **Sterile environment:** minimal touch

## RTL
- AR translations complete
- Numbers LTR (BP, HR, EF)
- Layout flips naturally
