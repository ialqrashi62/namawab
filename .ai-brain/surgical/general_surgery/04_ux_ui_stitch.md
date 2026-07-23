# 04_ux_ui_stitch.md - General Surgery UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "The Surgical Command Center"
Focus on high-reliability, low-distraction interfaces for the perioperative phase.

### A. The Surgery Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient surgical history, allergies (Latex/Anesthesia), and pre-op labs.
    - **Center:** Dynamic tabs for [Surgical Checklist | Intra-op Log | Post-op Recovery | AI Analysis].
    - **Right:** AI-Brain panel showing "Surgical Risk" and similar case outcomes.

## 2. Stitch Component Specifications
- **Checklists:** `Stitch-Interactive-Checklist` for the WHO Safety Checklist.
- **Timelines:** `Stitch-Clinical-Timeline` for tracking the surgical journey (Pre-op $\rightarrow$ Op $\rightarrow$ Post-op).
- **Data Grid:** `Stitch-Data-Table-Premium` for tracking surgical implants and sutures.

## 3. User Stories
- **Story:** "As a Surgeon, I want to quickly verify the surgical site and instrument count via a digital checklist before starting the procedure."
- **Flow:** Open Session $\rightarrow$ Complete Checklist $\rightarrow$ Start Procedure $\rightarrow$ Log Outcome.
