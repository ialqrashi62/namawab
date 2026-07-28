# 29 — Design Tokens (CARD-001)

> Owner: PM/UX · Snippet: snippet:stitch-medical · Tier 1

> Cardiology-specific token overrides. See `nm-stitch-medical-ui/SKILL.md` for full set.

## Cardiology-specific tokens

| Group | Token | Value | Use |
|-------|-------|-------|-----|
| Color | `nm.cardio.critical` | `#D32F2F` | STEMI, dissection, tamponade |
| Color | `nm.cardio.warning` | `#F57C00` | AF, AS, HF decompensation |
| Color | `nm.cardio.urgent` | `#FBC02D` | Atypical chest pain, equivocal ECG |
| Color | `nm.cardio.normal` | `#2E7D32` | Normal ECG, normal echo |
| Color | `nm.cardio.monitor` | `#1976D2` | Telemetry, observation |
| Color | `nm.cardio.leadset` | `#37474F` | ECG lead color |
| Component | `nm.cardio.heart-icon` | `bi-heart-pulse-fill` | Cardiology identifier |
| Component | `nm.cardio.stemi-icon` | `bi-exclamation-octagon-fill` | Red flag STEMI |
| Component | `nm.cardio.aed-icon` | `bi-lightning-charge-fill` | Defibrillator/code |
| Type | `nm.cardio.numeric-size` | 28px | Big numbers (HR, BP) |
| Type | `nm.cardio.numeric-weight` | 700 | Bold numerics |

## ECG-specific tokens

| Token | Value | Use |
|-------|-------|-----|
| `nm.ecg.bg` | `#000000` | ECG background |
| `nm.ecg.grid-major` | `#FF3030` | Major grid line (every 5mm) |
| `nm.ecg.grid-minor` | `#FFC0C0` | Minor grid line (every 1mm) |
| `nm.ecg.trace` | `#00FF00` | ECG waveform |
| `nm.ecg.calibration` | `#FFFF00` | Calibration pulse |
| `nm.ecg.stemi` | `#FF0000` | ST-elevation highlight |

## Echocardiography tokens

| Token | Value | Use |
|-------|-------|-----|
| `nm.echo.bg` | `#0A0A0A` | Echo background |
| `nm.echo.blood` | `#990000` | Doppler blood flow |
| `nm.echo.tissue` | `#FFD700` | Doppler tissue |
| `nm.echo.measure` | `#00FFFF` | Measurement caliper |
| `nm.echo.label` | `#FFFFFF` | Anatomical label |

## HF GDMT visual (radar chart)

```
4 pillars radar:
  - ARNI/ACEi/ARB  (top)
  - Beta-blocker   (right)
  - MRA            (bottom)
  - SGLT2i         (left)
Fill: nm.cardio.urgent (partial) → nm.cardio.normal (complete)
```

## Red flag banner (full-width, sticky)

```css
.nm-cardio-rf-banner {
  position: sticky;
  top: 0;
  z-index: 9999;
  background: var(--nm-cardio-critical);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 18px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: nm-pulse 1.5s infinite;
  direction: rtl;
}

@keyframes nm-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

## LTR/RTL mirror

- All icons: `transform: scaleX(-1)` in RTL for directional (arrows)
- Heart icon: stays the same (anatomically correct)
- ECG leads: V1-V6 still labeled left-to-right; reading order in RTL is right-to-left but clinical convention preserved
- Echo: parasternal long-axis flipped, but labels (A/P/S/I) unchanged
- Risk score charts: numbers stay in their normal orientation

## Reference

- Stitch medical design system: project 17612445146025313712
- Material Design 3: tokens adopted for elevation, motion
- IBM Plex Sans Arabic: primary AR font
- Inter: primary EN font
