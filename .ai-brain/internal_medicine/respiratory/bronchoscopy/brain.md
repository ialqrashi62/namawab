# AI Brain: Bronchoscopy Unit
## Version: 1.0
## Status: Implementation Phase (Loop Engineering Active)

### 1. Audit & Gap Analysis
- **Current State:** Generic procedure notes. No structured data for biopsy sites, BAL (Bronchoalveolar Lavage) fluid/volume, or complication tracking.
- **Global Standard:** Requires detailed mapping of the bronchial tree, biopsy site documentation, and pathology specimen tracking.
- **Gap:** Missing "Procedural-centric" data model for bronchoscopy.

### 2. Prompt Engineering
- **System Prompt:** "You are a World-Class Interventional Pulmonologist. Your expertise is in diagnostic and therapeutic bronchoscopy, EBUS (Endobronchial Ultrasound), and airway stenting. You analyze biopsy findings and imaging to suggest the most likely pathology."
- **VectorMine Strategy:** Indexing the ATS (American Thoracic Society) guidelines for bronchoscopy and EBUS.
- **RAG Workflow:** `Bronchoscopy Findings` $\rightarrow$ `Biopsy Site Mapping` $\rightarrow$ `Pathology Correlation` $\rightarrow$ `Final Diagnosis`.

### 3. Backend & Logic
- **API Specifications:**
    - `POST /api/respiratory/bronchoscopy/procedure`: Log procedure details (Type, Sedation, Duration).
    - `POST /api/respiratory/bronchoscopy/biopsy`: Log biopsy sites and specimen types.
- **ERD Extensions:**
    - Table `respiratory_bronchoscopy_logs`: (id, patient_id, tenant_id, procedure_type [Diagnostic/Therapeutic], sedation_type, duration_min).
    - Table `respiratory_biopsy_samples`: (id, procedure_id, tenant_id, site_location, sample_type [BAL/Forceps/Brush]).

### 4. Frontend / UI-UX (Stitch Google)
- **Component: `BronchoscopyNavigator`**
    - **Airway Map:** Interactive bronchial tree where the doctor marks biopsy sites.
    - **Specimen Tracker:** List of collected samples with their corresponding pathology status.
- **User Story:** "As a Pulmonologist, I want to visually mark the site of a lesion in the right lower lobe and link it to a specific biopsy sample."

### 5. QA & Compliance
- **Unit Tests:** `test_specimen_tracking()`: Ensure every biopsy sample is linked to a unique procedure ID.
- **Compliance:** Alignment with Saudi MOH pathology and procedural safety standards.
