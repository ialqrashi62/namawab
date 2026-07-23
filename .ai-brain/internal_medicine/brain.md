# Brain: Internal Medicine Suite
## Cognitive Core: Systemic, Longitudinal Adult Care

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an internal medicine specialist and subspecialty coordinator. Manage adult non-surgical diseases across cardiology, pulmonology, gastroenterology, hepatology, nephrology, endocrinology, rheumatology, dermatology, infectious diseases, and oncology/hematology. Emphasize longitudinal tracking, risk stratification, and guideline-based transitions between primary and specialty care."
- **Context Window Management:** Current encounter + chronic disease registry + prior subspecialty visits + active orders + latest diagnostics.
- **Workflow Orchestration:** Triage → Specialty assignment → Workup → Diagnosis → Treatment/monitoring → Follow-up → Co-management with surgery/ICU when needed.
- **VectorMine Strategy:** Index ESC/ACC/AHA, GOLD/GINA, ACG/AASLD, KDIGO, ADA/Endocrine Society, ACR/EULAR, AAD, WHO/Saudi MOH antimicrobial stewardship, NCCN/ESMO/ASH guidelines.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `GET /api/internal-medicine/subspecialties`
  - `POST /api/internal-medicine/referral`
  - `POST /api/internal-medicine/chronic-registry`
  - `GET /api/internal-medicine/guideline-match`
- **Data Model:** `internal_medicine_referrals`, `chronic_disease_registry`, `subspecialty_encounters`.
- **Business Logic:** Auto-suggest subspecialty based on ICD-10/ICD-11 and active problem list; flag patients lost to follow-up; link all internal-medicine orders to CPOE and results.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `SubspecialtyNavigator`, `ChronicRegistryPanel`, `GuidelineSuggestionCard`, `CoManagementTimeline`.
- **User Stories:** "As an internist, I want a unified view of a patient's chronic conditions and subspecialty encounters so I can coordinate care."
- **Wireframe Logic:** Internal Medicine hub: left = subspecialty menu + patient list, center = longitudinal record + active problems, right = guideline suggestions and pending referrals.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for subspecialty routing and lost-to-follow-up alerts; integration tests with CPOE, LIS, RIS.
- **Security:** `requireRole('internal_medicine_physician')` / `requireRole('subspecialist')`, `requireTenantScope`, PHI vault for imaging and waveforms.
- **Compliance:** Saudi MOH, CBAHI, JCI, PDPL; Golden Access Rule enforced across subspecialties.

### 5. Operational Assets
- **Sample Data:** Seed chronic disease registry entries, subspecialty referrals, encounters.
- **User Manual:** Internist guide to subspecialty coordination and chronic disease tracking.
- **Migration Script:** `eXX_internal_medicine_hub_up.sql` / `_down.sql`.
