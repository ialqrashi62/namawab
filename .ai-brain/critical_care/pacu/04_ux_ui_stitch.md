# 04_ux_ui_stitch.md - PACU UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Recovery Command Center"
Focus on Aldrete scoring, pain control, and discharge readiness.

### A. The PACU Station
- **Layout:** 3-column fluid grid.
    - **Left:** Incoming patients from OR with countdown since arrival.
    - **Center:** Flowsheet + Aldrete + pain/nausea tabs.
    - **Right:** AI-Brain panel with discharge readiness and PONV risk.

## 2. Stitch Component Specifications
- **Aldrete Score Panel:** `Stitch-Form-Aldrete` with 5-component scoring.
- **PACU Flowsheet:** `Stitch-Timeline-Clinical` with vitals and scores.
- **Discharge Gate:** `Stitch-Interactive-Checklist` enforcing criteria.
- **Pain/Nausea Tracker:** `Stitch-Range-Clinical` with NRS 0-10 slider.

## 3. User Stories
- **Story:** "As a PACU nurse, I want Aldrete scoring every 15 minutes with a clear discharge gate."
- **Flow:** Admit from OR → q15min Aldrete → Pain/Nausea control → Discharge to ward/home.

## 4. Safety-Gated Interactions
- Block discharge unless Aldrete ≥ 9 or anesthesiologist override with reason.
- Severe pain (NRS ≥ 7) or uncontrolled nausea triggers analgesic/antiemetic prompt.
- Re-admission to OR or ICU requires documented handoff.
