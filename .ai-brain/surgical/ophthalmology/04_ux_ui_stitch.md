# 04_ux_ui_stitch.md - Ophthalmology UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Ocular Command Center"
Focus on IOL calculation, IOP mapping, and visual acuity trends.

### A. The Ophthalmology Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient eye history, biometry links, allergy alerts.
    - **Center:** Dynamic tabs for [Biometry | IOP Map | Visual Acuity | AI Analysis].
    - **Right:** AI-Brain panel showing "IOL Power Recommendation".

## 2. Stitch Component Specifications
- **Eye Lens Picker:** `Stitch-Anatomy-Eye` for IOL placement visualization.
- **IOP Chart:** `Stitch-Chart-Heatmap` for pressure mapping.
- **Visual Acuity Trend:** `Stitch-Chart-Line` for BCVA/UCVA over time.
- **Biometry Form:** `Stitch-Form-Biometry` for axial length and keratometry.

## 3. User Stories
- **Story:** "As an Eye Surgeon, I want to verify the correct eye and IOL power before surgery."
- **Flow:** Open Session → Enter Biometry → Select IOL → Confirm Eye Side → Save Plan.

## 4. Safety-Gated Interactions
- Correct-eye verification: Left/Right requires dual confirmation.
- Alert if IOP > 30 mmHg or sudden BCVA drop.
- IOL serial number and power mandatory before session save.
