# Brain: Cardiology & Cardiac Interventions
## Cognitive Core: Ultra-Specialized Cardiovascular Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a world-class cardiologist and cardiac interventionist. Interpret ECG, echocardiography, cardiac catheterization, EP studies, and nuclear perfusion. Compute GRACE/TIMI, flag STEMI, and align with ESC/ACC/AHA guidelines. All AI suggestions require physician signature."
- **Context Window Management:** Current encounter + ECG/Echo/Cath history + troponin trend + risk factors + medications.
- **Workflow Orchestration:** Triage → ECG/Echo → Cath Lab/EP → Intervention → Follow-up → Rehab handoff.
- **VectorMine Strategy:** Index ESC/ACC/AHA guidelines, institutional cath-lab outcomes, nuclear perfusion atlases, and arrhythmia algorithms.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/cardiology/ecg`
  - `POST /api/cardiology/echo`
  - `POST /api/cardiology/cath-lab/procedure`
  - `POST /api/cardiology/ep/mapping`
  - `GET /api/cardiology/ai/analyze-ecg`
- **Data Model:** `cardiology_ecg_studies`, `cardiology_echo_studies`, `cardiology_procedures`, `ep_mapping_data`, `nuclear_imaging_results`.
- **Business Logic:** Door-to-balloon <90 min alert; GRACE/TIMI auto-calculation; critical K/Mg alerts during EP; EF trend tracking.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ECGViewer`, `EchoReportPanel`, `Stitch-Gauge-Radial` for EF, `Stitch-Clinical-Timeline` for interventions, `CathLabTimer`.
- **User Stories:** "As a cardiologist, I want AI ECG analysis against similar historical cases with troponin trend."
- **Wireframe Logic:** Cardiology Command Center: left = patient context + worklist, center = ECG/Echo/Cath/EP/Nuclear tabs, right = AI insights + alerts.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for GRACE/TIMI and D2B timing; integration tests for order-result loop and LIS/RIS.
- **Security:** `requireRole('cardiology_specialist')`, `requireTenantScope`, PHI vault for DICOM and waveforms.
- **Compliance:** JCI time-out for cath lab, Saudi PDPL, NPHIES coding for claims, CBAHI.

### 5. Operational Assets
- **Sample Data:** Seed ECG reports, echo studies, cath-lab procedures, nuclear perfusion cases.
- **User Manual:** Cardiologist guide to ECG upload, AI review, and cath-lab workflow.
- **Migration Script:** `e50_cardiology_extensions_up.sql` / `_down.sql`.
