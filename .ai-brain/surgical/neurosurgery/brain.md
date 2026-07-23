# Brain: Neurosurgery & Spine Surgery
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Cranial surgery, Spinal surgery, Neuro-critical care, and Functional Neurosurgery.
- **Key Workflows**:
    - Intracranial Pressure (ICP) Monitoring & Management.
    - Glasgow Coma Scale (GCS) Trend Analysis.
    - Spinal Cord Injury (SCI) / ASIA Impairment Scale.
    - Stereotactic Frame/Frameless Navigation.
    - Aneurysm Clipping & Coiling (Endovascular).
    - Tumor Resection (Glioma, Meningioma) with Mapping.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AANS (American Association of Neurological Surgeons).
    - CNS (Congress of Neurological Surgeons).
    - WHO International Classification of Functioning, Disability and Health (ICF).
    - ASIA (American Spinal Injury Association) Standards.
- **VectorMine Indexing**:
    - `neuro_guidelines_v1`: Mapping surgical approach to pathology.
    - `spine_stability_matrix`: Decision trees for fusion vs. decompression.

### 3. Technical Implementation (Backend)
- **Database Tables**: `neuro_surgical_logs`, `intracranial_pressure_logs`, `spine_stability_metrics`.
- **API Endpoints**:
    - `POST /api/neurosurgery/icp-log`: Record ICP and CPP.
    - `POST /api/neurosurgery/gcs-trend`: Track neurological deterioration.
    - `POST /api/neurosurgery/spine-stability`: Log ASIA scale and stability grade.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Brain Mapping Overlay, Spinal Segment Selector, Real-time ICP Waveform.
- **Components**: `NeuroGCSChart`, `SpineLevelPicker`, `ICPAlertPanel`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Neurological Emergency" if GCS drops $\ge 2$ points or ICP $> 20$ mmHg.
- **Tenant Isolation**: `requireTenantScope` on all neuro-logs.
- **Audit**: Hash-chained logs for all surgical interventions.
