# SURG-001 — Design Tokens

## Color Tokens — Urgency
| Token | Hex | Use |
|---|---|---|
| `--surg-elective` | #10B981 | Elective (green) |
| `--surg-urgent` | #F59E0B | Urgent (yellow) |
| `--surg-emergency` | #DC2626 | Emergency (red) |

## Color Tokens — Wound Class
| Token | Hex | Use |
|---|---|---|
| `--wound-clean` | #10B981 | Clean (1-5%) |
| `--wound-cc` | #F59E0B | Clean-contaminated (2-9%) |
| `--wound-contaminated` | #EA580C | Contaminated (5-15%) |
| `--wound-dirty` | #DC2626 | Dirty (>30%) |

## Color Tokens — Complication (Clavien-Dindo)
| Token | Hex | Grade |
|---|---|---|
| `--cd-1` | #10B981 | I |
| `--cd-2` | #F59E0B | II |
| `--cd-3` | #EA580C | III |
| `--cd-4` | #DC2626 | IV |
| `--cd-5` | #6B7280 | V (death) |

## Typography
- **Patient header:** 32px / 700
- **Procedure name:** 24px / 600
- **Time:** 28px / 700 (mono)
- **Counts:** 36px / 700 (large, important)

## Sizing
- **Procedure card:** min 200px
- **Touch target:** 48px (sterile gloves)
- **OR screen:** 1920x1080 (large display)

## Animations
- **OR transition:** fade
- **Time-out:** red border + audio
- **Complication alert:** pulse

## Accessibility
- **WCAG 2.2 AA**
- **OR lighting consideration:** High contrast
- **Sterile environment:** minimal touch, no hidden interactions
- **Color + icon + text** (color alone not enough)

## RTL
- All AR translations complete
- Layout flips naturally
- Numbers still LTR
