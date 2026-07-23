# AI Brain: Hematology & Oncology (Ultra-Specialized)
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use generic chemo logs and blood counts.
- **Adversary's Critique:** "REJECTED. Generic logs fail to capture Cycle-Day (CD) timing, Nadir/Recovery/Recovery-to-Nadir/Recovery-to-Nadir intervals, and CTCAE toxicity grading. A world-class system must track the 'Chemo-Calendar' and 'Neutropenic Window' to prevent fatal sepsis."
- **Optimizer's Refinement:** Implement a `chemo_cycle_calendar` and `toxicity_grading` system based on CTCAE v5.0. Integrate a "Nadir Prediction" AI model.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Hemato-Oncologist. Your expertise is in liquid and solid tumors, including CAR-T cell therapy and BMT. You analyze CBC/Diff, Bone Marrow Aspirates, and PET-CT to determine RECIST 1.1 response. You must strictly calculate chemotherapy doses based on BSA (Body Surface Area) and adjust for renal/hepatic impairment."
- **VectorMine Strategy:** Indexing NCCN (National Comprehensive Cancer Network) Guidelines, ESMO (European Society for Medical Oncology), and ASH (American Society of Hematology) standards.
- **RAG Workflow:** `Patient BSA + Diagnosis` $\rightarrow$ `NCCN Protocol Retrieval` $\rightarrow$ `Dose Calculation` $\rightarrow$ `Toxicity Monitoring` $\rightarrow$ `Response Assessment (RECIST)`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/oncology/chemo/cycle`: Log a chemo cycle (Drug, Dose, Day, Site).
    - `POST /api/oncology/toxicity/grade`: Log CTCAE grade for specific organs.
    - `GET /api/oncology/nadir-prediction`: AI-driven prediction of the lowest neutrophil count.
- **ERD Extensions:**
    - Table `oncology_chemo_cycles`: (id, patient_id, tenant_id, protocol_name, cycle_number, day_number, drug_name, dose_mg_m2, actual_dose, admin_date).
    - Table `oncology_toxicity_logs`: (id, cycle_id, tenant_id, organ_system, grade [1-5], onset_date).
    - Table `bmt_registry`: (id, patient_id, tenant_id, stem_cell_source [Autologous/Allogeneic], conditioning_regimen, engraftment_date, GVHD_grade).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `OncoCommandCenter`**
    - **Chemo-Calendar:** A visual timeline showing planned vs. actual administration dates.
    - **Toxicity Heatmap:** A body map highlighting organs affected by chemotherapy (e.g., Red for Grade 3 Neutropenia).
    - **RECIST Tracker:** A graph showing tumor size changes over time (Target Lesions vs. Non-target).
- **User Story:** "As an Oncologist, I want to see the patient's neutrophil trend and the predicted nadir date to decide if G-CSF support is required."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_bsa_calculation()`: Verify Mosteller formula accuracy.
    - `test_chemo_dose_alert()`: Trigger alert if dose exceeds protocol max by >10%.
- **Integration Tests:** Verify that `oncology_chemo_cycles` triggers a "High-Risk" flag in the Nursing Station for neutropenic fever.
- **Compliance:** Full alignment with Saudi MOH Oncology protocols and HIPAA/PDPL.
