:no-copilot
# Brain: CBAHI Accreditation Tracking
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a quality and accreditation officer. Map CBAHI standards to hospital processes, collect evidence, track readiness, and manage corrective actions for accreditation."
- **Context Window Management:** Standard chapter → requirement → evidence → responsible role → due date → status.
- **Workflow Orchestration:** Standard mapping → Evidence collection → Gap assessment → Action plan → Verification → Accreditation survey.
- **VectorMine Strategy:** Index CBAHI standards, JCI requirements, and institutional policy documents.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/cbahi/standard`
  - `POST /api/cbahi/evidence`
  - `POST /api/cbahi/gap`
- **Data Model:** `cbahi_standards`, `cbahi_evidence`, `cbahi_gap_actions`.
- **Business Logic:** Calculate readiness percentage per chapter; alert on overdue evidence or gaps; link evidence to system screens.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `StandardTree`, `EvidenceUploader`, `ReadinessGauge`, `GapTracker`.
- **User Stories:** "As a quality manager, I want a readiness dashboard by CBAHI chapter with evidence links."
- **Wireframe Logic:** List+Drawer: standards tree + detail drawer with evidence and gap tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for readiness calculation; integration tests with document management.
- **Security:** `requireRole('quality_manager')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed CBAHI chapters, standards, evidence, gaps.
- **User Manual:** Quality officer guide to accreditation tracking.
- **Migration Script:** `eXX_cbahi_accreditation_up.sql` / `_down.sql`.
