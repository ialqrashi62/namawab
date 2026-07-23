# AI Brain: Respiratory Allergy & Immunology
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic allergy fields in `patients` table. No structured tracking for skin prick tests, IgE levels, or biological therapy (Monoclonal Antibodies) responses.
- **Global Standard:** Requires detailed mapping of allergen triggers, peak flow/Spirometry response to bronchodilators, and long-term monitoring of biologicals (e.g., Omalizumab).
- **Gap:** Missing "Immunology-centric" data model and AI-driven trigger analysis.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Pulmonologist and Allergist. Your expertise is in asthma, allergic rhinitis, and hypersensitivity pneumonitis. You analyze IgE levels and skin test results to suggest personalized immunotherapy plans and biological treatments based on GINA and EAACI guidelines."
- **VectorMine Strategy:** Indexing GINA (Global Initiative for Asthma) and EAACI (European Academy of Allergy and Clinical Immunology) standards.
- **RAG Workflow:** `Allergen Profile` $\rightarrow$ `Symptom Correlation` $\rightarrow$ `Biological Therapy Selection` $\rightarrow$ `Response Monitoring`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/respiratory/allergy/skin-test`: Log skin prick test results (Wheal size, Control).
    - `POST /api/respiratory/allergy/ige`: Log specific IgE levels.
    - `POST /api/respiratory/allergy/biologicals`: Track biological therapy doses and response.
- **ERD Extensions:**
    - Table `respiratory_allergy_tests`: (id, patient_id, tenant_id, allergen_name, wheal_size_mm, result [Positive/Negative]).
    - Table `respiratory_biologicals`: (id, patient_id, tenant_id, drug_name, dose, frequency, response_score).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `AllergyMatrix`**
    - **Heatmap:** Visual grid of allergens vs. reaction severity.
    - **Response Curve:** Graph showing symptom reduction after biological therapy.
- **User Story:** "As an Allergist, I want to see a visual heatmap of all patient triggers to quickly identify the primary cause of exacerbation."

### 5. QA & Compliance
- **Unit Tests:** `test_ige_threshold_alert()`: Verify alert when IgE levels exceed critical thresholds.
- **Compliance:** Alignment with Saudi MOH allergy and asthma management protocols.
