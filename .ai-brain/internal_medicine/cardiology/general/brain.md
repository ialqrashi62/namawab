# AI Brain: General Cardiology (Specialized Logic)
## Version: 1.0
## Status: Implementation Phase

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Consultant Cardiologist. Your goal is to analyze hemodynamic data, ECGs, and Echo parameters to provide differential diagnoses based on ACC/AHA and ESC guidelines. You must prioritize life-threatening conditions (STEMI, Heart Failure Acute Decompensation) and suggest evidence-based interventions."
- **Context Strategy:** 
    - Primary: Current Encounter (Vitals, ECG).
    - Secondary: Longitudinal Trends (BP, Weight, BNP levels over 6 months).
    - Tertiary: Comorbidities (Diabetes, CKD).
- **VectorMine Strategy:** Indexing the latest ACC/AHA Guidelines, ESC Guidelines, and PubMed Cardiology reviews.
- **RAG Workflow:** `Patient Data` $\rightarrow$ `Symptom Extraction` $\rightarrow$ `Guideline Retrieval` $\rightarrow$ `Differential Diagnosis` $\rightarrow$ `Suggested Workup`.

### 2. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/cardiology/assessment`: Submit specialized cardiac exam (Heart sounds, Edema, JVP).
    - `POST /api/cardiology/echo-params`: Store EF, LV mass, Valve gradients.
    - `GET /api/cardiology/risk-score`: Calculate ASCVD / CHA2DS2-VASc scores.
- **ERD Extensions:**
    - Table `cardiology_exams`: (patient_id, encounter_id, heart_sounds, jvp_height, edema_grade, carotid_bruit).
    - Table `cardiology_echo`: (patient_id, ef_percent, lv_dimension, mitral_regurgitation_grade, aortic_stenosis_area).
- **Business Logic:** 
    - Automatic trigger for "High Risk" if EF < 35% or BNP > 400 pg/mL.

### 3. Frontend / UI-UX (Stitch Google Style)
- **Component: `CardiacCommandCenter`**
    - **Header:** Patient Summary + Real-time Vitals.
    - **Left Panel:** `ECGViewer` (Interactive wave analysis).
    - **Center Panel:** `HemodynamicGrid` (Dynamic inputs for BP, HR, CVP).
    - **Right Panel:** `AI-Consultant` (RAG-powered suggestions).
- **User Story:** "As a Cardiologist, I want to input Echo parameters and immediately see the AI-calculated risk category and recommended medication adjustment."

### 4. QA & Compliance
- **Unit Tests:** 
    - `test_ascvd_calculator()`: Verify score accuracy against standard formulas.
    - `test_ef_alert()`: Ensure alert triggers when EF < 35%.
- **Integration Tests:** Verify that `cardiology_exams` data flows correctly into the `clinical_notes` (SOAP) final report.
- **Acceptance Criteria:** 
    - 100% accuracy in risk score calculation.
    - UI response time < 200ms for data entry.
    - Full compliance with Saudi MOH Cardiology standards.
