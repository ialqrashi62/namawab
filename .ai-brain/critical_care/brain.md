# Brain: Critical Care & Emergency (Wave 5)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Intensive Care Unit (ICU), Emergency Department (ED), Shock Management, and Multi-Organ Dysfunction Syndrome (MODS).
- **Key Workflows**:
    - **Hemodynamic Monitoring**: Real-time tracking of MAP, CVP, and Cardiac Output (CO).
    - **Mechanical Ventilation**: Advanced modes (PRVC, APRV) and weaning protocols.
    - **Sepsis Bundle**: 1-hour and 3-hour bundles (Lactate, Antibiotics, Fluid Resuscitation).
    - **Shock Management**: Vasopressor titration (Norepinephrine, Epinephrine) and Inotropic support.
    - **Neurological Critical Care**: ICP monitoring and brain death protocols.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - SCCM (Society of Critical Care Medicine).
    - Surviving Sepsis Campaign (SSC).
    - ATLS (Advanced Trauma Life Support).
    - ERC (European Resuscitation Council).
- **VectorMine Indexing**:
    - `crit_care_sepsis_logic`: Decision trees for fluid vs. vasopressor initiation.
    - `ventilation_weaning_matrix`: Criteria for extubation based on RSBI (Rapid Shallow Breathing Index).

### 3. Technical Implementation (Backend)
- **Database Tables**: `crit_care_hemodynamics`, `crit_care_ventilation_logs`, `sepsis_bundle_tracking`, `shock_titration_logs`.
- **API Endpoints**:
    - `POST /api/critical-care/hemodynamics`: Log MAP, CVP, and CO.
    - `POST /api/critical-care/vent-weaning`: Record RSBI and weaning status.
    - `POST /api/critical-care/sepsis-bundle`: Track bundle compliance.
    - `POST /api/critical-care/shock-titration`: Log vasopressor doses and response.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Real-time Hemodynamic Dashboard, Sepsis Timeline, Ventilation Waveform Overlay.
- **Components**: `HemodynamicChart`, `SepsisBundleChecklist`, `VasopressorSlider`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Hemodynamic Collapse" if MAP $< 60$ mmHg or "Sepsis Crisis" if Lactate $> 4$ mmol/L.
- **Tenant Isolation**: `requireTenantScope` on all crit-care-logs.
- **Audit**: Hash-chained logs for all life-support changes.
