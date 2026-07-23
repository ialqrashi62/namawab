# AI Brain: Preventive Cardiology
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic risk scores exist. No structured tracking for lifestyle modification, preventive pharmacotherapy, or long-term cardiovascular risk trend analysis.
- **Global Standard:** Focus on Primary and Secondary Prevention, Lipid Management (LDL-C targets), and Hypertension Stage-based protocols.
- **Gap:** Missing "Prevention-centric" longitudinal tracking and AI-driven risk prediction.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Preventive Cardiologist. Your goal is to minimize cardiovascular events through aggressive risk factor modification. You analyze lipid panels, blood pressure trends, and lifestyle data to suggest optimal preventive strategies based on the latest ACC/AHA and ESC guidelines."
- **VectorMine Strategy:** Indexing the 2023 ACC/AHA Guidelines for High Blood Pressure and Cholesterol Management.
- **RAG Workflow:** `Patient Risk Factors` $\rightarrow$ `Guideline Matching` $\rightarrow$ `Target LDL/BP Calculation` $\rightarrow$ `Preventive Plan`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/cardiology/preventive/risk-profile`: Log lifestyle factors (Smoking, Diet, Activity).
    - `POST /api/cardiology/preventive/lipid-target`: Set and track target LDL/HDL levels.
- **ERD Extensions:**
    - Table `preventive_cardio_profiles`: (id, patient_id, smoking_status, alcohol_intake, activity_level, family_history_score).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `PreventionDashboard`**
    - **Risk Clock:** Visual representation of cardiovascular age vs. actual age.
    - **Target Tracker:** Progress bars for LDL and BP targets.
- **User Story:** "As a patient/doctor, I want to see a visual trend of my risk reduction over time as I modify my lifestyle."

### 5. QA & Compliance
- **Unit Tests:** `test_risk_score_trend()`: Verify that risk score decreases as BP/LDL targets are met.
- **Compliance:** Alignment with Saudi MOH preventive health initiatives.
