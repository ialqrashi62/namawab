# 04_ux_ui_stitch.md - Plastic & Burns Surgery UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Reconstructive Command Center"
Focus on burn resuscitation, flap perfusion, and aesthetic symmetry.

### A. The Plastic & Burns Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient plastic/burn history, graft/flap list, allergy alerts.
    - **Center:** Dynamic tabs for [TBSA Calculator | Flap Monitor | Symmetry | Scar Timeline].
    - **Right:** AI-Brain panel showing "Flap Viability Risk".

## 2. Stitch Component Specifications
- **TBSA Selector:** `Stitch-Anatomy-TBSA` for burn surface area mapping.
- **Flap Perfusion Chart:** `Stitch-Chart-Heatmap` for perfusion zones.
- **Symmetry Mapper:** `Stitch-Anatomy-Face` for 3D aesthetic overlay.
- **Burn Resuscitation Calculator:** `Stitch-Calculator-Fluid` for Parkland formula.

## 3. User Stories
- **Story:** "As a Plastic Surgeon, I want to monitor flap perfusion hourly so that salvage is triggered early."
- **Flow:** Open Session → Map TBSA / Calculate Fluids → Log Flap Perfusion → Assess Symmetry → Save.

## 4. Safety-Gated Interactions
- Critical alert if urine output < 0.5 ml/kg/hr or SIRS criteria met.
- Flap perfusion values require timestamp and observer.
- Aesthetic before/after images are encrypted and access-logged.
