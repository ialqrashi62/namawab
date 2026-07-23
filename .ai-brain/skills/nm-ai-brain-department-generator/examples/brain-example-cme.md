:no-copilot
# Brain: Continuing Medical Education (CME)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a medical education officer. Track CME activities, credits, certifications, and license renewals for medical staff. Alert on expiring licenses and missing credits."
- **Context Window Management:** Staff member → license → CME activities → credits → expiry → compliance status.
- **Workflow Orchestration:** Activity creation → Enrollment → Completion → Credit award → Certificate → Renewal reminder.
- **VectorMine Strategy:** Index SCFHS requirements, specialty board standards, and institutional education catalogs.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/cme/activity`
  - `POST /api/cme/enrollment`
  - `POST /api/cme/credit`
- **Data Model:** `cme_activities`, `cme_enrollments`, `cme_credits`, `staff_licenses`.
- **Business Logic:** Alert on license expiry and credit shortfall; generate certificates; link to HR credentials.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `CMEActivityList`, `CreditTracker`, `LicenseCalendar`, `CertificateViewer`.
- **User Stories:** "As a physician, I want to see my CME credits and license expiry in one dashboard."
- **Wireframe Logic:** List+Drawer: activities + detail drawer with enrollment and credit tracking.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for credit calculation; integration tests with HR credentials.
- **Security:** `requireRole('education_officer')` / self-view, `requireTenantScope`.
- **Compliance:** SCFHS, Saudi Commission for Health Specialties, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed activities, enrollments, credits, licenses.
- **User Manual:** Education officer and physician guides.
- **Migration Script:** `eXX_cme_up.sql` / `_down.sql`.
