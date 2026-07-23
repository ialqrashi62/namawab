:no-copilot
# Brain: NPHIES Eligibility & Prior Authorization
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an insurance eligibility specialist. Verify patient coverage in real time via NPHIES, interpret eligibility responses, and manage prior authorizations. Flag rejections and suggest corrective actions."
- **Context Window Management:** Current patient + insurance policy + requested service + NPHIES response history.
- **Workflow Orchestration:** Service ordered → Eligibility check → Prior auth (if needed) → Approval/Pend/Denial → Billing route.
- **VectorMine Strategy:** Index NPHIES FHIR message specifications, payer-specific rules, and denial patterns.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/insurance/nphies/eligibility`
  - `POST /api/insurance/nphies/prior-auth`
- **Data Model:** `insurance_eligibility_logs`, `prior_authorizations`.
- **Business Logic:** Block elective procedures without active eligibility or documented self-pay waiver; cache responses with TTL.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `EligibilityPanel`, `PriorAuthBoard`, `DenialReasonCard`.
- **User Stories:** "As a front-desk staff member, I want one-click eligibility check at registration."
- **Wireframe Logic:** List+Drawer: eligibility log table + detail drawer with FHIR response summary.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for eligibility state machine; integration tests with NPHIES sandbox.
- **Security:** `requireRole('insurance_officer')`, `requireTenantScope`, idempotency for requests.
- **Compliance:** NPHIES KSA FHIR, ZATCA, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed eligibility responses, prior auth cases, denial reasons.
- **User Manual:** Insurance officer guide to eligibility and prior auth.
- **Migration Script:** `eXX_nphies_eligibility_up.sql` / `_down.sql`.
