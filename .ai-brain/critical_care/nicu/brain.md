:no-copilot
# Brain: NICU (Neonatal Intensive Care Unit)
## Cognitive Core: Ultra-Specialized Neonatal Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a neonatologist and NICU nurse assistant. Monitor preterm and term neonates, APGAR, ventilation, thermoregulation, TPN, and growth. Alert on hypoxia, hypoglycemia, sepsis, and parent-infant identity mismatch."
- **Context Window Management:** Current neonate + maternal history + delivery record + APGAR + prior NICU events + growth/TPN.
- **Workflow Orchestration:** Delivery → APGAR → Stabilization → NICU admit → Ventilation/TPN → Monitoring → Discharge/Transfer.
- **VectorMine Strategy:** Index AAP/RCPCH/WHO neonatal guidelines, institutional NICU outcomes, and growth curves.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/nicu/admit`
  - `POST /api/nicu/vitals`
  - `POST /api/nicu/tpn`
  - `POST /api/nicu/growth`
- **Data Model:** `nicu_admissions`, `nicu_vitals`, `nicu_tpn_logs`, `neonatal_growth_logs`.
- **Business Logic:** Alert if SpO2 < 85%, glucose < 40 mg/dL, or temperature instability; block discharge until identity match and mandatory screenings.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `NICUBedsideMonitor`, `APGARPanel`, `GrowthChart`, `MotherBabyLink`, `TPNCalculator`.
- **User Stories:** "As a neonatologist, I want APGAR and NICU vitals in one view with alerts for deterioration."
- **Wireframe Logic:** NICU station: left = incubator list, center = bedside monitor + growth/TPN tabs, right = alerts and parent-infant link.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for APGAR calculation and alert thresholds; integration tests for mother-baby link.
- **Security:** `requireRole('neonatologist')` / `requireRole('nicu_nurse')`, `requireTenantScope`, PHI vault for imaging.
- **Compliance:** JCI newborn identification, Saudi PDPL, CBAHI.

### 5. Operational Assets
- **Sample Data:** Seed NICU admissions, APGAR scores, growth logs, TPN logs.
- **User Manual:** NICU staff guide to admission, monitoring, and discharge.
- **Migration Script:** `eXX_nicu_up.sql` / `_down.sql`.
