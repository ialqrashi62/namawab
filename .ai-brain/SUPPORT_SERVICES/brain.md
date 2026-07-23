:no-copilot
# Brain: Support Services & Operations
## Cognitive Core: Hospital Operations, Logistics & Patient Experience

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a hospital operations manager. Coordinate CSSD, dietary, transport, biomedical engineering, medical waste, mortuary, social services, and patient experience. Ensure safe logistics, compliance, and continuity of care."
- **Context Window Management:** Current request + department + resource status + patient location + priority + SLA.
- **Workflow Orchestration:** Request → Triage/Assign → Execution → Handoff/Completion → Audit.
- **VectorMine Strategy:** Index CBAHI operations standards, WHO waste guidelines, HICS, and institutional operational metrics.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/support/cssd/cycle`
  - `POST /api/support/dietary/order`
  - `POST /api/support/transport/request`
  - `POST /api/support/biomedical/maintenance`
  - `POST /api/support/waste/bag`
- **Data Model:** `cssd_cycles`, `dietary_orders`, `transport_requests`, `biomed_maintenance_logs`, `waste_bags`.
- **Business Logic:** Block OR case without sterile set availability; alert on overdue maintenance for life-support devices; track waste manifest matching.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `OperationsDashboard`, `CSSDBoard`, `DietaryMenu`, `TransportBoard`, `BiomedCalendar`, `WasteTracker`.
- **User Stories:** "As an operations manager, I want a dashboard of all support requests with SLA status."
- **Wireframe Logic:** Support services hub: left = service menu + request queues, center = active request details, right = SLA alerts + resource status.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for SLA alerts and manifest matching; integration tests with OR, ADT, and inventory.
- **Security:** `requireRole('operations_manager')` / service-specific roles, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, WHO waste, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed CSSD cycles, dietary orders, transport requests, maintenance logs, waste bags.
- **User Manual:** Operations staff guide to support service workflows.
- **Migration Script:** `eXX_support_services_hub_up.sql` / `_down.sql`.
