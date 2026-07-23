# 04_ux_ui_stitch.md - Functional Tests UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Physiological Command Center"
Focus on waveform quality, auto-interpretation, and stress-test safety.

### A. The Functional Tests Station
- **Layout:** List+Drawer pattern.
    - **Left:** Study queue (ECG / EEG / PFT / Endoscopy) with patient prep and status.
    - **Center:** Tabs for acquisition, analysis, and structured report.
    - **Right (Drawer):** Waveform viewer + interpretation fields + comparison with prior studies.

## 2. Stitch Component Specifications
- **ECG Waveform:** `Stitch-Chart-Waveform` for 12-lead display with interval measurements.
- **EEG Waveform:** `Stitch-Chart-Waveform-Multi` for multi-channel montage.
- **PFT Flow-Volume:** `Stitch-Chart-FlowVolume` for spirometry loop with FEV1/FVC.
- **Endoscopy Report Form:** `Stitch-Form-Endoscopy` with image thumbnails and biopsy linkage.
- **Study Queue:** `Stitch-Data-Table-Premium` with priority and prep-status filters.

## 3. User Stories
- **Story:** "As a Pulmonologist, I want PFT results with automatic FEV1/FVC interpretation and trend comparison."
- **Flow:** Open Study Queue → Select Patient → Capture/Upload Waveform → Auto-Interpret → Physician Sign-off.

## 4. Safety-Gated Interactions
- Stress test: cardiac clearance and crash cart readiness verified before start.
- Endoscopy: fasting status and anticoagulation check required.
- Critical ECG findings (STEMI, severe arrhythmia) trigger immediate physician notification.
- Biopsy specimens must be linked to pathology order at collection time.
