# 04_ux_ui_stitch.md - Cardiothoracic UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Cardiac Command Center"
Focus on bypass/clamp timing, hemodynamic waveforms, and graft patency.

### A. The Cardiothoracic Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient cardiac history, echo links, anticoagulation status.
    - **Center:** Dynamic tabs for [Bypass Timer | Hemodynamics | Graft Registry | AI Analysis].
    - **Right:** AI-Brain panel showing "Ischemia-Reperfusion Risk".

## 2. Stitch Component Specifications
- **Bypass Timer:** `Stitch-Timer-Critical` for CPB and cross-clamp countdown.
- **Hemodynamic Waveform:** `Stitch-Chart-Waveform` for MAP/CO/SpO2.
- **Graft Visualizer:** `Stitch-Anatomy-Vascular` for graft location mapping.
- **Patency Checklist:** `Stitch-Interactive-Checklist` for distal runoff verification.

## 3. User Stories
- **Story:** "As a Cardiac Surgeon, I want a high-precision bypass timer so that myocardial ischemia is minimized."
- **Flow:** Open Session → Start Bypass Timer → Log Hemodynamics → Record Grafts → AI Risk Report.

## 4. Safety-Gated Interactions
- Alert if cross-clamp time exceeds 60 minutes.
- Graft entry requires material, diameter, and anastomosis site.
- Hemodynamic critical values trigger automatic escalation notification.
