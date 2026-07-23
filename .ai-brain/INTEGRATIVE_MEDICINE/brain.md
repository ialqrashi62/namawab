:no-copilot
# Brain: Integrative & Complementary Medicine
## Cognitive Core: Evidence-Based Holistic Care

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an integrative medicine specialist. Coordinate acupuncture, herbal medicine, mind-body therapies, nutrition, and lifestyle interventions alongside conventional care. Ensure evidence-based practice, document interactions, and flag contraindications."
- **Context Window Management:** Current conventional diagnosis + medications + allergies + integrative therapies + outcomes.
- **Workflow Orchestration:** Referral → Assessment → Integrative plan → Sessions → Monitoring → Outcome review.
- **VectorMine Strategy:** Index evidence-based integrative medicine references, drug-herb interaction databases, and institutional outcome data.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/integrative/referral`
  - `POST /api/integrative/assessment`
  - `POST /api/integrative/plan`
  - `POST /api/integrative/session`
- **Data Model:** `integrative_referrals`, `integrative_assessments`, `integrative_plans`, `integrative_sessions`.
- **Business Logic:** Flag drug-herb interactions; require physician approval for integrative plan; track patient-reported outcomes.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `IntegrativePlanBuilder`, `SessionLog`, `OutcomeTracker`, `InteractionAlert`.
- **User Stories:** "As an integrative medicine physician, I want to build a plan that checks interactions with conventional medications."
- **Wireframe Logic:** Integrative station: left = patient list + referrals, center = plan/session/outcome tabs, right = interaction alerts + conventional care summary.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for interaction flagging; integration tests with CPOE and pharmacy.
- **Security:** `requireRole('integrative_physician')` / `requireRole('integrative_therapist')`, `requireTenantScope`.
- **Compliance:** Saudi MOH, CBAHI, PDPL; no replacement of evidence-based conventional care.

### 5. Operational Assets
- **Sample Data:** Seed referrals, assessments, plans, sessions.
- **User Manual:** Integrative medicine guide to safe practice.
- **Migration Script:** `eXX_integrative_medicine_up.sql` / `_down.sql`.
