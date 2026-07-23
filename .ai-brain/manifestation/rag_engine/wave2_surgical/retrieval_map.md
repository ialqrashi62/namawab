# RAG Implementation: Wave 2 (Surgical)
## Contextual Retrieval Mapping

### 1. General Surgery (Safety & Quality)
- **Trigger**: `POST /api/surgery/safety-checklist`.
- **RAG Query**: "What are the critical WHO Surgical Safety Checklist items for [Procedure Type] to prevent wrong-site surgery?"
- **Expected Context**: 
    - Guideline: WHO Surgical Safety Checklist.
    - Key Section: Sign-in, Time-out, and Sign-out phases.

### 2. Neurosurgery & Spine
- **Trigger**: `POST /api/neurosurgery/icp-log` or `GET /api/neurosurgery/gcs-trend`.
- **RAG Query**: "Based on AANS guidelines, what is the immediate management for a patient with ICP [Value] and GCS [Value]?"
- **Expected Context**:
    - Guideline: AANS/CNS Brain Trauma Guidelines.
    - Key Section: ICP management, Osmotic therapy (Mannitol/Hypertonic Saline).

### 3. Orthopedics & Traumatology
- **Trigger**: `POST /api/orthopedics/joint-replacement`.
- **RAG Query**: "According to AAOS, what is the acceptable alignment angle for a total hip arthroplasty to minimize dislocation risk?"
- **Expected Context**:
    - Guideline: AAOS Joint Replacement Standards.
    - Key Section: Component positioning and stability metrics.

### 4. Ophthalmology
- **Trigger**: `POST /api/ophthalmology/iol-calc`.
- **RAG Query**: "Compare the IOL power calculation for [Lens Formula] vs [Lens Formula] for a patient with [Keratometry Data]."
- **Expected Context**:
    - Guideline: ESCRS IOL Calculation Standards.
    - Key Section: Formula accuracy based on axial length.

### 5. ENT (Otolaryngology)
- **Trigger**: `POST /api/ent/audiogram`.
- **RAG Query**: "Based on IFOS standards, does an air-bone gap of [Value] dB indicate a conductive or mixed hearing loss?"
- **Expected Context**:
    - Guideline: IFOS Audiometry Standards.
    - Key Section: Interpretation of tympanometry and audiograms.

### 6. Urology
- **Trigger**: `POST /api/urology/stone-log`.
- **RAG Query**: "According to AUA guidelines, what is the preferred lithotripsy modality for a [Size] mm stone in the [Location]?"
- **Expected Context**:
    - la-Surgical logic for stone fragmentation.
    - Guideline: AUA Stone Management Guidelines.

### 7. Plastic & Burns
- **Trigger**: `POST /api/plastic-burns/burn-resuscitation`.
- **RAG Query**: "Using the Parkland Formula, calculate the 24-hour fluid requirement for a patient with [TBSA]% burns and weight [Weight] kg."
- **Expected Context**:
    - Guideline: ISBI Burn Care Standards.
    - Key Section: Fluid resuscitation and electrolyte balance.
