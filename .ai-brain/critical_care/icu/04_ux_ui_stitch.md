# 04_ux_ui_stitch.md - ICU UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "ICU Command Center"
Focus on continuous monitoring, sepsis bundle compliance, and daily goals.

### A. The ICU Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient list + bed board (with severity color).
    - **Center:** Bedside monitor + tabs for [Vitals Waveform | Ventilator | Labs | Daily Goals].
    - **Right:** AI-Brain panel showing sepsis alerts, RSBI, and bundle compliance.

## 2. Stitch Component Specifications
- **ICU Bedside Monitor:** `Stitch-Chart-Waveform-Multi` for ECG / ART / SpO2 / RR.
- **Ventilator Panel:** `Stitch-Form-Ventilator` with mode, PEEP, FiO2, tidal volume, RSBI.
- **Sepsis Bundle Checklist:** `Stitch-Interactive-Checklist` with 1-hour and 3-hour elements.
- **Daily Goals Card:** `Stitch-Card-Goals` with pain, sedation, mobility, family communication.
- **SOFA Trend:** `Stitch-Chart-Line` for SOFA score over time.

## 3. User Stories
- **Story:** "As an intensivist, I want a bedside monitor with waveforms, ventilator settings, and sepsis bundle status."
- **Flow:** Open Patient → Review Vitals → Check Sepsis Bundle → Daily Goals → Update Plan.

## 4. Safety-Gated Interactions
- MAP < 60 mmHg or lactate > 4 mmol/L triggers critical alert.
- Sepsis bundle 1-hour elements must complete within 60 min of trigger.
- RSBI calculated automatically; readiness prompt when < 105.
- VAP/CLABSI prevention bundles auto-validated against orders.
