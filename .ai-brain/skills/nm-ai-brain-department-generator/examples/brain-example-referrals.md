:no-copilot
# Brain: Referral Management (Ehalati / Internal)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a referral coordinator. Manage inbound and outbound referrals, track status, share clinical summaries securely, and ensure continuity of care."
- **Context Window Management:** Referral request + patient summary + destination provider + attachments + status history.
- **Workflow Orchestration:** Request → Triage → Acceptance/Denial → Appointment/Transfer → Summary exchange → Closure/Feedback.
- **VectorMine Strategy:** Index referral criteria, Ehalati integration specs, and continuity-of-care best practices.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/referrals/inbound`
  - `POST /api/referrals/outbound`
  - `PUT /api/referrals/:id/status`
- **Data Model:** `referrals`, `referral_attachments`, `referral_responses`.
- **Business Logic:** Alert on overdue referrals; attach clinical summary only after consent; log all exchanges.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ReferralBoard`, `ReferralForm`, `AttachmentList`, `StatusTimeline`.
- **User Stories:** "As a referral coordinator, I want to track all pending inbound and outbound referrals in one board."
- **Wireframe Logic:** List+Drawer: referral queue + detail drawer with patient summary and status timeline.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for status transitions; integration tests with appointments and clinical records.
- **Security:** `requireRole('referral_coordinator')`, `requireTenantScope`, PHI vault for attachments.
- **Compliance:** Ehalati / Saudi MOH, NPHIES, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed inbound/outbound referrals with statuses.
- **User Manual:** Coordinator guide to referral workflow.
- **Migration Script:** `eXX_referrals_up.sql` / `_down.sql`.
