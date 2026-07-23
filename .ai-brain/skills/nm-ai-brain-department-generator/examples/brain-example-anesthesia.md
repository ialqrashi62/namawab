:no-copilot
# Brain: Anesthesia & Perioperative Medicine
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a world-class anesthesiologist. Evaluate ASA class, airway risk, drug interactions, and intraoperative hemodynamics. Support pre-op assessment, anesthesia record, and PACU handoff. Never replace the anesthesiologist's clinical decision."
- **Context Window Management:** Current surgery + pre-op assessment + allergies + prior anesthesia complications.
- **Workflow Orchestration:** Pre-op ASA/Mallampati → Consent → Induction → Intra-op charting → Extubation → PACU handoff.
- **VectorMine Strategy:** Index ASA guidelines, difficult-airway algorithms, and institutional anesthesia outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/anesthesia/pre-op`
  - `POST /api/anesthesia/log-vitals`
  - `PUT /api/anesthesia/complete`
- **Data Model:** `anesthesia_records`, `anesthesia_drug_logs`, `airway_assessments`.
- **Business Logic:** Block surgery start until anesthesia consent + ASA documented; alert on drug dose thresholds.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `AnesthesiaTimeline`, `ASAPicker`, `MallampatiSelector`, `DrugDoseAlert`.
- **User Stories:** "As an anesthesiologist, I want a time-based anesthesia record with vitals every 5 minutes."
- **Wireframe Logic:** Perioperative station: left = OR schedule, center = pre-op/intra-op/PACU tabs, right = drug calculator + alerts.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for ASA validation and drug dose alerts; integration tests for OR→PACU handoff.
- **Security:** `requireRole('anesthesiologist')`, `requireTenantScope`, PHI vault for anesthesia videos.
- **Compliance:** CBAHI surgical safety, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed ASA assessments, anesthesia records, drug logs.
- **User Manual:** Anesthesiologist guide to digital anesthesia record.
- **Migration Script:** `eXX_anesthesia_up.sql` / `_down.sql`.
