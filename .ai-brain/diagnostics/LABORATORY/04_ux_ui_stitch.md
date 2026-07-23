# 04_ux_ui_stitch.md - Laboratory (LIS) UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Lab Command Center"
Focus on TAT, QC compliance, and critical value alerting.

### A. The Lab Station
- **Layout:** 3-column fluid grid.
    - **Left:** Order/specimen worklist with collection status, TAT badges, and priority flags.
    - **Center:** Dynamic tabs for [Specimen Receipt | Analyzer Result | Validation | QC].
    - **Right:** AI-Brain panel showing "Critical Value Alert" and TAT dashboard.

## 2. Stitch Component Specifications
- **Lab Worklist:** `Stitch-Data-Table-Premium` for orders/specimens with status pills.
- **Specimen Tracker:** `Stitch-Timeline-Clinical` for collection → receive → process.
- **Result Entry Form:** `Stitch-Form-Lab` with reference range and unit validation.
- **Critical Value Banner:** `Stitch-Banner-Alert` for panic-value notifications.
- **TAT Dashboard:** `Stitch-Chart-Bar` for turnaround time by test type.

## 3. User Stories
- **Story:** "As a Lab Technologist, I want a worklist with collection status, analyzer interface, and critical value alerts so that I can prioritize STAT orders."
- **Flow:** Open Worklist → Receive Specimen → Enter Results → Validate → Report.

## 4. Safety-Gated Interactions
- Block result release without passing QC for the analyzer/run.
- Critical values trigger automatic physician notification (read-back required).
- Delta check against prior result: flag >2x or >3 SD deviation before validation.
- Reflex testing rules fire automatically (e.g. positive blood culture → ID + sensitivity).
