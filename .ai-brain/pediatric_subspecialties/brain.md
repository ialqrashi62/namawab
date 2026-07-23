# Brain: Pediatric Subspecialties
## Cognitive Core: Ultra-Specialized Clinical Precision (Wave 3)

### 1. Clinical Domain & Scope
- **Focus**: Pediatric Cardiology, Pediatric Nephrology, and Pediatric Neurology.
- **Key Workflows**:
    - **Pediatric Cardiology**: Congenital Heart Disease (CHD) mapping, Pediatric Echo (Z-scores for aortic/pulmonary valves), and Pediatric ECG interpretation.
    - **Pediatric Nephrology**: Pediatric Dialysis (Peritoneal/Hemodialysis), Nephrotic Syndrome tracking, and Pediatric GFR (Schwartz formula).
    - **Pediatric Neurology**: Epilepsy/Seizure mapping, Neuro-developmental scales (Bayley-III), and Pediatric Brain MRI analysis.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AAP (American Academy of Pediatrics).
    - AHA (American Heart Association) - Pediatric Guidelines.
    - IPNA (International Pediatric Nephrology Association).
    - ILAE (International League Against Epilepsy).
- **VectorMine Indexing**:
    - `peds_cardio_zscore_logic`: Mapping valve diameters to age-adjusted Z-scores.
    - `peds_nephro_gfr_formula`: Implementation of the Schwartz formula for GFR.

### 3. Technical Implementation (Backend)
- **Database Tables**: `peds_cardio_logs`, `peds_nephro_logs`, `peds_neuro_logs`.
- **API Endpoints**:
    - `POST /api/peds-sub/cardio`: Log pediatric echo and CHD metrics.
    - `POST /api/peds-sub/nephro`: Log pediatric GFR and dialysis parameters.
    - `POST /api/peds-sub/neuro`: Log seizure frequency and developmental scales.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Pediatric Heart Anatomy Overlay, GFR Trend Chart, Seizure Frequency Heatmap.
- **Components**: `PedsCardioZScoreChart`, `PedsGFRCalculator`, `NeuroDevScalePicker`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Pediatric Emergency" if GFR drops below 15 ml/min/1.73m² or if severe congenital heart defect is detected.
- **Tenant Isolation**: `requireTenantScope` on all peds-sub-logs.
- **Audit**: Hash-chained logs for all pediatric surgical interventions.
