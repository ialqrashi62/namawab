# 04_ux_ui_stitch.md - Nephrology UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The Renal Care Hub"
Focus on longitudinal tracking of kidney function and dialysis efficiency.

### A. The Nephrology Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient renal history, current GFR stage, and dialysis schedule.
    - **Center:** Dynamic tabs for [Dialysis Session | Transplant Follow-up | Biopsy Analysis | AI Insights].
    - **Right:** AI-Brain panel showing "GFR Trend Prediction" and similar patient cohorts.

## 2. Stitch Component Specifications
- **Trend Charts:** `Stitch-Chart-Line` for tracking Creatinine and GFR over months.
- **Gauges:** `Stitch-Gauge-Radial` for Kt/V adequacy (Green/Yellow/Red zones).
- **Data Grid:** `Stitch-Data-Table-Premium` for dialysis session logs.

## 3. User Stories
- **Story:** "As a Nephrologist, I want to see the AI's prediction of GFR decline over the next 6 months based on similar patients."
- **Flow:** Load Patient $\rightarrow$ AI Trend Analysis $\rightarrow$ Compare Cohorts $\rightarrow$ Adjust Treatment Plan.
