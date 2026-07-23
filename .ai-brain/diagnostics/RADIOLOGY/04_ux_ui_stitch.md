# 04_ux_ui_stitch.md - Radiology (RIS/PACS) UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Imaging Command Center"
Focus on ALARA radiation safety, critical finding communication, and PACS-first workflow.

### A. The Radiology Station
- **Layout:** 3-column fluid grid.
    - **Left:** Worklist with priors, schedule, and modality tags.
    - **Center:** PACS viewer + report editor (split view, tabs).
    - **Right:** AI-Brain panel showing "Critical Finding Alert" and radiologist TAT.

## 2. Stitch Component Specifications
- **Radiology Worklist:** `Stitch-Data-Table-Premium` with modality/status filters.
- **Study Scheduler:** `Stitch-Calendar-Clinical` for modality slot booking.
- **PACS Viewer:** `Stitch-Image-DICOM` with window/level and prior comparison.
- **Report Editor:** `Stitch-Form-RadLex` with structured templates.
- **Critical Finding Banner:** `Stitch-Banner-Alert` for non-ambiguous communication log.

## 3. User Stories
- **Story:** "As a Radiologist, I want a worklist with priors, a PACS viewer, and a structured report editor in one screen so that I can finalize reports efficiently."
- **Flow:** Open Worklist → Load Study in PACS → Compare Priors → Draft Report → Critical Finding (if any) → Finalize.

## 4. Safety-Gated Interactions
- Contrast allergy check mandatory before CT/MRI with contrast.
- Radiation dose (DAP/CTDI) must be recorded for CT/fluoroscopy (ALARA).
- Critical findings require documented read-back with ordering physician name + time.
- AI-detected lesions must be confirmed by a board-certified radiologist before report finalization.
