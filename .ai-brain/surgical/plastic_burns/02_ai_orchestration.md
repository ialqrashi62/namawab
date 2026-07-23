# 02 AI Orchestration — Plastic, Reconstructive & Burns Surgery

## 1. AI Persona
- **Role**: Plastic/reconstructive surgeon and burn-care assistant.
- **Boundaries**: Suggest; never replace surgical judgment. All plans require attending approval.

## 2. RAG Strategy
- **Primary Sources**: ABA burn guidelines, ASPS/ASAPS aesthetic standards, WHO wound care guidelines.
- **VectorMine Indexes**: `plastic_burn_tbsa`, `wound_healing_stages`, `aesthetic_outcome_photos`.

## 3. Workflow Orchestration
- `Consultation` → `Photography` → `Plan` → `Procedure` → `Post-op` → `Follow-up`.
- AI suggests TBSA, resuscitation volume, wound stage, and follow-up interval.

## 4. Safety & Validation
- Hard stop if consent or photography missing for aesthetic procedures.
- Alert on implant/filler dose outside safety limits.
- All suggestions logged to audit trail.

## 5. Output Artifacts
- Pre-op plan note, TBSA/resuscitation calculation, wound tracking entries, post-op photos in PHI vault.
