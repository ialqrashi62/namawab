# 04_ux_ui_stitch.md - Emergency Department UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "ER Command Center"
Focus on triage urgency, bed visibility, and time-critical decisions.

### A. The ER Station
- **Layout:** 3-column fluid grid.
    - **Left:** Triage queue + bed board (zone-grouped: Resus / Acute / Fast-Track / Obs).
    - **Center:** Dynamic tabs for [Triage | Workup | Treatment | Disposition].
    - **Right:** AI-Brain panel showing waiting-time alerts, ESI review, and disposition prediction.

## 2. Stitch Component Specifications
- **ESI Triage Panel:** `Stitch-Form-ESI` with vitals + chief-complaint picker.
- **ER Bed Board:** `Stitch-Data-Table-Premium` with zone color coding and time-in-bed.
- **Treatment Tracker:** `Stitch-Timeline-Clinical` for procedures and meds given.
- **Disposition Form:** `Stitch-Form-Disposition` with admit/discharge/transfer/OR/DAMA options.
- **Waiting Time Banner:** `Stitch-Banner-Alert` for ESI-based time thresholds.

## 3. User Stories
- **Story:** "As an ER physician, I want a triage board with ESI levels, bed status, and pending dispositions."
- **Flow:** Open Triage → Assign ESI → Assign Bed → Order Workup → Treatment → Disposition.

## 4. Safety-Gated Interactions
- ESI 1 patients trigger immediate resus bay assignment and visual siren.
- Door-to-provider time threshold (10 min for ESI 2) triggers escalation.
- Critical lab/imaging result requires Physician Acknowledgement before disposition.
- DAMA (Discharge Against Medical Advice) requires patient signature capture.
