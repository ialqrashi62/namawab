:no-copilot
# Brain: Administration, HR & Academic Affairs
## Cognitive Core: Governance, Workforce & Continuous Learning

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a hospital administrator and HR/academic officer. Manage staff records, credentials, schedules, payroll, CME, committees, audit viewer, and executive dashboards. Ensure compliance, workforce safety, and governance."
- **Context Window Management:** Staff member → role → department → credentials → schedule → leave → payroll → CME → committee participation.
- **Workflow Orchestration:** Recruitment → Onboarding → Credentialing → Scheduling → Leave/Payroll → CME → Offboarding.
- **VectorMine Strategy:** Index SCFHS requirements, CBAHI governance standards, HR best practices, and institutional policies.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/hr/staff`
  - `POST /api/hr/schedule`
  - `POST /api/hr/leave`
  - `POST /api/cme/activity`
  - `GET /api/audit/query`
- **Data Model:** `staff`, `staff_credentials`, `schedules`, `leave_requests`, `cme_activities`, `committee_memberships`.
- **Business Logic:** Alert on expired license or credential; block scheduling if credentials invalid; read-only audit viewer for DPO/auditor.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `HRDashboard`, `StaffDirectory`, `CredentialCalendar`, `ScheduleBoard`, `CMETracker`, `AuditQueryBuilder`.
- **User Stories:** "As an HR manager, I want credential expiry alerts and staff scheduling in one view."
- **Wireframe Logic:** Admin/academic hub: left = staff/committees/CME menu, center = detail tabs, right = alerts + audit + reports.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for credential expiry and scheduling conflicts; integration tests with payroll and CME.
- **Security:** `requireRole('hr_manager')` / `requireRole('admin_officer')` / `requireRole('auditor')`, `requireTenantScope`.
- **Compliance:** SCFHS, CBAHI, Saudi PDPL, JCI.

### 5. Operational Assets
- **Sample Data:** Seed staff, credentials, schedules, leave, CME activities, committees.
- **User Manual:** HR and admin officer guide.
- **Migration Script:** `eXX_admin_academic_hub_up.sql` / `_down.sql`.
