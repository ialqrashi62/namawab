# AI Brain: Dermatology & Cosmetic Surgery
## Version: 2.0 (Swarm Optimized)
## Status: Autonomous Execution Mode

### 1. Adversarial Audit & Gap Analysis
- **Architect's Draft:** Use a simple text field for skin lesions and a photo upload.
- **Adversary's Critique:** "REJECTED. Dermatology is a visual science. A text field is useless. We need 'Anatomical Mapping' (where is the lesion?), 'Morphology Tracking' (size, color, border, elevation), and 'Dermoscopic Analysis'. Where is the tracking for biologicals (e.g., Dupilumab) and their specific side effects?"
- **Optimizer's Refinement:** Implement a `skin_lesion_map` for precise anatomical location and a `morphology_tracker` for longitudinal monitoring of lesion evolution. Integrate an AI-driven "Visual Differential" that suggests possible diagnoses based on morphology.

### 2. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are a World-Class Dermatologist and Cosmetic Surgeon. Your expertise is laencompassing inflammatory dermatoses, skin oncology, and advanced aesthetic procedures. You analyze lesion morphology, dermoscopic patterns, and histopathology to provide precise diagnoses. You must strictly follow AAD (American Academy of Dermatology) and EADV guidelines."
- **VectorMine Strategy:** Indexing AAD guidelines, DermNet NZ, and latest clinical trials on biologicals for psoriasis and atopic dermatitis.
- **RAG Workflow:** `Lesion Morphology + Location` $\rightarrow$ `Dermoscopic Pattern Matching` $\rightarrow$ `Differential Diagnosis` $\rightarrow$ `Biopsy/Treatment Recommendation`.

### 3. Backend & Logic (The Engine)
- **API Specifications (OpenAPI):**
    - `POST /api/dermatology/lesion`: Log a skin lesion (Location, Size, Color, Border, Texture).
    - `POST /api/dermatology/cosmetic/procedure`: Log a cosmetic procedure (Laser, Filler, Botox) with dosage and site.
    - `GET /api/dermatology/evolution`: Retrieve the growth/change history of a specific lesion.
- **ERD Extensions:**
    - Table `dermatology_lesion_logs`: (id, patient_id, tenant_id, anatomical_site, morphology, size_mm, color, border_type, texture).
    - Table `dermatology_cosmetic_logs`: (id, patient_id, tenant_id, procedure_type, product_used, dose_volume, site, session_number).

### 4. Frontend / UI-UX (Stitch Google Style)
- **Component: `DermaCommandCenter`**
    - **Body Map:** An interactive 3D-like human model where the doctor clicks to mark and log lesions.
    - **Morphology Slider:** Visual sliders to define lesion borders (Regular/Irregular) and elevation.
    - **Before/After Gallery:** Side-by-side comparison of cosmetic results with AI-driven change detection.
- **User Story:** "As a Dermatologist, I want to mark a suspicious mole on the patient's back and track its diameter over 6 months to detect early melanoma."

### 5. QA & Compliance (The Judge)
- **Unit Tests:** 
    - `test_lesion_growth_alert()`: Verify that a >50% increase in lesion size triggers a "High Risk" biopsy alert.
    - `test_cosmetic_dose_limit()`: Ensure filler/botox doses stay within safety limits.
- **Integration Tests:** Verify that dermatology biopsies are correctly linked to the Pathology module.
- **Compliance:** Alignment with Saudi MOH and AAD standards.
