# AI Brain: General Surgery (Ultra-Specialized)
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use a generic surgery schedule and a post-op note.
- **Adversary's Critique:** "REJECTED. Surgery is not just a 'note'. Where is the WHO Surgical Safety Checklist? Where is the intraoperative tracking (blood loss, anesthesia/wake-up time)? Where is the specific logic for Bariatric or Robotic surgery? A world-class system must track the 'Surgical Journey' from pre-op/marking to recovery."
- **Optimizer's Refinement:** Implement a `surgical_safety_loop` (Pre-op, Intra-op, Post-op) and a `robotic_surgery_metrics` table. Integrate a "Complication Predictor" based on patient comorbidities and surgical duration.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class General Surgeon and Surgical Architect. Your expertise is in minimally invasive, robotic, and open surgeries. You analyze pre-op imaging, intraoperative vitals, and post-op recovery markers to optimize surgical outcomes. You must strictly adhere to WHO Surgical Safety Checklists and Saudi MOH surgical guidelines."
- **VectorMine Strategy:** Indexing WHO Surgical Safety Guidelines, SAGES (Society of American Gastrointestinal and Endoscopic Surgeons) standards, and latest robotic surgery trial data.
- **RAG Workflow:** `Pre-op Assessment` $\rightarrow$ `Surgical Plan Selection` $\rightarrow$ `Intra-op Monitoring` $\rightarrow$ `Post-op Recovery Tracking` $\rightarrow$ `Complication Analysis`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/surgery/safety-checklist`: Log the 3-phase WHO checklist (Sign-in, Time-out, Sign-out).
    - `POST /api/surgery/intra-op`: Log real-time surgical metrics (Blood loss, Tourniquet time, Anesthesia duration).
    - `POST /api/surgery/robotic-metrics`: Log robotic-specific data (Console time, Instrument/Port positions).
- **ERD Extensions:**
    - Table `surgical_safety_checklists`: (id, procedure_id, tenant_id, phase [Pre/Intra/Post], checklist_completed, verified_by).
    - Table `surgical_intra_op_logs`: (id, procedure_id, tenant_id, estimated_blood_loss, actual_blood_loss, anesthesia_start, anesthesia_end).
    - Table `surgical_robotic_logs`: (id, procedure_id, tenant_id, robot_model, console_time_min, port_locations).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `SurgicalCommandCenter`**
    - **Safety Checklist HUD:** A high-visibility overlay that prevents the 'Start' button from being active until the WHO checklist is 100% verified.
    - **Intra-op Dashboard:** Real-time blood loss and time tracking with "Critical Threshold" alerts.
    - **Surgical Journey Map:** A visual timeline from admission $\rightarrow$ marking $\rightarrow$ surgery $\rightarrow$ recovery.
- **User Story:** "As a Lead Surgeon, I want a mandatory digital WHO checklist that ensures the correct site is marked and the correct patient is on the table before the first incision."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_who_checklist_blocker()`: Verify that the procedure cannot be marked 'Started' if the 'Sign-in' phase is incomplete.
    - `test_blood_loss_alert()`: Trigger alert when blood loss exceeds 15% of total blood volume.
- **Integration Tests:** Verify that surgical complications are automatically linked to the `quality_capa` (Corrective and Preventive Action) module.
- **Compliance:** Full alignment with JCI (Joint Commission International) and Saudi MOH surgical safety standards.
