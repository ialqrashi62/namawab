# AI Brain: Electrophysiology (EP) - Heart Rhythm Management
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis (The Loop)
- **Current State:** Generic cardiology tables exist. No specific logic for arrhythmia mapping, ablation/cryo-ablation, or device implantation (Pacemakers/ICDs).
- **Global Standard (HRS - Heart Rhythm Society):** Requires detailed mapping of electrical signals, recording of ablation energy/time, and device programming parameters.
- **Gap:** Missing "Rhythm-centric" data model and specialized UI for ECG signal analysis.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Cardiac Electrophysiologist. Your expertise is in diagnosing complex arrhythmias (AFib, VT, SVT) and planning ablation strategies. You analyze intracardiac electrograms (EGMs) and suggest optimal ablation sites based on the latest HRS and EHRA guidelines."
- **VectorMine Strategy:** Indexing the Heart Rhythm Society (HRS) guidelines, EHRA (European Heart Rhythm Association) consensus documents, and latest ablation trial data.
- **RAG Workflow:** `EGM Signal Data` $\rightarrow$ `Arrhythmia Pattern Recognition` $\rightarrow$ `Ablation Site Suggestion` $\rightarrow$ `Post-Ablation Verification`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/cardiology/ep/ablation`: Log ablation/cryo-ablation parameters (Energy, Duration, Site).
    - `POST /api/cardiology/ep/device`: Log device implantation (Model, Lead Position, Pacing Parameters).
    - `GET /api/cardiology/ep/rhythm-analysis`: AI-driven analysis of stored ECG/EGM strips.
- **ERD Extensions:**
    - Table `ep_ablation_logs`: (id, procedure_id, site_name, energy_joules, duration_sec, modality [RF/Cryo], success_indicator).
    - Table `ep_device_registry`: (id, patient_id, device_type [Pacemaker/ICD/CRT], model, lead_position, sensitivity, output_voltage).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `EPCommandCenter`**
    - **Signal Viewer:** High-resolution EGM strip viewer with annotation tools.
    - **Ablation Dashboard:** Real-time energy/time tracker with "Success" confirmation buttons.
    - **Device Programmer:** Visual interface for adjusting pacing parameters.
- **User Story:** "As an EP Specialist, I want to map the electrical activity of the atrium and log the ablation energy for each target site in real-time."

### 5. QA & Compliance
- **Unit Tests:** 
    - `test_ablation_energy_limit()`: Ensure energy levels stay within safety bounds.
    - `test_device_parameter_validation()`: Verify that pacing parameters are within physiological ranges.
- **Integration Tests:** Verify that EP procedure logs are linked to the main `cath_lab_procedures` table.
- **Compliance:** Alignment with Saudi MOH and international HRS safety standards.
