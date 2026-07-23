# 04_ux_ui_stitch.md - Urology UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Urological Command Center"
Focus on stone management, PSA trends, and urodynamic analysis.

### A. The Urology Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient urology history, stone imaging links, stent status.
    - **Center:** Dynamic tabs for [Stone Log | PSA Trend | Urodynamics | AI Analysis].
    - **Right:** AI-Brain panel showing "Stone-Free Probability".

## 2. Stitch Component Specifications
- **Stone Location Picker:** `Stitch-Anatomy-Urology` for stone mapping.
- **PSA Trend Line:** `Stitch-Chart-Line` for PSA over time.
- **Urodynamic Waveform:** `Stitch-Chart-Waveform` for flow/pressure curves.
- **Stent Tracker:** `Stitch-Data-Table-Premium` for insertion/removal dates.

## 3. User Stories
- **Story:** "As a Urologist, I want to log stone size, location, and fragmentation result for follow-up planning."
- **Flow:** Open Session → Select Stone Location → Log Fragmentation → Track Stent → AI Summary.

## 4. Safety-Gated Interactions
- Alert if post-op urine output drops below threshold or fever > 38.5°C.
- Stent removal due-date reminder with escalation.
- PSA doubling time calculation triggers oncology referral prompt.
