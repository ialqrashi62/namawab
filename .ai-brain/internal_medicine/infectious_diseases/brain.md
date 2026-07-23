# AI Brain: Infectious Diseases & Tropical Medicine
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use a simple list of infections and antibiotic prescriptions.
- **Adversary's Critique:** "REJECTED. This is a dangerous oversimplification. An infectious disease module must handle 'Antimicrobial Stewardship' (AMS). Where is the tracking of antibiotic/antifungal/antiviral durations? Where is the 'Isolation Level' (Contact, Droplet, Airborne) for the nursing station? Where is the integration with the Lab for 'Sensitivity/Antibiogram' analysis?"
- **Optimizer's Refinement:** Implement an `antimicrobial_stewardship` engine that flags prolonged antibiotic use and a `patient_isolation_registry` that syncs with the Nursing Station. Integrate a "Sensitivity-to-Prescription" logic that suggests the narrowest spectrum antibiotic based on the lab's antibiogram.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Infectious Disease Specialist and Epidemiologist. Your expertise is in multi-drug resistant organisms (MDRO), tropical diseases, and hospital-acquired infections (HAI). You analyze culture results, sensitivity/MIC values, and patient comorbidities to suggest the most effective and narrowest antimicrobial therapy. You must strictly follow the Saudi MOH and WHO guidelines for antimicrobial stewardship."
- **VectorMine Strategy:** Indexing the WHO AWaRe (Access, Watch, Reserve) classification, Saudi MOH Infection Control guidelines, and the Sanford Guide.
- **RAG Workflow:** `Culture/Sensitivity Result` $\rightarrow$ `Antibiogram Analysis` $\rightarrow$ `SOW (Surgical/Medical) Context` $\rightarrow$ `Narrow-Spectrum Recommendation` $\rightarrow$ `Isolation Level Assignment`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/infectious/isolation`: Assign and update isolation level (Airborne, Droplet, Contact).
    - `POST /api/infectious/antibiotic-log`: Log antibiotic start/stop dates and dose adjustments.
    - `GET /api/infectious/stewardship-alert`: AI-driven alert for antibiotics exceeding the standard duration.
- **ERD Extensions:**
    - Table `infectious_isolation_logs`: (id, patient_id, tenant_id, isolation_type, room_number, start_date, end_date).
    - Table `antimicrobial_stewardship_logs`: (id, patient_id, tenant_id, drug_name, dose, start_date, stop_date, indication, stewardship_approval).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `InfectionControlCenter`**
    - **Isolation Map:** A visual map of the ward highlighting rooms with active isolation (Color-coded by type).
    - **Antibiotic Clock:** A timeline showing the duration of current antibiotics vs. the recommended duration.
    - **Sensitivity Grid:** A visual matrix of the lab's antibiogram for the current patient.
- **User Story:** "As an Infection Control Officer, I want to see all patients on 'Airborne Isolation' across the facility to ensure PPE compliance."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_isolation_conflict()`: Ensure a patient cannot be in two conflicting isolation types.
    - `test_stewardship_alert()`: Verify that an alert triggers when an antibiotic exceeds 7 days without a review.
- **Integration Tests:** Verify that assigning an isolation level in this module automatically updates the patient's status in the Nursing Station.
- **Compliance:** Full alignment with Saudi MOH and JCI Infection Control standards.
