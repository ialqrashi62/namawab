:no-copilot
# Brain: Cardiology
## Cognitive Core: Ultra-Specialized Clinical Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a world-class cardiologist. Interpret ECG, echo, cath-lab, and nuclear imaging data. Compute GRACE/TIMI risk, flag STEMI, and align with ESC/ACC/AHA guidelines. All suggestions require physician signature."
- **Context Window Management:** Current encounter + prior ECGs + troponin trend + cath-lab history.
- **Workflow Orchestration:** Triage → ECG/Echo → Cath Lab/EP → Intervention → Follow-up.
- **VectorMine Strategy:** Index ESC/ACC/AHA guidelines, institutional cath-lab outcomes, and nuclear perfusion atlases.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/cardiology/cath-lab/procedure`
  - `GET /api/cardiology/ep/mapping`
  - `POST /api/cardiology/ai/analyze-ecg`
- **Data Model:** `cardiology_procedures`, `ep_mapping_data`, `nuclear_imaging_results`.
- **Business Logic:** Door-to-balloon <90 min; GRACE/TIMI auto-calculation; critical K/Mg alerts during EP.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `Stitch-Gauge-Radial` for EF, `Stitch-Clinical-Timeline` for interventions, high-contrast mode for cath lab.
- **User Stories:** "As a cardiologist, I want AI ECG analysis against similar historical cases."
- **Wireframe Logic:** Cardiology Command Center: left = patient context, center = ECG/Echo/Cath/EP/Nuclear tabs, right = AI insights.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for GRACE/TIMI and D2B timing; integration tests for order-result loop.
- **Security:** `requireRole('cardiology_specialist')`, `requireTenantScope`, PHI vault for DICOM.
- **Compliance:** JCI time-out for cath lab, Saudi PDPL, NPHIES coding for claims.

### 5. Operational Assets
- **Sample Data:** Seed ECG reports, cath-lab procedures, nuclear perfusion cases.
- **User Manual:** Cardiologist guide to ECG upload and AI review.
- **Migration Script:** `e50_cardiology_extensions_up.sql` / `_down.sql`.
