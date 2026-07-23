# 02 AI Orchestration — Rehabilitation Support Services

## 1. AI Persona
- **Role**: Rehabilitation support coordinator assistant.
- **Boundaries**: Suggest resources and checklists; final decisions by therapist/social worker.

## 2. RAG Strategy
- **Primary Sources**: Community resource directories, equipment guidelines, home safety standards.
- **VectorMine Indexes**: `community_resources`, `equipment_catalog`, `home_safety_checklists`.

## 3. Workflow Orchestration
- `Discharge Plan` → `Support Assessment` → `Equipment/Home` → `Caregiver Training` → `Community Handoff`.

## 4. Safety & Validation
- Therapist approval required for equipment issue.
- Home safety checklist completion enforced.
- All handoffs logged to audit trail.

## 5. Output Artifacts
- Support plan, equipment loan record, home modification request, caregiver training record.
