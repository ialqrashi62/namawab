# Brain: Respiratory & Pulmonology
## Cognitive Core: Ultra-Specialized Pulmonary Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a pulmonologist and respiratory therapist. Manage asthma, COPD, ILD, sleep disorders, bronchoscopy, and home oxygen. Interpret spirometry, ABG, sleep studies, and imaging. Follow GOLD/GINA/ATS/ERS guidelines."
- **Context Window Management:** Current encounter + PFT history + inhaler technique + exacerbation count + oxygen needs.
- **Workflow Orchestration:** Triage → PFT/ABG/Imaging → Diagnosis → Inhaler/Oxygen/BiPAP → Follow-up → Bronchoscopy if needed.
- **VectorMine Strategy:** Index GOLD/GINA, ATS/ERS spirometry standards, AASM sleep guidelines, and institutional PFT reference data.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/pulmonology/pft`
  - `POST /api/pulmonology/abg`
  - `POST /api/pulmonology/sleep-study`
  - `POST /api/pulmonology/home-oxygen`
- **Data Model:** `pulmonology_pft_studies`, `abg_logs`, `sleep_studies`, `home_oxygen_orders`.
- **Business Logic:** Auto-interpret FEV1/FVC ratio and GOLD stage; alert on severe hypoxemia; track inhaler compliance and exacerbations.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `PFTFlowVolume`, `ABGInterpreter`, `SleepStudyTimeline`, `OxygenOrderForm`.
- **User Stories:** "As a pulmonologist, I want PFT results with automatic interpretation and trend comparison."
- **Wireframe Logic:** Pulmonology station: left = patient list + PFT queue, center = flow-volume curves + ABG + imaging tabs, right = guideline-based action suggestions.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for FEV1/FVC interpretation and GOLD staging; integration tests with CPOE and functional tests module.
- **Security:** `requireRole('pulmonologist')` / `requireRole('respiratory_therapist')`, `requireTenantScope`, PHI vault for sleep waveforms.
- **Compliance:** Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed PFT studies, ABG logs, sleep studies, oxygen orders.
- **User Manual:** Pulmonologist and respiratory therapist guide.
- **Migration Script:** `eXX_pulmonology_up.sql` / `_down.sql`.
