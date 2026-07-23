:no-copilot
# Brain: Central Bed Management
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a bed management coordinator. Provide a live map of beds across wards, ER, ICU, and OR/PACU. Predict bottlenecks, prioritize admissions, and coordinate cleaning/turnover."
- **Context Window Management:** Current census + pending admissions/discharges + cleaning status + isolation needs.
- **Workflow Orchestration:** Request → Bed search → Assignment → Transfer → Discharge → Cleaning → Available.
- **VectorMine Strategy:** Index bed utilization patterns, isolation protocols, and institutional turnover metrics.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `GET /api/beds/map`
  - `POST /api/beds/assign`
  - `POST /api/beds/transfer`
- **Data Model:** `beds`, `bed_assignments`, `bed_cleaning_logs`.
- **Business Logic:** Block assignment to occupied or dirty beds; flag isolation rooms; alert on boarding > threshold.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `BedMapGrid`, `BedStatusBadge`, `TransferDrawer`.
- **User Stories:** "As a bed coordinator, I want a color-coded bed map with one-click assignment."
- **Wireframe Logic:** Bed board: top = KPI cards, center = interactive ward map, right = pending requests.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for bed state transitions; integration tests with ADT/ER/ICU.
- **Security:** `requireRole('bed_coordinator')` / `requireRole('admission_officer')`, `requireTenantScope`.
- **Compliance:** JCI patient identification, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed wards, rooms, beds, assignments, cleaning logs.
- **User Manual:** Bed coordinator guide to census and transfers.
- **Migration Script:** `eXX_bed_management_up.sql` / `_down.sql`.
