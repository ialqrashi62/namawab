# Digital Assets — Cardiology

> **Owner:** PM/UX
> **Date:** 2026-07-22

---

## Icons (SVG, 24x24)

| Icon | Name | Use |
|---|---|---|
| ❤️ | `icon-heart.svg` | Cardiology tab, header |
| 🫀 | `icon-cardiac-detail.svg` | Procedure details |
| 💉 | `icon-injection.svg` | Medication orders |
| 💊 | `icon-pill.svg` | Anticoagulation |
| 📈 | `icon-trend-up.svg` | Improvement (BP down) |
| 📉 | `icon-trend-down.svg` | Deterioration |
| ⚠️ | `icon-warning.svg` | Red flag alerts |
| 🆘 | `icon-stemi.svg` | STEMI activation (red, animated) |
| 🔬 | `icon-lab.svg` | Lab results |
| 📋 | `icon-clipboard.svg` | Procedures |

## Fonts

- **Primary AR:** IBM Plex Sans Arabic
- **Primary EN:** Inter
- **Mono:** IBM Plex Mono
- **Numeric:** Inter (tabular nums for vitals/labs)

## Color Tokens (cardiac theme)

```css
:root {
  --cardio-primary: #DC2626;       /* red-600 */
  --cardio-primary-dark: #991B1B;  /* red-800 */
  --cardio-primary-light: #FEF2F2; /* red-50 */
  --cardio-critical: #7F1D1D;      /* red-900 (STEMI) */
  --cardio-warning: #F59E0B;       /* amber-500 */
  --cardio-success: #10B981;       /* emerald-500 */
  --cardio-bg: #FEF2F2;            /* light red bg */
}
```

## Illustrations

- **Empty state:** Friendly heart with stethoscope (CC0, unDraw)
- **Loading:** ECG waveform animation (CSS keyframe)
- **Error:** Sad heart with "Please try again"
- **Success:** Heart with checkmark

## Animation

- **STEMI activation:** pulsing red border (CSS animation, prefers-reduced-motion respected)
- **ECG rhythm strip:** scrolling left-to-right (CSS animation)
- **Loading:** skeleton pulse

## Photo Library (when needed)

- Stock photos of:
  - Modern cath lab (no patient identifiers)
  - Cardiology team (with consent)
  - Echo machine
  - Heart anatomy diagram
- Source: Pexels/Unsplash CC0 OR custom photoshoot with consent

## File Locations

- `/public/assets/icons/cardio/*.svg`
- `/public/assets/illustrations/cardio/*.svg`
- `/public/assets/photos/cardio/*.jpg`

---

End of digital assets.
