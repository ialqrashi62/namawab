# AI Brain: Cardiothoracic & Vascular Surgery
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use general surgery tables and add a "Heart/Lung" flag.
- **Adversary's Critique:** "REJECTED. This is clinically negligent. Cardiothoracic surgery requires tracking of CPB (Cardiopulmonary Bypass) times, cross-clamp duration, and pump-head/oxygenator/filter/circuit details. Vascular surgery requires tracking of graft types (Synthetic vs. Autologous) and distal perfusion/runoff/patency checks. A generic surgery table is a failure."
- **Optimizer's Refinement:** Implement a `cardio_thoracic_metrics` table for bypass/clamp times and a `vascular_graft_registry` for graft tracking. Integrate a "Perfusion-Symmetry" AI analysis to monitor limb perfusion post-vascular surgery.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Cardiothoracic and Vascular Surgeon. Your expertise is in CABG, Valve Replacement, Aortic Aneurysm repair, and Lung Resections. You analyze hemodynamic/perfusion data and intra-op imaging to optimize surgical lapped-time and minimize ischemia-reperfusion injury. You must strictly follow STS (Society of Thoracic Surgeons) and SVS (Society for Vascular Surgery) guidelines."
- **VectorMine Strategy:** Indexing STS guidelines, SVS standards, and latest la l-Surgical trials for valve replacement.
- **RAG Workflow:** `Pre-op Hemodynamics` $\rightarrow$ `Surgical Approach Selection` $\rightarrow$ `Bypass/Clamp Monitoring` $\rightarrow$ `Post-op Perfusion Verification`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/surgery/cardio/bypass`: Log CPB start/stop, cross-clamp time, and pump flow.
    - `POST /api/surgery/vascular/graft`: Log graft material, diameter, and location.
    - `GET /api/surgery/cardio/ischemia-risk`: AI-driven risk analysis of ischemia-reperfusion injury.
- **ERD Extensions:**
    - Table `cardio_thoracic_metrics`: (id, procedure_id, tenant_id, cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate).
    - Table `vascular_graft_registry`: (id, procedure_id, tenant_id, graft_type [Synthetic/Autologous], material, diameter, location, patency_check_result).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `CardioSurgCommandCenter`**
    - **Bypass Timer:** High-precision countdown/count-up for cross-clamp and bypass times with critical alerts.
    - **Graft Visualizer:** Interactive map of the arterial tree showing graft locations and patency status.
    - **Hemodynamic Waveform:** Real-time integration of intra-op pressure/flow/oxygenation.
- **User Story:** "As a Lead Surgeon, I need to see the exact cross-clamp time on the HUD to minimize myocardial ischemia."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_clamp_time_alert()`: Trigger alert if cross-clamp time exceeds 60 minutes.
    - `test_graft_registry_link()`: Ensure every graft is linked to a specific procedure and patient.
- **Integration Tests:** Verify that bypass metrics are automatically summarized in the final surgical report.
- **Compliance:** Full alignment with STS and Saudi MOH surgical safety standards.
