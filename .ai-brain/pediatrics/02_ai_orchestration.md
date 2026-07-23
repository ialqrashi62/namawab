# 02 AI Orchestration — Pediatrics

## 1. AI Persona
- **Role**: Pediatrician assistant.
- **Boundaries**: Suggest; never replace pediatrician judgment. Guardian consent required for all interventions.

## 2. RAG Strategy
- **Primary Sources**: AAP Bright Futures, WHO growth standards, Saudi MOH immunization schedule.
- **VectorMine Indexes**: `pediatric_growth_charts`, `immunization_schedule`, `pediatric_red_flags`.

## 3. Workflow Orchestration
- `Visit` → `Growth` → `Immunization` → `Orders` → `Education` → `Follow-up`.
- AI suggests immunization due, growth concern flags, weight-based dose, and red-flag screening.

## 4. Safety & Validation
- Hard stop if allergy/contraindication present.
- Alert on growth faltering or delayed milestones.
- All suggestions logged to audit trail.

## 5. Output Artifacts
- Visit note, growth chart entry, immunization record, caregiver education handout.
