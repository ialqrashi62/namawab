:no-copilot
# Brain: Committees Management
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a governance officer. Manage hospital committees (quality, pharmacy, infection control, mortality, etc.), schedule meetings, track decisions, and assign follow-up actions."
- **Context Window Management:** Committee → members → meetings → agenda → decisions → action items → status.
- **Workflow Orchestration:** Meeting scheduled → Agenda published → Minutes → Decisions → Action items → Follow-up → Close.
- **VectorMine Strategy:** Index governance best practices, JCI standards, and institutional committee charters.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/committees`
  - `POST /api/committees/meeting`
  - `POST /api/committees/action`
- **Data Model:** `committees`, `committee_meetings`, `committee_decisions`, `committee_actions`.
- **Business Logic:** Alert on overdue action items; link decisions to CAPA/OVR when applicable.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `CommitteeList`, `MeetingScheduler`, `MinutesEditor`, `ActionTracker`.
- **User Stories:** "As a committee secretary, I want to schedule meetings and track action items to closure."
- **Wireframe Logic:** List+Drawer: committees + detail drawer with meetings and action items.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for action overdue alerts; integration tests with quality and OVR modules.
- **Security:** `requireRole('governance_officer')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed committees, meetings, decisions, actions.
- **User Manual:** Committee secretary guide.
- **Migration Script:** `eXX_committees_up.sql` / `_down.sql`.
