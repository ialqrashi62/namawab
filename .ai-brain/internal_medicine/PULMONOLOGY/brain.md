# Brain: Pulmonology & Respiratory Medicine
## Cognitive Core: Ultra-Specialized Pulmonary Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a pulmonologist and respiratory care specialist. Diagnose and manage asthma, COPD, ILD, pulmonary hypertension, sleep-disordered breathing, and chronic respiratory failure. Interpret spirometry, ABG, chest imaging, and sleep studies using GOLD/GINA/ATS/ERS/AASM guidelines."
- **Context Window Management:** Current encounter + PFT history + ABG trends + inhaler compliance + exacerbation diary + oxygen saturation logs.
- **Workflow Orchestration:** Referral/Triage → PFT/ABG/Imaging/Sleep Study → Diagnosis → Inhaler/Oxygen/BiPAP/Bronchoscopy → Follow-up → Pulmonary Rehab.
- **VectorMine Strategy:** Index GOLD/GINA, ATS/ERS spirometry standards, AASM sleep guidelines, and institutional PFT reference ranges.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/pulmonology/pft`
  - `POST /api/pulmonology/abg`
  - `POST /api/pulmonology/sleep-study`
  - `POST /api/pulmonology/home-oxygen`
  - `POST /api/pulmonology/bronchoscopy`
- **Data Model:** `pulmonology_pft_studies`, `abg_logs`, `sleep_studies`, `home_oxygen_orders`, `bronchoscopy_logs`.
- **Business Logic:** Auto-interpret FEV1/FVC ratio and GOLD stage; alert on severe hypoxemia (SpO2 < 88% or PaO2 < 55 mmHg); track inhaler compliance and exacerbations; link bronchoscopy biopsies to pathology.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `PFTFlowVolume`, `ABGInterpreter`, `SleepStudyTimeline`, `OxygenOrderForm`, `BronchoscopyReportPanel`.
- **User Stories:** "As a pulmonologist, I want PFT results with automatic interpretation and trend comparison against prior visits."
- **Wireframe Logic:** Pulmonology station: left = patient list + PFT queue, center = flow-volume curves + ABG + imaging + sleep tabs, right = guideline-based action suggestions and oxygen orders.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for FEV1/FVC interpretation and GOLD staging; integration tests with CPOE, functional tests, and pathology.
- **Security:** `requireRole('pulmonologist')` / `requireRole('respiratory_therapist')`, `requireTenantScope`, PHI vault for sleep waveforms and bronchoscopy videos.
- **Compliance:** Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed PFT studies, ABG logs, sleep studies, oxygen orders, bronchoscopy cases.
- **User Manual:** Pulmonologist and respiratory therapist guide to PFT interpretation and oxygen therapy.
- **Migration Script:** `eXX_pulmonology_up.sql` / `_down.sql`.
