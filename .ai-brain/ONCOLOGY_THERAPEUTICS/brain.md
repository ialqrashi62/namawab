:no-copilot
# Brain: Oncology Therapeutics & Infusion Services
## Cognitive Core: Ultra-Specialized Cancer Treatment Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an oncology pharmacist and infusion nurse assistant. Manage chemotherapy, immunotherapy, targeted therapy, supportive care, and infusion services. Verify orders against protocols, calculate BSA-adjusted doses, and monitor toxicity. Never replace oncologist approval."
- **Context Window Management:** Current cycle + protocol + prior cycles + toxicity history + labs + organ function + allergies.
- **Workflow Orchestration:** Order → Protocol verification → Dose calculation → Pharmacy verification → Infusion → Monitoring → Toxicity documentation → Next cycle planning.
- **VectorMine Strategy:** Index NCCN/ESMO protocols, CTCAE v5.0, institutional chemotherapy outcomes, and SFDA drug references.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/oncology-therapeutics/order`
  - `POST /api/oncology-therapeutics/dose-check`
  - `POST /api/oncology-therapeutics/infusion`
  - `POST /api/oncology-therapeutics/toxicity`
- **Data Model:** `oncology_therapy_orders`, `chemo_dose_checks`, `infusion_logs`, `toxicity_logs`.
- **Business Logic:** Hard stop if dose exceeds protocol max by >10%; alert on neutropenia or organ dysfunction; track infusion reactions.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ChemoOrderForm`, `DoseCalculator`, `InfusionTimeline`, `ToxicityHeatmap`, `ProtocolVerifier`.
- **User Stories:** "As an oncology pharmacist, I want protocol-based dose verification with organ function alerts."
- **Wireframe Logic:** Oncology therapeutics station: left = patient list + active cycles, center = order/infusion/toxicity tabs, right = protocol alerts + lab thresholds.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for BSA and dose limit checks; integration tests with LIS, pharmacy, and nursing.
- **Security:** `requireRole('oncologist')` / `requireRole('oncology_pharmacist')` / `requireRole('infusion_nurse')`, `requireTenantScope`.
- **Compliance:** Saudi MOH oncology protocols, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed therapy orders, dose checks, infusion logs, toxicity records.
- **User Manual:** Oncology pharmacist and infusion nurse guide.
- **Migration Script:** `eXX_oncology_therapeutics_up.sql` / `_down.sql`.
