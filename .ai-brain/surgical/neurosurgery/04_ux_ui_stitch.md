# 04_ux_ui_stitch.md - Neurosurgery UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Neural Command Center"
Focus on ICP trends, GCS evolution, and spinal level precision.

### A. The Neurosurgery Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient neuro history, imaging links, GCS baseline.
    - **Center:** Dynamic tabs for [ICP Monitor | GCS Trend | Spine Stability | AI Analysis].
    - **Right:** AI-Brain panel showing "Neurological Emergency Risk".

## 2. Stitch Component Specifications
- **ICP Waveform:** `Stitch-Chart-Waveform` real-time ICP/CPP display.
- **GCS Trend Chart:** `Stitch-Chart-Line` for GCS over time.
- **Spine Level Picker:** `Stitch-Anatomy-Spine` for segment selection.
- **ASIA Impairment Selector:** `Stitch-Form-ASIA` for spinal cord injury grading.

## 3. User Stories
- **Story:** "As a Neurosurgeon, I want to see ICP and GCS trends together so that deterioration is caught early."
- **Flow:** Open Session → View ICP → Log GCS → Assess Spine Stability → AI Summary.

## 4. Safety-Gated Interactions
- Critical alert if ICP > 20 mmHg or GCS drops ≥ 2 points.
- Wrong-site prevention: spinal level requires second confirmation.
- Doppler/perfusion values mandatory for flap monitoring.
