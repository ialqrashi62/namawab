# 04_ux_ui_stitch.md - ENT UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "Auditory-Sinus Command Center"
Focus on audiograms, sinus anatomy, and implant mapping.

### A. The ENT Station
- **Layout:** 3-column fluid grid.
    - **Left:** Patient ENT history, audiometry links, allergy alerts.
    - **Center:** Dynamic tabs for [Audiogram | Sinus View | Implant Map | AI Analysis].
    - **Right:** AI-Brain panel showing "Cochlear Implant Candidacy".

## 2. Stitch Component Specifications
- **Audiogram Chart:** `Stitch-Chart-Audiogram` frequency-specific threshold plot.
- **Sinus Level Picker:** `Stitch-Anatomy-Sinus` for FESS navigation.
- **Implant Parameter Slider:** `Stitch-Range-Clinical` for cochlear mapping.
- **Tympanometry Grid:** `Stitch-Data-Table-Premium` for compliance values.

## 3. User Stories
- **Story:** "As an ENT Surgeon, I want to compare pre/post audiograms so that hearing improvement is quantified."
- **Flow:** Open Session → Capture Audiogram → Select Sinus Level → Log Implant → AI Summary.

## 4. Safety-Gated Interactions
- Alert for sudden sensorineural hearing loss (SSNHL) detection.
- Side selection (Left/Right/Bilateral) requires confirmation.
- Cochlear implant serial number mandatory for registry entry.
