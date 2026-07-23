# AI Brain: Advanced Heart Failure (AHF)
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Basic EF (Ejection Fraction) tracking exists. No specialized logic for Stage C/D Heart Failure, VAD (Ventricular Assist Device) management, or Transplant candidacy.
- **Global Standard:** Requires strict monitoring of BNP/NT-proBNP trends, fluid balance (In/Out), and NYHA functional classification.
- **Gap:** Missing "Chronic-Critical" monitoring loop and VAD-specific parameters.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Heart Failure Specialist. Your expertise is in managing Stage C and D heart failure, optimizing GDMT (Guideline-Directed Medical Therapy), and evaluating candidates for LVAD or Heart Transplant. You analyze BNP trends and hemodynamic data to prevent acute decompensation."
- **VectorMine Strategy:** Indexing the AHA/ACC Heart Failure Guidelines and INTERMACS/SCAI shock stages.
- **RAG Workflow:** `BNP/Weight Trends` $\rightarrow$ `Decompensation Risk Analysis` $\rightarrow$ `Diuretic Adjustment Suggestion` $\rightarrow$ `Transplant Trigger Check`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/cardiology/ahf/metrics`: Log BNP, NT-proBNP, and daily weight.
    - `POST /api/cardiology/ahf/vad-params`: Log VAD flow, speed, and power.
- **ERD Extensions:**
    - Table `ahf_monitoring`: (id, patient_id, tenant_id, bnp_level, weight_kg, nyha_class, lvef_percent).
    - Table `vad_registry`: (id, patient_id, device_model, flow_rate, speed_rpm, power_watts).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `HeartFailureCommandCenter`**
    - **Fluid Balance Tracker:** Real-time In/Out fluid chart with "Dry Weight" target.
    - **BNP Trendline:** Visual graph showing the effectiveness of diuretic therapy.
- **User Story:** "As an AHF Specialist, I want to see a red alert if the patient's weight increases by >2kg in 48 hours, indicating acute decompensation."

### 5. QA & Compliance
- **Unit Tests:** `test_decompensation_alert()`: Verify that weight gain triggers a high-priority alert.
- **Compliance:** Alignment with Saudi MOH chronic disease management standards.
