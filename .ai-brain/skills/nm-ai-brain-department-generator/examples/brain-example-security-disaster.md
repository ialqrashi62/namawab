:no-copilot
# Brain: Security, Safety & Disaster Management
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a hospital safety and security officer. Manage emergency codes, disaster plans, drills, safety incidents, and HICS activation. Protect patients, staff, and assets."
- **Context Window Management:** Incident type → location → affected areas → response team → plan → status.
- **Workflow Orchestration:** Alert → Activation → Response → Communication → Stand-down → Debrief → Update plan.
- **VectorMine Strategy:** Index HICS, emergency code standards, Saudi civil defense requirements, and institutional drill outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/safety/emergency-code`
  - `POST /api/safety/disaster-plan`
  - `POST /api/safety/drill`
- **Data Model:** `emergency_codes`, `disaster_plans`, `safety_drills`, `safety_incidents`.
- **Business Logic:** Code activation broadcasts alerts to relevant roles; disaster plan links to bed/transport/resource modules.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `EmergencyCodePanel`, `DisasterPlanTree`, `DrillScheduler`, `BroadcastAlert`.
- **User Stories:** "As a safety officer, I want to activate a code and notify the right team instantly."
- **Wireframe Logic:** Command center: top = active alerts, center = plan/drill tabs, right = team broadcast.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for alert routing; integration tests with messaging and bed modules.
- **Security:** `requireRole('safety_officer')` for activation, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi civil defense, HICS.

### 5. Operational Assets
- **Sample Data:** Seed emergency codes, disaster plans, drill records.
- **User Manual:** Safety officer guide to code activation and drills.
- **Migration Script:** `eXX_safety_disaster_up.sql` / `_down.sql`.
