:no-copilot
# Brain: Functional Diagnostics (ECG / EEG / PFT / Endoscopy)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a functional diagnostics specialist. Manage ECG, EEG, pulmonary function tests, and endoscopy workflows. Capture acquisition parameters, waveforms, and structured reports."
- **Context Window Management:** Current order + patient prep + acquisition data + prior studies + indication.
- **Workflow Orchestration:** Order → Scheduling → Preparation → Acquisition → Interpretation → Report → Billing.
- **VectorMine Strategy:** Index ESC/ACCF ECG criteria, AASM sleep standards, ATS/ERS spirometry guidelines, and ASGE endoscopy reporting.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/functional-tests/ecg`
  - `POST /api/functional-tests/pft`
  - `POST /api/functional-tests/endoscopy`
- **Data Model:** `ecg_studies`, `pft_studies`, `endoscopy_reports`, `eeg_studies`.
- **Business Logic:** Auto-interpret FEV1/FVC ratio; flag critical ECG findings; link endoscopy biopsies to pathology.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ECGWaveform`, `PFTFlowVolume`, `EndoscopyReportForm`.
- **User Stories:** "As a pulmonologist, I want PFT results with automatic interpretation and trend comparison."
- **Wireframe Logic:** List+Drawer: study queue + detail drawer with waveform/report tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for FEV1/FVC interpretation; integration tests with CPOE and billing.
- **Security:** `requireRole('functional_test_specialist')`, `requireTenantScope`, PHI vault for waveforms/videos.
- **Compliance:** JCI, Saudi PDPL, NPHIES coding.

### 5. Operational Assets
- **Sample Data:** Seed ECG, PFT, endoscopy, and EEG studies.
- **User Manual:** Technician guide to acquisition and reporting.
- **Migration Script:** `eXX_functional_tests_up.sql` / `_down.sql`.
