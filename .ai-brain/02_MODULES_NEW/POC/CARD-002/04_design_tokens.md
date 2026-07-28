<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Design Tokens (Stitch Premium RTL)

## Colors
- Primary: #0066CC (Medical Blue)
- Primary Dark: #004C99
- Primary Light: #4D96FF
- Success: #28A745
- Warning: #FFC107
- Danger: #DC3545 (Critical Red)
- Critical Value: #DC3545
- Abnormal High: #FF6B6B
- Abnormal Low: #4D96FF
- Background: #F8F9FA
- Surface: #FFFFFF
- Text Primary: #212529
- Text Secondary: #6C757D
- Border: #DEE2E6
- Dark Mode: Background #121212, Surface #1E1E1E

## Clinical Status Colors
- STEMI: #DC3545 (pulsing animation)
- Cardiogenic Shock: #DC3545 (high pulse)
- Stable: #28A745
- Watch: #FFC107
- Critical: #DC3545 (full border)

## Typography
- Font Family: 'Inter', 'Tajawal' (AR)
- Heading 1: 32px / 600 weight
- Heading 2: 24px / 600
- Heading 3: 20px / 600
- Body: 16px / 400
- Caption: 14px / 400
- Button: 16px / 500
- Code/Mono: 'JetBrains Mono' 14px

## Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

## Shadows
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.10)
- xl: 0 20px 25px rgba(0,0,0,0.15)

## Component-Specific
- D2B Timer: 64px height, monospace, color-coded (green <60, yellow 60-75, red 75-90, flash 90+)
- DICOM Viewer: full black background, 2px white border, 1px yellow crosshair
- Red Flag Banner: full-width, danger background, 24px height, 18px text
- ACT Display: monospace, 32px, color-coded
- Hemodynamics: live waveform, 200ms refresh

## RTL
- Direction: rtl
- Text align: right
- Mirror: navigation, breadcrumbs, back button
- Icons: flip horizontal if directional (e.g., arrows)

## Accessibility
- WCAG 2.2 AA
- Color contrast: 4.5:1 normal text, 3:1 large text
- Keyboard nav: Tab, Shift+Tab, Enter, Space
- Screen reader: ARIA labels
- Focus ring: 2px solid #0066CC
- Reduce motion: respect prefers-reduced-motion

---
*Section 28 of CARD-002. PM voice. L1 DRAFT.*