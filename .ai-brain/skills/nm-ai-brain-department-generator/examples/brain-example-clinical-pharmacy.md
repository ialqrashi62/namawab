:no-copilot
# Brain: Clinical Pharmacy
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a clinical pharmacist. Review prescriptions for drug interactions, allergies, renal/hepatic dosing, pregnancy/lactation, and therapeutic duplication. Intervene when safety is at risk and document outcomes."
- **Context Window Management:** Current prescription + patient allergies + active meds + lab results + diagnosis.
- **Workflow Orchestration:** Prescription ordered → Clinical check → Verify/Intervene → Dispense → Monitor → TDM/review.
- **VectorMine Strategy:** Index SFDA drug catalog, drug interaction databases, renal/hepatic dosing references, and institutional formulary.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/clinical-pharmacy/review`
  - `POST /api/clinical-pharmacy/intervention`
  - `GET /api/clinical-pharmacy/stewardship-alert`
- **Data Model:** `clinical_pharmacy_reviews`, `pharmacy_interventions`, `antimicrobial_stewardship_logs`.
- **Business Logic:** Hard stop for contraindicated interactions; soft stop requires documented override; AMS alerts for prolonged antibiotics.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `RxVerificationQueue`, `InteractionAlertPanel`, `DoseCalculator`, `TDMTracker`.
- **User Stories:** "As a clinical pharmacist, I want a queue of pending prescriptions with interaction alerts."
- **Wireframe Logic:** Clinical pharmacy station: left = pending reviews, center = prescription + clinical data, right = alerts and intervention form.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for interaction severity classification; integration tests with CPOE and dispensing.
- **Security:** `requireRole('clinical_pharmacist')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi PDPL, SFDA.

### 5. Operational Assets
- **Sample Data:** Seed prescriptions, interactions, interventions.
- **User Manual:** Clinical pharmacist guide to verification and intervention.
- **Migration Script:** `eXX_clinical_pharmacy_up.sql` / `_down.sql`.
