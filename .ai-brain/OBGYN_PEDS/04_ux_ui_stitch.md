# 04_ux_ui_stitch.md - OBGYN & Pediatrics UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The Gentle Care Hub"
Soft, intuitive interfaces focusing on longitudinal growth and maternal-fetal bonding.

### A. The OBGYN/Peds Station
- **Layout:** 3-column fluid grid.
    - **Left:** Maternal history, pregnancy week, and fetal growth chart.
    - **Center:** Dynamic tabs for [Antenatal Care | IVF Cycle | NICU Monitor | AI Analysis].
    - **Right:** AI-Brain panel showing "Fetal Development" and similar case outcomes.

## 2. Stitch Component Specifications
- **Growth Charts:** `Stitch-Chart-Growth` for plotting pediatric weight/height against WHO standards.
- **Gauges:** `Stitch-Gauge-Radial` for Fetal Heart Rate (FHR) and Oxygen Saturation.
- **Data Grid:** `Stitch-Data-Table-Premium` for IVF embryo grading.

## 3. User Stories
- **Story:** "As an MFM specialist, I want to upload a 4D scan and see AI-suggested anomalies compared to a global database."
- **Flow:** Upload Scan $\rightarrow$ AI Analysis $\rightarrow$ Compare Cohorts $\rightarrow$ Finalize Diagnosis.
