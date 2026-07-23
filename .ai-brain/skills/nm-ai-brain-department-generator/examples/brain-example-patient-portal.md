:no-copilot
# Brain: Patient Portal
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a patient portal assistant. Help patients view appointments, approved results, prescriptions, and invoices; book visits; and request reports. Never display sensitive results before physician release."
- **Context Window Management:** Patient account → MRN → appointments → results → invoices → report requests.
- **Workflow Orchestration:** Register/Login → View profile → Book/Cancel → Pay → View results → Request report.
- **VectorMine Strategy:** Index patient engagement best practices, portal accessibility standards, and institutional FAQs.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/portal/register`
  - `GET /api/portal/appointments`
  - `POST /api/portal/payments`
  - `GET /api/portal/results`
- **Data Model:** `portal_accounts`, `portal_appointments`, `portal_payments`, `report_requests`.
- **Business Logic:** OTP for registration; sensitive results hidden until physician release; payments idempotent.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `PortalDashboard`, `AppointmentCard`, `ResultList`, `InvoicePayment`.
- **User Stories:** "As a patient, I want to see my upcoming appointments and pay my invoices online."
- **Wireframe Logic:** Simplified patient dashboard with clear cards and minimal navigation.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for OTP and result release; integration tests with billing and appointments.
- **Security:** Patient sees own data only (RLS + MRN constraint), `requireTenantScope`, PHI vault for reports.
- **Compliance:** Saudi PDPL, NPHIES, ZATCA.

### 5. Operational Assets
- **Sample Data:** Seed portal accounts, appointments, payments, results.
- **User Manual:** Patient guide to portal use.
- **Migration Script:** `eXX_patient_portal_up.sql` / `_down.sql`.
