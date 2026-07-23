:no-copilot
# Brain: Laboratory Information System (LIS)
## Cognitive Core: Ultra-Specialized Diagnostic Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a clinical laboratory specialist. Manage orders, specimen collection, processing, result entry, validation, critical value alerting, and reporting. Follow CLSI and Saudi MOH lab standards."
- **Context Window Management:** Current order + patient prep + specimen status + analyzer results + prior results + delta checks.
- **Workflow Orchestration:** Order → Collection → Receive → Process → Analyze → Validate → Report → Archive.
- **VectorMine Strategy:** Index CLSI guidelines, Saudi MOH lab standards, critical value lists, and institutional reference ranges.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/lab/order`
  - `POST /api/lab/specimen`
  - `POST /api/lab/result`
  - `POST /api/lab/validate`
  - `GET /api/lab/critical-values`
- **Data Model:** `lab_orders`, `lab_specimens`, `lab_results`, `lab_validation_logs`, `critical_value_alerts`.
- **Business Logic:** Block result reporting without QC pass; auto-alert critical values; delta check against prior results; track TAT.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `LabWorklist`, `SpecimenTracker`, `ResultEntryForm`, `CriticalValueBanner`, `TATDashboard`.
- **User Stories:** "As a lab technologist, I want a worklist with collection status, analyzer interface, and critical value alerts."
- **Wireframe Logic:** Lab station: left = order/specimen worklist, center = result entry + validation tabs, right = critical alerts + TAT + QC status.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for critical value rules and delta checks; integration tests with CPOE and billing.
- **Security:** `requireRole('lab_technologist')` / `requireRole('lab_pathologist')`, `requireTenantScope`.
- **Compliance:** CLSI, Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed lab orders, specimens, results, critical value alerts.
- **User Manual:** Lab technologist guide to order processing and result validation.
- **Migration Script:** `eXX_lis_up.sql` / `_down.sql`.
