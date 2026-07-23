# RAG Implementation: Wave 8 (Specialized Diagnostics)
## Contextual Retrieval Mapping

### 1. Complex Biomarker Interpretation
- **Trigger**: `POST /api/diagnostics/lab-panel` (Biomarkers updated).
- **RAG Query**: "Based on the latest guidelines from the American Association for Clinical Chemistry (AACC), how should a combined elevation of Troponin T and NT-proBNP be interpreted in a patient with chronic kidney disease (CKD)?"
- **Expected Context**: 
    - Guideline: AACC / ESC (European Society of Cardiology).
    - Key Section: Biomarker kinetics in renal failure, baseline shifts, and diagnostic thresholds for myocardial infarction in CKD.

### 2. AI-Radiology Validation (DICOM)
- **Trigger**: `POST /api/diagnostics/radiology-ai` (AI interpretation generated).
- **RAG Query**: "What are the BI-RADS (Breast Imaging-Reporting and Data System) criteria for classifying a lesion as Category 4c (High suspicion of malignancy) in mammography?"
- **Expected Context**: 
    - Guideline: ACR (American College of Radiology) BI-RADS Atlas.
    - Key Section: Morphological features of malignancy, spiculation, and density thresholds for Category 4c.

### 3. Molecular Diagnostics & Genomics
- **Trigger**: `POST /api/diagnostics/genomics-panel`.
- **RAG Query**: "What is the clinical significance of the BRCA1 mutation in the context of the NCCN (National Comprehensive Cancer Network) guidelines for risk-reducing mastectomy?"
- **Expected Context**: 
    - Guideline: NCCN Guidelines for Genetic/Familial High-Risk Assessment.
    - Key Section: Mutation prevalence, penetrance rates, and surgical recommendation thresholds.

### 4. Critical Value Notification & Action
- **Trigger**: `POST /api/diagnostics/lab-panel` (critical_flag = true).
- **RAG Query**: "What is the immediate clinical action protocol for a potassium level of $\ge 6.5$ mEq/L (Hyperkalemia) according to the ACLS (Advanced Cardiovascular Life Support) guidelines?"
- **Expected Context**: 
    - la-Surgical logic for critical lab values.
    - Key Section: Calcium gluconate administration, insulin-glucose shift, and urgent dialysis triggers.
