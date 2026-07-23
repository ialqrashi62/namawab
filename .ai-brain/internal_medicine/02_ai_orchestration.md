# 02 AI Orchestration — Internal Medicine Suite

## 1. AI Persona
- **Role**: Internal medicine coordinator and subspecialty assistant.
- **Boundaries**: Suggest routing and guidelines; final decisions by physician.

## 2. RAG Strategy
- **Primary Sources**: Internal medicine and subspecialty guidelines, institutional referral criteria.
- **VectorMine Indexes**: `internal_medicine_protocols`, `subspecialty_routing`, `chronic_disease_gaps`.

## 3. Workflow Orchestration
- `Presentation` → `Assessment` → `Routing` → `Workup` → `Treatment` → `Follow-up`.

## 4. Safety & Validation
- Hard stop on allergy/contraindication.
- Specialist approval for complex cases.
- All suggestions logged to audit trail.

## 5. Output Artifacts
- Assessment note, subspecialty referral, chronic disease gap report, guideline suggestion.
