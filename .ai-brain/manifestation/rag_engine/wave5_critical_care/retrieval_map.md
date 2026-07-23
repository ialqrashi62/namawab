# RAG Implementation: Wave 5 (Critical Care & Emergency)
## Contextual Retrieval Mapping

### 1. Hemodynamic Stability & Shock
- **Trigger**: `POST /api/critical-care/hemodynamics`.
- **RAG Query**: "Based on the Surviving Sepsis Campaign (SSC) 2021, what is the recommended MAP target and first-line vasopressor for a patient in septic shock?"
- **Expected Context**: 
    - Guideline: SSC 2021.
    - Key Section: Hemodynamic targets (MAP $\ge 65$ mmHg) and Norepinephrine as first-line.

### 2. Sepsis Bundle Compliance
- **Trigger**: `POST / la-Surgical logic for sepsis bundle tracking.
- **RAG Query**: "What are the 3-hour bundle requirements for sepsis management according to the CMS Core Measures?"
- **Expected Context**:
    - Guideline: CMS Core Measures / SSC.
    - Key Section: Lactate measurement, Blood cultures, Broad-spectrum antibiotics, Fluid bolus.

### 3. Mechanical Ventilation & Weaning
- **Trigger**: `POST /api/critical-care/vent-weaning`.
- ** la-Surgical logic for ventilation weaning.
- **RAG Query**: "What is the interpretation of an RSBI (Rapid Shallow Breathing Index) of 110 in a patient with ARDS?"
- **Expected Context**:
    - Guideline: SCCM Ventilation Guidelines.
    - Key Section: RSBI thresholds for extubation success (typically $< 105$).

### 4. MODS & Organ Failure
- **Trigger**: `GET /api/critical-care/mods-risk`.
- **RAG Query**: "Based on the SOFA score of 12, what is the predicted mortality rate and recommended organ support (CRRT/Ventilation)?"
- **Expected Context**:
    - Guideline: SCCM / KDIGO.
    - Key Section: SOFA score interpretation and multi-organ failure management.
