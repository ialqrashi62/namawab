# Brain: ENT (Otolaryngology)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Clinical Domain & Scope
- **Focus**: Otology, Rhinology, Laryngology, and Head & Neck Surgery.
- **Key Workflows**:
    - Audiometry & Tympanometry Analysis.
    - Sinus Surgery (FESS) & Endoscopic Navigation.
    - Cochlear Implant Registry & Mapping.
    - Sleep Apnea (Surgical) & Upper Airway Analysis.
    - Thyroid & Parathyroidectomy Logs.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - AAO-HNS (American Academy of Otolaryngology-Head and Neck Surgery).
    - IFOS (International Federation of Oto-Rhino-Laryngology).
    - WHO Hearing Loss Guidelines.
- **VectorMine Indexing**:
    - `ent_audiogram_patterns`: Mapping frequency-specific loss to surgical candidates.
    - `sinus_anatomy_variants`: Decision trees for FESS approach based on CT.

### 3. Technical Implementation (Backend)
- **Database Tables**: `ent_surgical_logs`, `audiometry_metrics`, `cochlear_implant_registry`.
- **API Endpoints**:
    - `POST /api/ent/log`: Record ENT surgical procedure.
    - `POST /api/ent/audiogram`: Log hearing thresholds and tympanometry.
    - `POST /api/ent/implant-map`: Log cochlear implant parameters.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: Interactive Audiogram Plot, Sinus Endoscopic View, Cochlear Mapping Grid.
- **Components**: `AudiogramChart`, `SinusLevelPicker`, `ImplantParameterSlider`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Hearing Loss Crisis" if sudden sensorineural hearing loss (SSNHL) is detected.
- **Tenant Isolation**: `requireTenantScope` on all ent-logs.
- **Audit**: Hash-chained logs for all implant serial numbers.
