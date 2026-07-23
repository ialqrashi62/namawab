# AI Brain: Endocrinology & Diabetes (Ultra-Specialized)
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use a simple glucose log and HbA1c field.
- **Adversary's Critique:** "REJECTED. This is a basic clinic, not a world-class endocrine center. Where is the Time-in-Range (TIR) analysis? Where is the Insulin-to-Carb Ratio (ICR) and Correction Factor (CF) logic? Where is the tracking for Diabetic Foot (Wagner Scale) and Retinopathy? A specialized system must handle CGM (Continuous Glucose Monitoring) data streams, not just single points."
- **Optimizer's Refinement:** Implement a `glucose_dynamics` table for CGM integration, a `diabetes_complications` registry, and an AI-driven `insulin_optimizer` based on the patient's sensitivity and carbohydrate intake.

### 2. Prompt Engineering (The Cognitiveal Layer)
- **System Prompt:** "You are a World-Class Endocrinologist and Diabetologist. Your expertise is in Type 1, Type 2, and Gestational Diabetes, as well as complex thyroid and pituitary disorders. You analyze CGM trends, HbA1c, and C-peptide levels to optimize insulin/non-insulin regimens. You must strictly follow ADA (American Diabetes Association) and Endocrine Society guidelines."
- **VectorMine Strategy:** Indexing ADA Standards of Care in Diabetes, Endocrine Society guidelines, and latest SGLT2/GLP-1 RA trial data.
- **RAG Workflow:** `Glucose Trends + Carb Intake` $\rightarrow$ `Insulin Sensitivity Analysis` $\rightarrow$ `Dose Adjustment Suggestion` $\rightarrow$ `Hypoglycemia Risk Prediction`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/endocrinology/glucose/log`: Log glucose levels with context (Pre-prandial, Post-prandial, Fasting).
    - `POST /api/endocrinology/diabetes/complication`: Log diabetic foot/eye/renal complications.
    - `GET /api/endocrinology/tir-analysis`: Calculate Time-in-Range (70-180 mg/dL).
- **ERD Extensions:**
    - Table `endocrine_glucose_logs`: (id, patient_id, tenant_id, value, timestamp, context [Fasting/Post-meal], insulin_dose).
    - Table `diabetes_complications`: (id, patient_id, tenant_id, complication_type [Foot/Eye/Renal], severity_grade, last_screening_date).
    - Table `endocrine_thyroid_logs`: (id, patient_id, tenant_id, tsh, t3, t4, thyroid_volume, nodule_size).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `EndoCommandCenter`**
    - **TIR Gauge:** A circular gauge showing the percentage of time the patient spent in the target glucose range.
    - **Glucose Waveform:** A high-fidelity chart showing glucose fluctuations with markers for meals and insulin.
    - **Complication Map:** A visual body map highlighting areas of diabetic neuropathy or ulceration.
- **User Story:** "As a Diabetologist, I want to see the Time-in-Range (TIR) and the glucose variability (Standard Deviation) to adjust the basal-bolus regimen."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_tir_calculation()`: Verify that TIR is calculated correctly from a set of glucose values.
    - `test_hypoglycemia_alert()`: Ensure an immediate alert is triggered if glucose < 70 mg/dL.
- **Integration Tests:** Verify that glucose logs are linked to the `clinical_notes` for comprehensive review.
- **Compliance:** Alignment with Saudi MOH and ADA standards.
