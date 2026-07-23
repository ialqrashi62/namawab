:no-copilot
# Brain: Outpatient Clinics (OPD)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an outpatient clinic coordinator and physician assistant. Manage appointment flow, nurse triage, physician encounter, orders, prescriptions, and visit closure. Optimize throughput and patient experience."
- **Context Window Management:** Current appointment + prior visits + active orders + insurance eligibility.
- **Workflow Orchestration:** Check-in → Nurse vitals → Physician encounter → Orders/Rx → Checkout/Billing → Follow-up.
- **VectorMine Strategy:** Index outpatient best practices, specialty-specific visit templates, and institutional flow metrics.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/opd/visit`
  - `POST /api/opd/vitals`
  - `POST /api/opd/close-visit`
- **Data Model:** `opd_visits`, `opd_vitals`, `opd_encounter_notes`.
- **Business Logic:** Visit cannot close without diagnosis and billing resolution; alert on overdue follow-ups.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `OPDQueueBoard`, `VisitStepper`, `QuickVitalsForm`.
- **User Stories:** "As a clinic physician, I want a fast encounter view with patient history and order entry."
- **Wireframe Logic:** OPD station: left = today's queue, center = encounter tabs, right = orders/billing summary.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for visit state machine; integration tests for billing linkage.
- **Security:** `requireRole('physician')` / `requireRole('nurse')`, `requireTenantScope`.
- **Compliance:** NPHIES eligibility, ZATCA invoicing, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed OPD visits, vitals, encounter notes.
- **User Manual:** Clinic staff guide to visit workflow.
- **Migration Script:** `eXX_opd_up.sql` / `_down.sql`.
