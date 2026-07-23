# Brain: Pediatrics & NICU (Level III/IV)
## Cognitive Core: Ultra-Specialized Clinical Precision (Wave 3)

### 1. Clinical Domain & Scope
- **Focus**: Neonatal Intensive Care (NICU), General Pediatrics, Developmental-Behavioral Pediatrics, and Pediatric Emergency.
- **Key Workflows**:
    - **NICU Level III/IV**: High-frequency oscillatory ventilation (HFOV), surfactant therapy, neonatal cooling (hypothermia therapy), and TPN management.
    - **Growth Tracking**: WHO/CDC growth charts (Weight, Length, Head Circumference) with Z-score analysis.
    - **Developmental Milestones**: ASQ-3 and Denver II tracking for motor, social, and language development.
    - **Neonatal Transition**: Transition from intrauterine to extrauterine life, including APGAR and initial stabilization.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AAP (American Academy of Pediatrics).
    - RCPCH (Royal College of Paediatrics and Child Health).
    - WHO Child Growth Standards.
    - NALS (Neonatal Acute Care Guidelines).
- **VectorMine Indexing**:
    - `peds_growth_logic`: Mapping biometry to Z-scores and percentiles.
    - `nicu_ventilation_matrix`: Decision trees for HFOV vs. Conventional ventilation based on $\text{FiO}_2$ and $\text{CO}_2$ levels.

### 3. Technical Implementation (Backend)
- **Database Tables**: `peds_growth_logs`, `nicu_ventilation_logs`, `peds_milestone_tracking`, `neonatal_transition_logs`.
- **API Endpoints**:
    - `POST /api/pediatrics/growth-log`: Record biometry and calculate Z-scores.
    - `POST /api/nicu/vent-settings`: Log HFOV/Conventional vent parameters.
    - `POST /api/pediatrics/milestone`: Track developmental progress.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Interactive WHO Growth Curves, NICU Bedside Monitor Overlay, Milestone Progress Map.
- **Components**: `PedsGrowthChart`, `NICUVentSlider`, `MilestoneChecklist`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Neonatal Crisis" if $\text{SpO}_2 < 85\%$ or glucose $< 40$ mg/dL.
- **Tenant Isolation**: `requireTenantScope` on all peds-logs.
- **Audit**: Hash-chained logs for all NICU medication/ventilation changes.
