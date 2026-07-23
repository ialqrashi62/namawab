# 04_ux_ui_stitch.md - Cardiology UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The Cardiology Command Center"
The UI must transition from a generic form to a high-density clinical dashboard. Using **Stitch Google** patterns, we implement a "Station" approach.

### A. The Cardiology Station (Main View)
- **Layout:** 3-column fluid grid.
    - **Left (Patient Context):** Quick-view of vitals, current medications, and "Heart Failure Risk" gauge.
    - **Center (Active Workspace):** Dynamic tabs for [ECG Analysis | Cath Lab Report | EP Mapping | Nuclear Imaging].
    - **Right (AI Insights):** The "AI-Brain" panel showing suggested diagnoses and similar patient cohorts.

## 2. Stitch Component Specifications
- **Gauges:** Use `Stitch-Gauge-Radial` for Ejection Fraction (EF%) and Heart Rate.
- **Timeline:** `Stitch-Clinical-Timeline` for tracking interventions (e.g., Stent placement $\rightarrow$ Medication change $\rightarrow$ Follow-up).
- **Data Grid:** `Stitch-Data-Table-Premium` with conditional formatting for critical values (e.g., Troponin levels in red).

## 3. User Stories & Flows
- **Story 1:** "As a Cardiologist, I want to upload an ECG and see AI-suggested anomalies based on similar historical cases."
- **Flow:** Upload $\rightarrow$ Vector Search $\rightarrow$ AI Analysis $\rightarrow$ Doctor Review $\rightarrow$ Digital Signature.
- **Story 2:** "As an Admin, I want to assign a doctor to the Cardiology specialty to grant them access to the Cath Lab module."
- **Flow:** Admin Panel $\rightarrow$ User Management $\rightarrow$ Role Assignment $\rightarrow$ Access Granted.

## 4. Accessibility & i18n
- **RTL Support:** Full mirroring for Arabic interface.
- **Contrast:** High-contrast mode for dark-room environments (Cath Lab/Radiology).
