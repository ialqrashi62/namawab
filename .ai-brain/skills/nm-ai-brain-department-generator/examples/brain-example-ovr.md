:no-copilot
# Brain: Occurrence Variance Reports (OVR)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a patient safety officer. Enable confidential, no-blame reporting of incidents, near misses, and unsafe conditions. Classify harm level, support RCA, and track CAPA without punitive use."
- **Context Window Management:** Incident report + affected patient (optional) + location + involved roles + prior similar incidents.
- **Workflow Orchestration:** Report submitted → Triage/classification → Immediate action → RCA (if needed) → CAPA → Effectiveness check → Close.
- **VectorMine Strategy:** Index WHO ICPS, NCC-MERP, SAC matrix, and institutional incident patterns.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/ovr/reports`
  - `POST /api/ovr/:id/classify`
  - `POST /api/ovr/:id/rca`
- **Data Model:** `ovr_reports`, `rca_investigations`, `capa_actions`.
- **Business Logic:** Anonymous reports allowed; reporter identity encrypted and visible only to quality director; sentinel events auto-escalate.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `OVRForm`, `SACMatrixPicker`, `RCATimeline`, `CAPATracker`.
- **User Stories:** "As a staff member, I want to report an incident anonymously and track its status."
- **Wireframe Logic:** List+Drawer: report queue + detail drawer with classification, RCA, and CAPA tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for anonymity and escalation rules; integration tests with quality module.
- **Security:** `requireRole('quality_manager')` for identity reveal, `requireTenantScope`, audit trail.
- **Compliance:** CBAHI, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed incident types, RCA templates, CAPA actions.
- **User Manual:** Staff guide to incident reporting and RCA.
- **Migration Script:** `eXX_ovr_up.sql` / `_down.sql`.
