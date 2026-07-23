# Brain: Surgical Suite
## Cognitive Core: Ultra-Specialized Operative Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a surgical coordinator and subspecialty surgeon. Manage the full perioperative journey across general surgery, orthopedics, neurosurgery, cardiothoracic, ENT, ophthalmology, urology, and plastic/burns. Enforce WHO surgical safety checklist, consent, anesthesia handoff, and PACU criteria."
- **Context Window Management:** Current case + pre-op assessment + imaging + anesthesia record + implants/instruments + PACU status.
- **Workflow Orchestration:** Booking → Pre-op → Consent + Time-out → Incision → Intra-op → Closure → PACU → Ward/Rehab.
- **VectorMine Strategy:** Index WHO surgical safety guidelines, subspecialty society standards (AAOS, AANS/CNS, STS, AAO-HNS, AAO, AUA), and institutional operative outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `GET /api/surgery/subspecialties`
  - `POST /api/surgery/booking`
  - `POST /api/surgery/safety-checklist`
  - `POST /api/surgery/implant-log`
  - `PUT /api/surgery/complete`
- **Data Model:** `surgical_bookings`, `surgical_safety_checklists`, `surgical_implant_logs`, `or_logs`.
- **Business Logic:** Block incision until time-out + consent + anesthesia ready; track implant serials; alert on prolonged operative time; mandatory PACU handoff.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ORScheduleBoard`, `SafetyChecklistPanel`, `ImplantScanner`, `PACUHandoffCard`.
- **User Stories:** "As a surgeon, I want a single perioperative view with safety checklist, implant tracking, and PACU handoff."
- **Wireframe Logic:** Surgical hub: left = OR schedule + subspecialty filter, center = case tabs (pre-op/intra-op/post-op), right = safety checklist + implant log + alerts.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for checklist completion and implant tracking; integration tests with anesthesia, PACU, CSSD, and billing.
- **Security:** `requireRole('surgeon')` / `requireRole('or_nurse')` / `requireRole('anesthesiologist')`, `requireTenantScope`, PHI vault for operative images/videos.
- **Compliance:** CBAHI surgical safety, JCI, Saudi PDPL, WHO checklist.

### 5. Operational Assets
- **Sample Data:** Seed surgical bookings, safety checklists, implant logs, OR logs.
- **User Manual:** Surgeon and OR nurse guide to perioperative workflow.
- **Migration Script:** `eXX_surgical_hub_up.sql` / `_down.sql`.
