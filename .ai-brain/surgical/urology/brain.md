# Brain: Urology
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Endourology, Urologic Oncology, Pelvic Floor Reconstruction, and Pediatric Urology.
- **Key Workflows**:
    - Prostatectomy (Robotic/Open) & Nerve Sparing Logs.
    - Kidney Stone Management (ESWL, PCNL, RIRS).
    - Bladder Cancer (TURBT) & BCG Therapy Tracking.
    - Urodynamic Study Analysis.
    - Urinary Incontinence & Pelvic Organ Prolapse (POP) Metrics.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AUA (American Urological Association).
    - EAU (European Association of Urology).
    - NCCN (National Comprehensive Cancer Network) - Prostate/Bladder.
- **VectorMine Indexing**:
    - `urology_stone_composition`: Mapping stone type to optimal lithotripsy modality.
    - `prostate_cancer_risk_matrix`: Decision trees for active surveillance vs. surgery.

### 3. Technical Implementation (Backend)
- **Database Tables**: `urology_surgical_logs`, `urology_stone_registry`, `urology_oncology_metrics`.
- **API Endpoints**:
    - `POST /api/urology/log`: Record urologic surgical procedure.
    - `POST /api/urology/stone-log`: Log stone size, location, and fragmentation result.
    - `POST /api/urology/oncology-metrics`: Track PSA levels and tumor grade.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Bladder/Prostate Model, Stone Location Heatmap, PSA Trend Chart.
- **Components**: `StoneLocationPicker`, `PSATrendLine`, `UrodynamicWaveform`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Urologic Emergency" if post-op urine output drops below threshold or high-grade fever occurs.
- **Tenant Isolation**: `requireTenantScope` on all urology-logs.
- **Audit**: Hash-chained logs for all robotic surgical timestamps.
