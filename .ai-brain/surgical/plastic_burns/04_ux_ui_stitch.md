# 04 UX/UI Stitch — Plastic, Reconstructive & Burns Surgery

## 1. Design Tokens
- **Palette**: clean clinical white, soft skin-tone accents, alert red for burns, blue for reconstructive.
- **Typography**: same as Stitch clinical stations.
- **Layout**: 3-column station.

## 2. Components
- `PlasticConsultationForm`: procedure type, consent, photo upload.
- `BurnAssessmentPanel`: body map for TBSA, depth selector, Parkland calculator.
- `WoundTimeline`: stage progression with photos.
- `ImplantLogForm`: product, serial, volume, expiration.
- `PhotoComparison`: before/after gallery with PHI vault links.

## 3. User Stories
- "As a plastic surgeon, I want to document consent photos and compare before/after outcomes."
- "As a burn nurse, I want a body map to calculate TBSA and trigger resuscitation orders."

## 4. Wireframe Logic
- Left: patient list + procedure queue.
- Center: consultation/burn/wound/implant tabs.
- Right: photo gallery + alerts + next review.

## 5. Accessibility
- High-contrast mode, RTL/LTR, touch-friendly body map.
