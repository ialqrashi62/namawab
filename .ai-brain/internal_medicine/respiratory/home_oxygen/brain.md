# AI Brain: Home Oxygen Therapy
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic "Oxygen" mention in nursing notes. No tracking of device type, flow rate, or home compliance.
- **Global Standard:** Requires tracking of LTOT (Long-Term Oxygen Therapy) compliance, flow rate (L/min), and device maintenance (Concentrator vs. Cylinder).
- **Gap:** Missing "Home-Care" monitoring loop and device management.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Respiratory Care Specialist focusing on Home Oxygen Therapy. Your goal is to optimize oxygen delivery to prevent hypoxia while avoiding oxygen toxicity. You analyze home SpO2 logs and flow rates to suggest adjustments in therapy."
- **VectorMine Strategy:** Indexing the WHO and Saudi MOH guidelines for Home Oxygen Therapy.
- **RAG Workflow:** `Home SpO2 Logs` $\rightarrow$ `Flow Rate Analysis` $\rightarrow$ `Hypoxia Risk Assessment` $\rightarrow$ `Flow Adjustment Suggestion`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/respiratory/home-ox/setup`: Log the device type and initial flow rate.
    - `POST /api/respiratory/home-ox/monitoring`: Log home SpO2 and flow rate checks.
- **ERD Extensions:**
    - Table `respiratory_home_ox_setup`: (id, patient_id, tenant_id, device_type [Concentrator/Cylinder], initial_flow_rate, start_date).
    - Table `respiratory_home_ox_logs`: (id, setup_id, tenant_id, spo2_level, current_flow_rate, compliance_hours).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `HomeOxygenTracker`**
    - **Compliance Gauge:** Visual indicator of how many hours/day the patient uses oxygen.
    - **Flow-SPO2 Correlation:** Graph showing the relationship between flow rate and oxygen saturation.
- **User Story:** "As a Respiratory Therapist, I want to see if the patient's SpO2 remains >90% at the prescribed 2L/min flow rate at home."

### 5. QA & Compliance
- **Unit Tests:** `test_hypoxia_alert()`: Verify that SpO2 < 88% triggers a high-priority alert for the home-care team.
- **Compliance:** Alignment with Saudi MOH home healthcare regulations.
