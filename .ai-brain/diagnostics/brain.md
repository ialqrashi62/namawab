# Brain: Diagnostics (Wave 4)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Advanced Laboratory Medicine, Radiology (MRI, CT, PET), Nuclear Medicine, and Pathology.
- **Key Workflows**:
    - **Advanced Lab**: Molecular diagnostics, Next-Generation Sequencing (NGS), and Liquid Biopsy.
    - **Radiology**: AI-assisted lesion detection, 3D Volumetric Analysis, and Contrast-enhanced kinetics.
    - la-Surgical logic for biopsy and interventional radiology.
    - **Nuclear Medicine**: PET/CT Tracer kinetics and SPECT quantification.
    - **Pathology**: Digital Pathology, IHC (Immunohistochemistry) scoring, and Molecular Typing.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - CLSI (Clinical and Laboratory Standards Institute).
    - ACR (American College of Radiology).
    - CAP (College of American Pathologists).
    - IAEA (International Atomic Energy Agency) for Nuclear Medicine.
- **VectorMine Indexing**:
    - `diag_molecular_markers`: Mapping genetic mutations to targeted therapies.
    - `radiology_lesion_atlas`: AI-driven classification of radiological patterns.

### 3. Technical Implementation (Backend)
- **Database Tables**: `diag_molecular_logs`, `radiology_advanced_metrics`, `nuclear_med_logs`, `pathology_digital_logs`.
- **API Endpoints**:
    - `POST /api/diagnostics/molecular`: Log NGS and liquid biopsy results.
    - `POST /api/diagnostics/radiology-advanced`: Log volumetric and kinetic data.
    - `POST /api/diagnostics/nuclear-med`: Log tracer uptake and SUV (Standardized Uptake Value).
    - `POST /api/diagnostics/pathology-digital`: Log IHC scores and molecular typing.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Volumetric Render, Molecular Sequence Viewer, SUV Heatmap, Digital Slide Viewer.
- **Components**: `MolecularSequenceViewer`, `RadiologyVolumeChart`, `SUVHeatmapOverlay`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Critical Value Alert" if molecular markers indicate acute malignancy or life-threatening pathology.
- **Tenant Isolation**: `requireTenantScope` on all diagnostic-logs.
- **Audit**: Hash-chained logs for all diagnostic reports and digital slides.
