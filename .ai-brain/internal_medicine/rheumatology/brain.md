# AI Brain: Rheumatology & Clinical Immunology
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use a simple list of joint pains and blood markers (RF, anti-CCP).
- **Adversary's Critique:** "REJECTED. Rheumatology is about 'Patterns' and 'Symmetry'. A generic list is useless. We need a 'Joint Mapping System' (Symmetrical vs. Asymmetrical) and a 'Disease Activity Score' (DAS28) that is calculated dynamically. Where is the tracking for Biologic DMARDs and their associated screening (TB/Hepatitis)?"
- **Optimizer's Refinement:** Implement a `joint_activity_map` for visual/numerical tracking of joint swelling/tenderness and a `das28_calculator` engine. Integrate a "Biologic Safety Gate" to ensure screening is done before prescribing TNF-inhibitors.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Rheumatologist and Immunologist. Your expertise is in Systemic Lupus Erythematosus (SLE), Rheumatoid Arthritis (RA), and Vasculitis. You analyze joint counts, inflammatory markers (ESR, CRP), and auto-antibodies to differentiate between inflammatory and degenerative arthritis. You must strictly follow ACR/EULAR classification criteria."
- **VectorMine Strategy:** Indexing ACR (American College of Rheumatology) and EULAR (European Alliance Associations for Rheumatology) guidelines.
- **RAG Workflow:** `Joint Count + Markers` $\rightarrow$ `Classification Criteria Matching` $\rightarrow$ `Disease Activity Scoring (DAS28)` $\rightarrow$ `Therapeutic Escalation Plan`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/rheumatology/joint-map`: Log tenderness and swelling for specific joints.
    - `POST /api/rheumatology/das28`: Calculate and log the Disease Activity Score.
    - `POST /api/rheumatology/biologic-screen`: Log mandatory screening for biological therapy.
- **ERD Extensions:**
    - Table `rheum_joint_logs`: (id, patient_id, tenant_id, joint_name, tenderness_grade [0-3], swelling_grade [0-3]).
    - Table `rheum_activity_scores`: (id, patient_id, tenant_id, das28_score, la28_score, activity_level [Remission/Low/Moderate/High]).
    - Table `rheum_biologic_tracking`: (id, patient_id, tenant_id, drug_name, screening_status, last_dose_date).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `RheumCommandCenter`**
    - **Symmetry Map:** An interactive human silhouette where the doctor marks affected joints (Symmetrical vs. Asymmetrical).
    - **Activity Trendline:** A graph showing DAS28 scores over time to visualize treatment response.
    - **Biologic Gate:** A checklist that prevents prescribing biologics until TB/Hep screenings are marked 'Clear'.
- **User Story:** "As a Rheumatologist, I want to visually map the patient's joint swelling and have the system automatically calculate the DAS28 score."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_das28_calculation()`: Verify the formula (Tender joints, Swollen joints, ESR/CRP, Patient Global Assessment).
    - `test_biologic_gate()`: Ensure the system blocks biological prescriptions if screening is missing.
- **Integration Tests:** Verify that high DAS28 scores trigger a "High Priority" flag in the patient's longitudinal record.
- **Compliance:** Alignment with Saudi MOH and EULAR standards.
