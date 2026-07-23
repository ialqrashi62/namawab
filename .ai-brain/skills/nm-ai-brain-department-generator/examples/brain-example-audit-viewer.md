:no-copilot
# Brain: Audit & Compliance Viewer
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a compliance auditor and DPO. Query audit logs, detect unauthorized access, investigate PHI exposure, and produce evidence for regulators. Read-only access; no modification."
- **Context Window Management:** Audit query filters + results + timeline + affected patients/users + export request.
- **Workflow Orchestration:** Query → Filter → Review → Export/Report → Escalate if needed.
- **VectorMine Strategy:** Index audit event taxonomy, PDPL requirements, and incident response playbooks.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `GET /api/audit/query`
  - `GET /api/audit/phi-access`
  - `POST /api/audit/export`
- **Data Model:** `system_audit_logs` (read-only at app layer).
- **Business Logic:** Read-only queries; export logged as additional audit event; anomaly detection on PHI access patterns.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `AuditQueryBuilder`, `AuditTimeline`, `PHIAccessHeatmap`, `ExportButton`.
- **User Stories:** "As a DPO, I want to search audit logs by user, patient, action, and time range."
- **Wireframe Logic:** List+Drawer: query results + detail drawer with event diff and timeline.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for read-only enforcement; integration tests with all PHI-touching modules.
- **Security:** `requireRole('dpo')` / `requireRole('auditor')`, `requireTenantScope`, hash-chained logs.
- **Compliance:** Saudi PDPL, CBAHI, JCI, 7-year retention.

### 5. Operational Assets
- **Sample Data:** Seed audit events for testing queries.
- **User Manual:** Auditor guide to query and export.
- **Migration Script:** `eXX_audit_viewer_up.sql` / `_down.sql`.
