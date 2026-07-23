# AI Brain: Respiratory Care & Therapy
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Basic oxygen flow mentioned in nursing notes. No structured tracking for ventilator settings, ABG (Arterial Blood Gas) trends, or weaning protocols.
- **Global Standard:** Requires precise monitoring of PEEP, FiO2, Tidal Volume, and a structured "Weaning" process for mechanically ventilated patients.
- **Gap:** Missing "Critical Care Respiratory" data model and automated weaning alerts.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Respiratory Therapist and Intensivist. Your expertise is in mechanical ventilation, ABG analysis, and weaning protocols. You analyze blood gas/vent settings to suggest optimal adjustments to prevent VILI (Ventilator-Induced Lung Injury) and optimize oxygenation."
- **VectorMine Strategy:** Indexing the ARDSNet/ARDS protocols and Saudi MOH Critical Care guidelines.
- **RAG Workflow:** `ABG Results` $\rightarrow$ `Current Vent Settings` $\rightarrow$ `Oxygenation Index Calculation` $\rightarrow$ `Weaning Suggestion`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/respiratory/care/vent-settings`: Log PEEP, FiO2, Tidal Volume, and Mode.
    - `POST /api/respiratory/care/abg`: Log pH, pO2, pCO2, and HCO3.
- **ERD Extensions:**
    - Table `respiratory_vent_logs`: (id, patient_id, tenant_id, mode, peep, fio2, tidal_volume, respiratory_rate).
    - Table `respiratory_abg_logs`: (id, patient_id, tenant_id, ph, po2, pco2, hco3, spo2).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `VentilationCommandCenter`**
    - **Vent-Symmetry View:** Visual comparison of current settings vs. target settings.
    - **ABG Trendline:** Graph showing pH and pCO2 trends over time.
- **User Story:** "As a Respiratory Therapist, I want to log the latest ABG and have the AI suggest if the patient is ready for weaning from the ventilator."

### 5. QA & Compliance
- **Unit Tests:** `test_abg_interpretation()`: Verify that the AI correctly identifies Respiratory Acidosis/Alkalosis.
- **Compliance:** Alignment with JCI standards for critical care respiratory support.
