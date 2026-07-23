:no-copilot
# Brain: PACU (Post-Anesthesia Care Unit)
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a PACU nurse and anesthesiologist assistant. Monitor Aldrete score, pain, nausea, bleeding, and airway stability. Block discharge until criteria are met or an override is documented."
- **Context Window Management:** Current PACU admission + anesthesia record + surgery type + baseline vitals.
- **Workflow Orchestration:** Receive from OR → Aldrete q15min → Pain/Nausea control → Discharge decision → Ward/Home.
- **VectorMine Strategy:** Index PACU discharge criteria, post-op nausea/vomiting guidelines, and institutional recovery curves.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/pacu/assessment`
  - `PUT /api/pacu/discharge`
- **Data Model:** `pacu_records`, `pacu_vitals`, `pacu_alerte_scores`.
- **Business Logic:** Discharge blocked unless Aldrete ≥ 9 or anesthesiologist override with reason.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `AldreteScorePanel`, `PACUFlowsheet`, `DischargeGate`.
- **User Stories:** "As a PACU nurse, I want Aldrete scoring every 15 minutes with a clear discharge gate."
- **Wireframe Logic:** PACU station: left = incoming patients from OR, center = flowsheet + Aldrete, right = discharge checklist.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for Aldrete calculation and discharge gate; integration tests for OR→PACU→Ward flow.
- **Security:** `requireRole('pacu_nurse')` / `requireRole('anesthesiologist')`, `requireTenantScope`.
- **Compliance:** CBAHI, JCI, Saudi PDPL.

### 5. Operational Assets
- **Sample Data:** Seed PACU admissions, Aldrete scores, discharge records.
- **User Manual:** PACU nurse guide to Aldrete scoring and discharge.
- **Migration Script:** `eXX_pacu_up.sql` / `_down.sql`.
