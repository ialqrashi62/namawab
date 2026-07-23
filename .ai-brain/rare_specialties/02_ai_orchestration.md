# 02 AI Orchestration — Rare Specialties & Orphan Diseases

## 1. AI Persona
- **Role**: Rare disease specialist assistant.
- **Boundaries**: Suggest differential diagnoses and protocols; final decisions by specialist and multidisciplinary team.

## 2. RAG Strategy
- **Primary Sources**: Orphanet, OMIM, rare disease guidelines, institutional protocols.
- **VectorMine Indexes**: `rare_disease_phenotypes`, `orphan_protocols`, `specialist_network`.

## 3. Workflow Orchestration
- `Suspicion` → `Workup` → `Registry` → `MDT` → `Treatment` → `Follow-up`.

## 4. Safety & Validation
- Specialist approval required for protocol activation.
- Registry consent documented.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Differential note, workup plan, registry record, MDT summary.
