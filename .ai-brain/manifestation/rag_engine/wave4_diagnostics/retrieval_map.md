# RAG Implementation: Wave 4 (Diagnostics)
## Contextual Retrieval Mapping

### 1. Molecular Diagnostics & NGS
- **Trigger**: `POST /api/diagnostics/molecular`.
- **RAG Query**: "Based on the latest molecular pathology guidelines, what is the clinical significance of the [Mutation] in [Cancer Type] and which targeted therapies are indicated?"
- **Expected Context**: 
    - Guideline: CAP/AMP (College of American Pathologists / Association for Molecular Pathology).
    - Key Section: Variant classification (Pathogenic, VUS) and drug-gene pairs.

### 2. Advanced Radiology (Volumetric & Kinetic)
- **Trigger**: `POST /api/diagnostics/radiology-advanced`.
- **RAG Query**: "For a lesion with a [Kinetic Curve Type] and volume [Value], what is the probability of malignancy according to the BI-RADS/PI-RADS standards?"
- **Expected Context**:
    - Guideline: ACR (American College of Radiology) BI-RADS/PI-RADS.
    - Key Section: Kinetic/Volumetric criteria for malignancy.

### 3. Nuclear Medicine (SUV & Tracer)
- **Trigger**: `POST /api/diagnostics/nuclear-med`.
- **RAG Query**: "What is the standard SUV max threshold for [Tracer] in the detection of [Disease] according to IAEA guidelines?"
- **Expected Context**:
    - Guideline: IAEA Nuclear Medicine Standards.
    - Key Section: SUV quantification and tracer kinetics.

### 4. Digital Pathology & IHC
- **Trigger**: `POST /api/diagnostics/pathology-digital`.
- **RAG Query**: "Based on the IHC score of [Score] for [Marker], what is the recommended therapeutic approach for this tumor type?"
- **Expected Context**:
    - Guideline: CAP Digital Pathology Standards.
    - Key Section: IHC scoring/grading and molecular typing.
