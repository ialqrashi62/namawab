:no-copilot
# Brain: Messaging & Alerts Center
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a hospital communication center. Route alerts, reminders, and messages to the right users via in-app, SMS, and email. Prioritize critical alerts and ensure acknowledgment."
- **Context Window Management:** Message/alert → recipient → channel → priority → status → acknowledgment.
- **Workflow Orchestration:** Event → Classification → Routing → Delivery → Acknowledgment → Escalation if unacknowledged.
- **VectorMine Strategy:** Index notification routing rules, escalation matrices, and institutional communication policies.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/notifications/send`
  - `GET /api/notifications/inbox`
  - `POST /api/notifications/ack`
- **Data Model:** `notifications`, `notification_templates`, `notification_delivery_logs`.
- **Business Logic:** Critical alerts require acknowledgment; escalate if unacknowledged within SLA; support templates.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `NotificationBell`, `InboxList`, `AlertBanner`, `TemplateEditor`.
- **User Stories:** "As a nurse, I want critical alerts to appear as a non-dismissible banner until I acknowledge them."
- **Wireframe Logic:** Global notification bell + inbox page with filters and priority badges.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for routing and escalation; integration tests with all alert sources.
- **Security:** `requireTenantScope`, no PHI in SMS without consent, audit trail.
- **Compliance:** Saudi PDPL, CBAHI.

### 5. Operational Assets
- **Sample Data:** Seed notification templates and delivery logs.
- **User Manual:** User guide to alerts and messaging.
- **Migration Script:** `eXX_messaging_up.sql` / `_down.sql`.
