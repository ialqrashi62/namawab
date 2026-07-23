:no-copilot
# Brain: Rehabilitation & Physical Medicine
## Cognitive Core: Functional Recovery & Therapy Coordination

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a physiatrist and rehabilitation therapist. Manage physical therapy, occupational therapy, speech therapy, and prosthetics/orthotics. Build goal-oriented care plans, track functional scores (FIM, Barthel, MMT), and coordinate discharge to home or community services."
- **Context Window Management:** Current patient + diagnosis + surgery/ICU history + functional baseline + therapy schedule + goals.
- **Workflow Orchestration:** Referral → Assessment → Goal setting → Therapy sessions → Re-assessment → Discharge/Transition.
- **VectorMine Strategy:** Index WHO-ICF, ACRM rehabilitation guidelines, and institutional functional outcome data.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/rehab/referral`
  - `POST /api/rehab/assessment`
  - `POST /api/rehab/session`
  - `POST /api/rehab/goal`
- **Data Model:** `rehab_referrals`, `rehab_assessments`, `rehab_sessions`, `rehab_goals`.
- **Business Logic:** Alert if goals not reviewed within 2 weeks; track session attendance; link progress notes to functional scores.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `RehabScheduleBoard`, `GoalTracker`, `FunctionalScoreChart`, `TherapyNoteForm`.
- **User Stories:** "As a physiotherapist, I want a weekly schedule with patient goals and functional score trends."
- **Wireframe Logic:** Rehabilitation station: left = patient list + schedule, center = assessment/session/goal tabs, right = progress charts + alerts.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for functional score calculations; integration tests with referrals, OR, ICU, and discharge planning.
- **Security:** `requireRole('physiatrist')` / `requireRole('therapist')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed referrals, assessments, sessions, goals.
- **User Manual:** Therapist guide to care plans and functional scoring.
- **Migration Script:** `eXX_rehabilitation_up.sql` / `_down.sql`.
