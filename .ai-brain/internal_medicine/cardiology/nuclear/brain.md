# AI Brain: Nuclear Cardiology (Advanced Imaging & Therapy)
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis (The Loop)
- **Current State:** Generic radiology tables exist. No specific logic for Myocardial Perfusion Imaging (MPI), PET-CT cardiac/vascular, or Radioisotope Therapy.
- **Global Standard:** Requires precise tracking of radiopharmaceutical doses, uptake/decay calculations, and integration with Nuclear Medicine reporting standards.
- **Gap:** Missing "Isotope-centric" data model and radiation safety tracking.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Nuclear Cardiologist. Your expertise is in interpreting SPECT and PET scans to assess myocardial viability and perfusion. You analyze tracer uptake patterns to differentiate between ischemia and infarction, adhering to ASNC (American Society of Nuclear Cardiology) guidelines."
- **VectorMine Strategy:** Indexing ASNC guidelines, SNMMI (Society of Nuclear Medicine and Molecular Imaging) standards, and latest PET-CT clinical trials.
- **RAG Workflow:** `Isotope Scan Data` $\rightarrow$ `Perfusion Defect Analysis` $\rightarrow$ `Viability Assessment` $\rightarrow$ `Clinical Recommendation`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/cardiology/nuclear/scan`: Log nuclear scan details (Tracer, Dose, Protocol).
    - `POST /api/cardiology/nuclear/results`: Store perfusion findings (Stress vs. Rest).
    - `POST /api/cardiology/nuclear/therapy`: Log radioisotope therapy (e.g., I-131) and dosage.
- **ERD Extensions:**
    - Table `nuclear_cardiology_scans`: (id, patient_id, encounter_id, tracer_used, dose_mci, scan_type [SPECT/PET], stress_type [Exercise/Pharmacological]).
    - Table `nuclear_perfusion_results`: (id, scan_id, wall_motion_abnormality, perfusion_defect_location, viability_status).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `NuclearImagingCenter`**
    - **Isotope Tracker:** Real-time dose and decay calculator.
    - **Comparison Viewer:** Side-by-side view of Stress vs. Rest images with AI-highlighted defects.
    - **Therapy Log:** Specialized form for radioisotope administration and safety/shielding checks.
- **User Story:** "As a Nuclear Cardiologist, I want to compare the stress and rest perfusion images and have the AI suggest the most likely area of ischemia."

### 5. QA & Compliance
- **Unit Tests:** 
    - `test_dose_calculation()`: Verify radiopharmaceutical dose calculations.
    - `test_radiation_safety_alert()`: Trigger alert if dose exceeds safety limits.
- **Integration Tests:** Verify that nuclear results are linked to the patient's overall cardiology record.
- **Compliance:** Alignment with Saudi MOH radiation safety and nuclear medicine regulations.
