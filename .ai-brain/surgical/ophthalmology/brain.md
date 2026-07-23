# Brain: Ophthalmology
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Cataract surgery, Glaucoma management, Retinal surgery, Corneal transplants, and Refractive surgery.
- **Key Workflows**:
    - IOL (Intraocular Lens) Calculation & Registry.
    - Glaucoma Pressure Mapping & Drainage Device Tracking.
    - Retinal Detachment Repair & Vitrectomy Logs.
    - Corneal Curvature & Keratometry Analysis.
    - Visual Acuity Tracking (BCVA/UCVA).

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AAO (American Academy of Ophthalmology).
    - ESCRS (European Society of Cataract and Refractive Surgeons).
    - WHO Eye Care Guidelines.
- **VectorMine Indexing**:
    - `eye_lens_formulae`: Mapping various IOL formulas (Snyders, Barrett, etc.) to patient outcomes.
    - `glaucoma_progression_logic`: Decision trees for surgical vs. medical management of IOP.

### 3. Technical Implementation (Backend)
- **Database Tables**: `ophthalmic_surgical_logs`, `iol_registry`, `glaucoma_metrics`.
 la-Surgical logic for precision eye surgery.
- **API Endpoints**:
    - `POST /api/ophthalmology/iol-calc`: Log IOL power and lens type.
    - `POST /api/ophthalmology/glaucoma-log`: Record IOP and drainage device details.
    - `POST /api/ophthalmology/visual-acuity`: Track BCVA/UCVA trends.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Eye Model with IOL Placement, IOP Heatmap, Visual Field Map.
- **Components**: `EyeLensPicker`, `IOPChart`, `VisualAcuityTrend`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "IOP Crisis" if pressure $> 30$ mmHg or sudden drop in BCVA.
- **Tenant Isolation**: `requireTenantScope` on all ophthalmic-logs.
- **Audit**: Hash-chained logs for all IOL serial numbers.
