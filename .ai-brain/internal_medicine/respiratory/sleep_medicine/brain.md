# AI Brain: Sleep Medicine & Respiratory Disorders
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic sleep complaints in notes. No structured data for Polysomnography (PSG), Apnea-Hypopnea Index (AHI), or CPAP compliance.
- **Global Standard:** Requires detailed PSG/HOS (Home Sleep Apnea Test) reporting and CPAP titration tracking.
- **Gap:** Missing "Sleep-centric" data model and CPAP adherence monitoring.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Sleep Medicine Specialist. Your expertise is in Obstructive Sleep Apnea (OSA), Central Sleep Apnea, and Narcolepsy. You analyze PSG/HOS data to determine AHI, oxygen desaturation/index, and suggest optimal PAP therapy settings based on AASM guidelines."
- **VectorMine Strategy:** Index la AASM (American Academy of Sleep Medicine) Manual for the Scoring of Sleep and Associated Events.
- **RAG Workflow:** `PSG Data` $\rightarrow$ `AHI/RDI Calculation` $\rightarrow$ `Sleep Stage Analysis` $\rightarrow$ `PAP Pressure Recommendation`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/respiratory/sleep/psg`: Log Polysomnography results (AHI, RDI, Lowest SpO2).
    - `POST /api/respiratory/sleep/cpap-compliance`: Log CPAP usage hours and leak rate.
- **ERD Extensions:**
    - Table `respiratory_sleep_psg`: (id, patient_id, tenant_id, ahi, rdi, lowest_spo2, sleep_efficiency_percent).
    - Table `respiratory_cpap_logs`: (id, patient_id, tenant_id, usage_hours, leak_rate, pressure_cmh2o).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `SleepAnalysisCenter`**
    - **Hypnogram Viewer:** Visual representation of sleep stages (N1, N2, N3, REM).
    - **Compliance Gauge:** Circular gauge showing CPAP usage vs. target (e.g., 4+ hours/night).
- **User Story:** "As a Sleep Specialist, I want to see the patient's CPAP compliance and AHI trend to adjust the pressure settings."

### 5. QA & Compliance
- **Unit Tests:** `test_ahi_classification()`: Verify that AHI values are correctly categorized (Mild, Moderate, Severe).
- **Compliance:** Alignment with Saudi MOH sleep disorder management standards.
