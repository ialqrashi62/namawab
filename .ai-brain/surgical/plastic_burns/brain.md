# Brain: Plastic & Burns Surgery
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Reconstructive surgery, Aesthetic surgery, Severe Burn management, and Microsurgery.
- **Key Workflows**:
    - Burn Surface Area (TBSA) Calculation & Fluid Resuscitation.
    - Skin Graft & Flap Monitoring (Perfusion/Viability).
    - Microsurgical Anastomosis Logs (Flow rates, Patency).
    - Aesthetic Symmetry Analysis & Mapping.
    - Scar Management & Laser Therapy Tracking.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - ASPS (American Society of Plastic Surgeons).
    - ISBI (International Society for Burn Injuries).
    - WHO Burn Care Guidelines.
- **VectorMine Indexing**:
    - `burn_resuscitation_logic`: Dynamic fluid calculation based on TBSA and weight (Parkland Formula).
    - `flap_viability_matrix`: Decision trees for salvage vs. revision based on perfusion markers.

### 3. Technical Implementation (Backend)
- **Database Tables**: `plastic_burns_surgical_logs`, `burn_resuscitation_logs`, `flap_monitoring_metrics`.
- **API Endpoints**:
    - `POST /api/plastic-burns/log`: Record reconstructive or aesthetic procedure.
    - `POST /api/plastic-burns/burn-resuscitation`: Log TBSA and fluid intake.
    - `POST /api/plastic-burns/flap-monitor`: Track flap perfusion and viability.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Body Map for TBSA, Flap Perfusion Heatmap, Symmetry Overlay.
- **Components**: `TBSASelector`, `FlapPerfusionChart`, `SymmetryMapper`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Sepsis Warning" if burn patient shows systemic inflammatory response (SIRS) or sudden drop in urine output.
- **Tenant Isolation**: `requireTenantScope` on all plastic-burns-logs.
- **Audit**: Hash-chained logs for all high-risk reconstructive procedures.
