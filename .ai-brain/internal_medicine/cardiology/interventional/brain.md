# AI Brain: Interventional Cardiology (The Cath Lab Core)
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis (The Loop)
- **Current State:** Generic `cardiology_module` exists. No specific workflow for Catheterization, Stenting, or Angiography.
- **Global Standard (Mayo/Cleveland):** Requires real-time hemodynamic monitoring, stent registry (size, material, location), and contrast volume tracking to prevent CIN (Contrast-Induced Nephropathy).
- **Gap:** Missing "Procedure-centric" data model. Current system is "Encounter-centric".

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an Expert Interventional Cardiologist and Cath Lab Director. Your role is to analyze angiographic findings, suggest optimal stent sizing based on vessel diameter, and monitor for complications like dissection or slow-flow. You must strictly adhere to the NCDR (National Cardiovascular Data Registry) standards."
- **VectorMine Strategy:** Indexing the 'SCAI' (Society for Cardiovascular Angiography and Interventions) guidelines and latest PCI (Percutaneous Coronary Intervention) trial data.
- **RAG Workflow:** `Angio Image Data` $\rightarrow$ `Vessel Diameter Analysis` $\rightarrow$ `Stent Selection Logic` $\rightarrow$ `Procedural Log Generation`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/cardiology/cath-lab/procedure`: Start/End a PCI procedure.
    - `POST /api/cardiology/cath-lab/stents`: Log stent details (Brand, Length, Diameter, Pressure).
    - `POST /api/cardiology/cath-lab/contrast`: Track total contrast volume (Alert if > 200ml).
- **ERD Extensions:**
    - Table `cath_lab_procedures`: (id, patient_id, operator_id, access_site, fluoroscopy_time, contrast_volume).
    - Table `stent_registry`: (id, procedure_id, vessel_segment, diameter, length, material, pressure_post_dilation).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `CathLabCommandCenter`**
    - **Live Monitor:** Real-time contrast volume counter + Timer.
    - **Stent Picker:** Visual grid of available stents with stock integration.
    - **Angio-Log:** Rapid-entry form for vessel-by-vessel findings.
- **User Story:** "As an Interventionalist, I need to log the stent size and location instantly during the procedure without leaving the imaging screen."

### 5. QA & Compliance
- **Unit Tests:** 
    - `test_contrast_alert()`: Trigger warning when contrast exceeds patient-specific threshold.
    - `test_stent_validation()`: Ensure stent diameter is within physiological limits.
- **Integration Tests:** Verify that the Cath Lab report automatically updates the patient's `problems` list with the new stent location.
- **Compliance:** Full alignment with Saudi MOH Cath Lab safety protocols.
