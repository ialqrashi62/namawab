# Brain: Plastic, Reconstructive & Burns Surgery
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Reconstructive microsurgery, aesthetic surgery, severe burn management, cranio-maxillofacial trauma, and hand surgery.
- **Key Workflows**:
    - Burn Surface Area (TBSA) Calculation & Fluid Resuscitation (Parkland / Modified Brooke).
    - Skin Graft & Flap Monitoring (Perfusion / Viability / Doppler).
    - Microsurgical Anastomosis Logs (Flow rates, Patency, Diameter).
    - Aesthetic Symmetry Analysis & 3D Outcome Mapping.
    - Scar Management, Laser Therapy & Contracture Release Tracking.
    - Cleft Lip/Palate & Craniofacial Reconstruction Pathways.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - ASPS (American Society of Plastic Surgeons).
    - ISBI (International Society for Burn Injuries).
    - WHO Burn Care Guidelines.
    - AAST (American Association for the Surgery of Trauma) — facial trauma.
- **VectorMine Indexing**:
    - `burn_resuscitation_logic`: Dynamic fluid calculation based on TBSA, weight, and inhalation injury.
    - `flap_viability_matrix`: Decision trees for salvage vs. revision based on perfusion markers.
    - `aesthetic_symmetry_index`: 3D facial landmark embeddings for outcome comparison.

### 3. Technical Implementation (Backend)
- **Database Tables**: `plastic_burns_surgical_logs`, `burn_resuscitation_logs`, `flap_monitoring_metrics`, `aesthetic_sessions`.
- **API Endpoints**:
    - `POST /api/plastic-burns/log`: Record reconstructive or aesthetic procedure.
    - `POST /api/plastic-burns/burn-resuscitation`: Log TBSA and fluid intake.
    - `POST /api/plastic-burns/flap-monitor`: Track flap perfusion and viability.
    - `POST /api/plastic-burns/symmetry`: Trigger AI facial symmetry analysis.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Body Map for TBSA, Flap Perfusion Heatmap, Symmetry Overlay, Scar Timeline.
- **Components**: `TBSASelector`, `FlapPerfusionChart`, `SymmetryMapper`, `BurnResuscitationCalculator`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Sepsis Warning" if burn patient shows SIRS or sudden drop in urine output < 0.5 ml/kg/hr.
- **Tenant Isolation**: `requireTenantScope` on all plastic-burns-logs.
- **Audit**: Hash-chained logs for all high-risk reconstructive procedures and implant/graft serial numbers.
