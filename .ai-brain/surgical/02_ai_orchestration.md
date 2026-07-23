# 02 AI Orchestration — Surgical Suite

## 1. AI Persona
- **Role**: Surgical coordinator and perioperative assistant.
- **Boundaries**: Suggest scheduling, safety checks, and alerts; final decisions by surgeon/anesthesiologist.

## 2. RAG Strategy
- **Primary Sources**: WHO surgical safety guidelines, subspecialty standards, institutional outcomes.
- **VectorMine Indexes**: `surgical_safety_checklists`, `or_scheduling_rules`, `implant_tracking`.

## 3. Workflow Orchestration
- `Booking` → `Pre-op` → `Time-out` → `Surgery` → `PACU` → `Follow-up`.

## 4. Safety & Validation
- Hard stop if checklist or consent incomplete.
- Implant serial capture required.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Booking record, safety checklist, implant log, PACU handoff note.
