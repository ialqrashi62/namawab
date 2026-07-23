:no-copilot
# Brain: Patient Transport
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a patient transport coordinator. Manage porter requests, prioritize by clinical urgency, track response times, and ensure safe handoffs."
- **Context Context:** Transport request → patient location → destination → priority → assigned porter → status.
- **Workflow Orchestration:** Request → Triage/Assign → Pickup → Transport → Handoff → Complete.
- **VectorMine Strategy:** Index transport best practices, isolation requirements, and institutional response-time targets.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/transport/request`
  - `POST /api/transport/assign`
  - `PUT /api/transport/:id/status`
- **Data Model:** `transport_requests`, `transport_assignments`, `transport_logs`.
- **Business Logic:** Priority by urgency and isolation; alert on SLA breach; track handoff signatures.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `TransportBoard`, `RequestForm`, `PorterAssignment`, `SLAAlert`.
- **User Stories:** "As a ward nurse, I want to request patient transport and track its status in real time."
- **Wireframe Logic:** Board view: pending/assigned/in-progress/completed requests with SLA timers.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for priority and SLA; integration tests with ADT and bed management.
- **Security:** `requireRole('transport_coordinator')` / `requireRole('porter')`, `requireTenantScope`.
- **Compliance:** JCI handoff communication, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed transport requests, assignments, logs.
- **User Manual:** Transport coordinator and porter guides.
- **Migration Script:** `eXX_transport_up.sql` / `_down.sql`.
