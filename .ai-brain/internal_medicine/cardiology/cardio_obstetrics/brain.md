# AI Brain: Cardio-Obstetrics
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** OB Engine exists for maternity, but no specific "Cardiac-Maternal" intersection logic.
- **Global Standard:** Management of pre-existing heart disease during pregnancy, Preeclampsia/Eclampsia cardiac impact, and Peripartum Cardiomyopathy.
- **Gap:** Missing "Cross-Specialty" workflow between Cardiology and OBGYN.

### 2. Prompt Engineering
- **System Prompt:** "You are a dual-specialist in Cardiology and Maternal-Fetal Medicine. Your role is to manage the complex hemodynamic changes of pregnancy in patients with cardiac disease. You must balance maternal cardiac safety with fetal viability, adhering to the ESC Guidelines on Cardiovascular Diseases during Pregnancy."
- **VectorMine Strategy:** Indexing the ESC Guidelines on Cardiovascular Diseases during Pregnancy and ACOG recommendations.
- **RAG Workflow:** `Maternal Cardiac Data` $\rightarrow$ `Pregnancy Stage Analysis` $\rightarrow$ `Risk Stratification` $\rightarrow$ `Multidisciplinary Care Plan`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/cardio-ob/risk-strat`: Log maternal cardiac risk during pregnancy.
    - `POST /api/cardio-ob/delivery-plan`: Document cardiac-specific delivery requirements (e.g., anesthesia, monitoring).
- **ERD Extensions:**
    - Table `cardio_obstetrics_records`: (id, patient_id, pregnancy_stage, cardiac_condition, fetal_impact_score, delivery_mode_recommendation).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `MaternalCardiacMonitor`**
    - **Dual-View:** Side-by-side monitoring of Maternal Hemodynamics and Fetal Heart Rate.
    - **Risk Alert:** High-visibility warnings for Preeclampsia signs.
- **User Story:** "As a Maternal-Fetal specialist, I need a unified view of the mother's cardiac function and the fetus's health to decide on the timing of delivery."

### 5. QA & Compliance
- **Unit Tests:** `test_pregnancy_cardiac_risk()`: Verify risk level based on pre-existing condition and trimester.
- **Compliance:** Alignment with Saudi MOH guidelines for high-risk pregnancies.
