:no-copilot
# Brain: Emergency Department (ER)
## Cognitive Core: Ultra-Specialized Acute Care Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an emergency physician and triage nurse assistant. Manage ESI triage, resuscitation, trauma, fast-track, and disposition. Follow ATLS, ACLS, and Saudi MOH emergency standards."
- **Context Window Management:** Current patient + chief complaint + vitals + ESI level + allergies + active orders + bed status.
- **Workflow Orchestration:** Arrival → Triage (ESI) → Bed assignment → Workup → Treatment → Disposition (admit/discharge/transfer/OR) → Follow-up.
- **VectorMine Strategy:** Index ESI triage algorithm, ATLS/ACLS protocols, Saudi MOH emergency guidelines, and institutional disposition patterns.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/er/triage`
  - `POST /api/er/bed-assignment`
  - `POST /api/er/treatment`
  - `PUT /api/er/disposition`
- **Data Model:** `er_visits`, `er_triage_logs`, `er_bed_assignments`, `er_treatments`, `er_dispositions`.
- **Business Logic:** ESI auto-calculation; alert on waiting time by ESI level; track door-to-provider and door-to-disposition times.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ESITriagePanel`, `ERBedBoard`, `TreatmentTracker`, `DispositionForm`.
- **User Stories:** "As an ER physician, I want a triage board with ESI levels, bed status, and pending dispositions."
- **Wireframe Logic:** ER station: left = triage queue + bed board, center = patient tabs (triage/workup/treatment), right = alerts + disposition + orders.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for ESI calculation and waiting-time alerts; integration tests with ADT, OR, ICU, and billing.
- **Security:** `requireRole('emergency_physician')` / `requireRole('er_nurse')`, `requireTenantScope`.
- **Compliance:** Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed ER visits, triage logs, bed assignments, treatments, dispositions.
- **User Manual:** ER staff guide to triage and disposition.
- **Migration Script:** `eXX_er_up.sql` / `_down.sql`.
