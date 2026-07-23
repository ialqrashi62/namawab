# Brain: Rehab & Support (Wave 6)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Physical Therapy, Occupational Therapy, Speech-Language Pathology, and Psychosocial Support.
- **Key Workflows**:
    - **Physical Rehab**: Range of Motion (ROM) recovery, Muscle Strength Grading (MMT), and Gait Analysis.
    - **Occupational Therapy**: ADL (Activities of Daily Living) scoring and adaptive equipment mapping.
    - **Speech Therapy**: Dysphagia screening, cognitive-communication/language recovery, and voice therapy.
    - **Psychosocial Support**: Depression/Anxiety screening (PHQ-9, GAD-7) and social determinant of health (SDOH) mapping.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - WCPT (World Confederation for Physical Therapy).
    - AOTA (American Occupational Therapy Association).
    - ASHA (American Speech-Language-Hearing Association).
    - WHO ICF (International Classification of Functioning, Disability and Health).
- **VectorMine Indexing**:
    - `rehab_recovery_curves`: Mapping intervention types to expected recovery timelines.
    - `adl_score_logic`: Decision trees for adaptive equipment recommendations based on functional gaps.

### 3. Technical Implementation (Backend)
- **Database Tables**: `rehab_physical_logs`, `rehab_occupational_logs`, `rehab_speech_logs`, `psychosocial_support_logs`.
- **API Endpoints**:
    - `POST /api/rehab/physical`: Log ROM, MMT, and gait metrics.
    - `POST /api/rehab/occupational`: Log ADL scores and adaptive tool needs.
    - `POST /api/rehab/speech`: Log dysphagia and communication progress.
    - `POST /api/rehab/psychosocial`: Log PHQ-9/GAD-7 and SDOH markers.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Recovery Progress Heatmap, ROM Angle Chart, ADL Functional Map.
- **Components**: `ROMAnglePicker`, `ADLScoreGrid`, `PsychosocialTrendLine`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Regression Warning" if functional scores drop by $> 20\%$ over two sessions.
- **Tenant Isolation**: la-Surgical logic for rehab-logs.
- **Audit**: Hash-chained logs for all rehab progress reports.
