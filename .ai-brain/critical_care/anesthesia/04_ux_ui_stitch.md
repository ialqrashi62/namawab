# 04_ux_ui_stitch.md - Anesthesia UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Perioperative Command Center"
Focus on ASA classification, airway risk, and time-based intra-op charting.

### A. The Anesthesia Station
- **Layout:** 3-column fluid grid.
    - **Left:** OR schedule + active case list.
    - **Center:** Tabs for [Pre-Op | Intra-Op Chart | PACU Handoff].
    - **Right:** AI-Brain panel showing airway risk and drug-interaction alerts.

## 2. Stitch Component Specifications
- **Anesthesia Timeline:** `Stitch-Timeline-Clinical` with vitals every 5 min.
- **ASA Picker:** `Stitch-Form-ASA` with class I-VI.
- **Mallampati Selector:** `Stitch-Form-Airway` with image-guided selection.
- **Drug Dose Alert:** `Stitch-Banner-Alert` for threshold breaches.
- **PACU Handoff Card:** `Stitch-Card-Handoff` with SBAR structure.

## 3. User Stories
- **Story:** "As an anesthesiologist, I want a time-based anesthesia record with vitals every 5 minutes."
- **Flow:** Open OR → Pre-Op Assessment → Induction → Chart Vitals → Administer Drugs → Emergence → PACU Handoff.

## 4. Safety-Gated Interactions
- Block anesthesia start until consent and ASA are documented.
- Drug dose alerts fire when above weight-based thresholds.
- Vital trend anomalies trigger immediate notification.
- PACU handoff is mandatory before closing the case.
