# Brain: Orthopedics & Traumatology
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Joint replacement, Fracture management, Sports medicine, Spine trauma, and Pediatric orthopedics.
- **Key Workflows**:
    - Arthroplasty (Hip/Knee) Planning & Registry.
    - Fracture Classification (AO/OTA) & Reduction Tracking.
    - Ligament Reconstruction (ACL/PCL) Metrics.
    - Range of Motion (ROM) & Functional Scoring (Harris Hip Score, Oxford Knee Score).
    - Implant Tracking & Material Compatibility.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AAOS (American Academy of Orthopaedic Surgeons).
    - AO Foundation (Arbeitsgemeinschaft für Osteosynthesefragen).
    - OTA (Orthopaedic Trauma Association).
    - WHO Surgical Safety Checklist (Orthopedic variant).
- **VectorMine Indexing**:
    - `ortho_implant_catalog`: Mapping implant brands to compatibility and failure rates.
    - `fracture_reduction_logic`: Decision trees for conservative vs. surgical management.

### 3. Technical Implementation (Backend)
- **Database Tables**: `ortho_surgical_logs`, `joint_replacement_registry`, `fracture_management_logs`.
- **API Endpoints**:
    - `POST /api/orthopedics/joint-replacement`: Log implant details and alignment.
    - `POST /api/orthopedics/fracture-log`: Record AO/OTA classification and reduction status.
    - `POST /api/orthopedics/rom-score`: Track Range of Motion and functional scores.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 3D Joint Alignment Overlay, Fracture Reduction Heatmap, ROM Angle Picker.
- **Components**: `JointAlignmentChart`, `FractureClassPicker`, `ROMAngleSlider`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Implant Failure Risk" if post-op ROM is below threshold or alignment is $> 3^\circ$ off target.
- **Tenant Isolation**: `requireTenantScope` on all ortho-logs.
- **Audit**: Hash-chained logs for all implant serial numbers.
