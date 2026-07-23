# 04_ux_ui_stitch.md - Pulmonology UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The Respiratory Hub"
High-density visualization of lung function and sleep patterns.

### A. The Pulmonology Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient respiratory history, smoking status, and current O2 therapy.
    - **Center:** Dynamic tabs for [Spirometry | Sleep Study | Bronchoscopy | AI Analysis].
    - **Right:** AI-Brain panel showing "Lung Phenotype" and suggested treatment paths.

## 2. Stitch Component Specifications
- **Charts:** `Stitch-Chart-FlowVolume` for visualizing spirometry loops.
- **Gauges:** `Stitch-Gauge-Linear` for AHI (Sleep Apnea) levels.
- **Timeline:** `Stitch-Clinical-Timeline` for tracking COPD exacerbations.

## 3. User Stories
- **Story:** "As a Pulmonologist, I want to see the AI's interpretation of a sleep study compared to similar patients with the same BMI."
- **Flow:** Load Study $\rightarrow$ AI Analysis $\rightarrow$ Compare Cohorts $\rightarrow$ Finalize CPAP Settings.
