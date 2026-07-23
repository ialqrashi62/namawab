# 04_ux_ui_stitch.md - Orthopedics UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Musculoskeletal Command Center"
Focus on implant traceability, fracture classification, and range-of-motion tracking.

### A. The Orthopedic Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient surgical history, implant registry, allergy alerts.
    - **Center:** Dynamic tabs for [Joint Replacement | Fracture Log | ROM Scores | AI Analysis].
    - **Right:** AI-Brain panel showing "Implant Failure Risk" and rehab timeline.

## 2. Stitch Component Specifications
- **Joint Alignment Chart:** `Stitch-Chart-Orthopedic` for 3D alignment overlay.
- **Fracture Class Picker:** `Stitch-Form-AOOTA` for AO/OTA classification.
- **ROM Angle Slider:** `Stitch-Range-Clinical` for range-of-motion capture.
- **Implant Data Grid:** `Stitch-Data-Table-Premium` tracking serial/lot numbers.

## 3. User Stories
- **Story:** "As an Orthopedic Surgeon, I want to record implant details and alignment angles so that revision risk is tracked."
- **Flow:** Open Session → Select Joint → Log Implant → Capture Alignment → Save ROM.

## 4. Safety-Gated Interactions
- Implant serial number is mandatory before saving a joint replacement session.
- Alert banner if alignment angle exceeds 3° off target.
- Double-confirm for implant removal or revision.
