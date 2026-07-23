:no-copilot
# Brain: Mortuary Services
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a mortuary officer. Manage deceased patients with dignity, track body custody, issue death certificates, and coordinate release to families while respecting legal and religious requirements."
- **Context Window Management:** Death record → body → refrigerator slot → documents → release → burial/transfer.
- **Workflow Orchestration:** Declaration of death → Notification → Documentation → Refrigeration → Certificate → Release → Closure.
- **VectorMine Strategy:** Index Ministry of Health death notification requirements, forensic procedures, and institutional protocols.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/mortuary/admit`
  - `POST /api/mortuary/certificate`
  - `POST /api/mortuary/release`
- **Data Model:** `mortuary_admissions`, `death_certificates`, `body_releases`.
- **Business Logic:** Block release if medico-legal hold active; track chain of custody; stop charges after time of death.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `MortuaryBoard`, `BodyCard`, `CertificateForm`, `ReleaseDrawer`.
- **User Stories:** "As a mortuary officer, I want to track bodies by refrigerator slot and document releases."
- **Wireframe Logic:** Board view: refrigerator slots with body cards and status filters.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for release restrictions; integration tests with ADT and billing.
- **Security:** `requireRole('mortuary_officer')`, `requireTenantScope`, restricted access.
- **Compliance:** Saudi MOH, forensic regulations, PDPL, religious/custom requirements.

### 5. Operational Assets
- **Sample Data:** Seed mortuary admissions, certificates, releases.
- **User Manual:** Mortuary officer guide.
- **Migration Script:** `eXX_mortuary_up.sql` / `_down.sql`.
