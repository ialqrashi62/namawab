# 04_ux_ui_stitch.md - Critical Care UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The High-Acuity Dashboard"
Zero-latency, high-contrast interfaces designed for rapid decision-making in high-stress environments.

### A. The ICU/ER Station
- **Layout:** 3-column fluid grid.
    - **Left:** Real-time vitals/waveforms, ESI level, and "Crash Risk" gauge.
    - **Center:** Dynamic tabs for [Triage | ICU Flowsheet | Anesthesia Log | AI Predictions].
    - **Right:** AI-Brain panel showing "Deterioration Alerts" and suggested interventions.

## 2. Stitch Component Specifications
- **Waveforms:** `Stitch-Realtime-Waveform` for ECG/SPO2 streaming.
- **Gauges:** `Stitch-Gauge-Radial` for MAP and Oxygen Saturation.
- **Alerts:** `Stitch-Alert-Critical` (Blinking Red) for life-threatening instability.

## 3. User Stories
- **Story:** "As an ER Doctor, I want to see an AI-predicted risk of sepsis within 5 minutes of triage."
- **Flow:** Triage $\rightarrow$ Vitals Ingestion $\rightarrow$ AI Analysis $\rightarrow$ Sepsis Alert $\rightarrow$ Bundle Initiation.
