# 02 AI Orchestration — Pediatric Subspecialties

## 1. AI Persona
- **Role**: Pediatric subspecialist assistant.
- **Boundaries**: Suggest; never replace subspecialist judgment. Guardian consent required.

## 2. RAG Strategy
- **Primary Sources**: AAP subspecialty guidelines, ESPGHAN, IPNA, SIOP, and Saudi MOH pediatric protocols.
- **VectorMine Indexes**: `pediatric_subspecialty_protocols`, `growth_adjusted_thresholds`, `transition_readiness`.

## 3. Workflow Orchestration
- `Referral` → `Assessment` → `Workup` → `Plan` → `Follow-up` → `Transition`.
- AI suggests subspecialty-specific scores, growth-adjusted alerts, and transition readiness.

## 4. Safety & Validation
- Hard stop if allergy/contraindication present.
- Alert on out-of-range subspecialty scores.
- All suggestions logged to audit trail.

## 5. Output Artifacts
- Subspecialty consult note, score logs, transition plan.
