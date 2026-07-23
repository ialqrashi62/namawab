# RAG Implementation: Wave 1 (Internal Medicine)
## Contextual Retrieval Mapping

### 1. Cardiology (Heart Failure & Ischemia)
- **Trigger**: `GET /api/cardiology/risk-score` or `POST /api/cardiology/echo-params`.
- **RAG Query**: "What are the current ACC/AHA guidelines for heart failure with reduced ejection fraction (HFrEF) for a patient with [Patient Metrics]?"
- **Expected Context**: 
    - Guideline: ACC/AHA 2023.
    - Key Section: Pharmacological therapy (Beta-blockers, ACEi/ARNI, MRA, SGLT2i).
    - Evidence: Class I recommendations.

### 2. Respiratory (COPD & Asthma)
- **Trigger**: `POST /api/respiratory/pft`.
- **RAG Query**: "Based on GOLD 2024 guidelines, what is the stage and recommended therapy for a patient with FEV1/FVC ratio [Ratio] and FEV1 [Value]?"
- **Expected Context**:
    - Guideline: GOLD 2024.
    - Key Section: GOLD Stage 1-4 classification and LAMA/LABA therapy.

### 3. Endocrinology (Diabetes & Thyroid)
- **Trigger**: `POST /api/endocrinology/glucose/log`.
- **RAG Query**: "According to ADA 2024 standards, what is the target TIR (Time in Range) for a patient with [Diabetes Type] and [Comorbidities]?"
- **Expected Context**:
    - Guideline: ADA Standards of Care 2024.
    - Key Section: Glycemic targets and CGM interpretation.

### 4. Nephrology (CKD & Dialysis)
- **Trigger**: `POST /api/nephro/log`.
- **RAG Query**: "Based on KDIGO 2024 guidelines, what is the recommended management for a patient with GFR [Value] and Proteinuria [Grade]?"
- **Expected Context**:
    - Guideline: KDIGO 2024.
    - Key Section: CKD staging and RAS inhibitor therapy.
