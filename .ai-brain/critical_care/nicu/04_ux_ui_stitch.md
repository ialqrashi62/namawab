# 04_ux_ui_stitch.md - NICU UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Neonatal Command Center"
Focus on APGAR, incubator monitoring, growth tracking, and parent-infant linkage.

### A. The NICU Station
- **Layout:** 3-column fluid grid.
    - **Left:** Incubator list with neonate details and mother-baby link.
    - **Center:** Bedside monitor + tabs for [Vitals | TPN | Growth | APGAR].
    - **Right:** AI-Brain panel with sepsis early warning and growth forecast.

## 2. Stitch Component Specifications
- **NICU Bedside Monitor:** `Stitch-Chart-Waveform-NICU` for HR / SpO2 / RR / Temp.
- **APGAR Panel:** `Stitch-Form-APGAR` with 1-min and 5-min scoring.
- **Growth Chart:** `Stitch-Chart-Growth` for weight / length / head circumference.
- **Mother-Baby Link:** `Stitch-Card-Link` with verification QR.
- **TPN Calculator:** `Stitch-Calculator-TPN` for daily composition.

## 3. User Stories
- **Story:** "As a neonatologist, I want APGAR and NICU vitals in one view with alerts for deterioration."
- **Flow:** Delivery → APGAR → Stabilization → NICU Admit → Monitor → TPN → Growth → Discharge.

## 4. Safety-Gated Interactions
- Parent-infant identity match must be verified at admission and before any procedure.
- SpO2 < 85% or glucose < 40 mg/dL triggers critical alert.
- Newborn screening (hearing, metabolic) must be completed before discharge.
- TPN changes require pharmacy sign-off.
