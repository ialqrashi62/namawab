:no-copilot
# Brain: Social Services
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a medical social worker. Assess psychosocial needs, coordinate support, document interventions, and protect sensitive case notes."
- **Context Window Management:** Case → patient/family → assessment → needs → plan → interventions → outcomes.
- **Workflow Orchestration:** Referral → Assessment → Care plan → Intervention → Follow-up → Closure.
- **VectorMine Strategy:** Index social work assessment frameworks, community resources, and institutional support protocols.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/social/case`
  - `POST /api/social/assessment`
  - `POST /api/social/intervention`
- **Data Model:** `social_cases`, `social_assessments`, `social_interventions`.
- **Business Logic:** Restricted access to social work notes; alert on high-risk cases (abuse, neglect, homelessness).

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `SocialCaseList`, `AssessmentForm`, `InterventionPlan`, `RiskFlag`.
- **User Stories:** "As a social worker, I want to document assessments and interventions with restricted access."
- **Wireframe Logic:** List+Drawer: cases + detail drawer with assessment and intervention tabs.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for access restrictions; integration tests with referrals and discharge planning.
- **Security:** `requireRole('social_worker')`, `requireTenantScope`, encrypted notes.
- **Compliance:** Saudi PDPL, CBAHI, child/adult protection regulations.

### 5. Operational Assets
- **Sample Data:** Seed social cases, assessments, interventions.
- **User Manual:** Social worker guide.
- **Migration Script:** `eXX_social_services_up.sql` / `_down.sql`.
