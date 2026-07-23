# nm-ai-brain-multi-agent

## Description
Multi-agent orchestration skill for NamaMedical `.ai-brain` generation. Use this skill when the user asks for "multi-agent", "panel of experts", or wants parallel expert voices for each department.

## When to use
- Large department specs requiring multiple expert perspectives.
- User explicitly requests CMO + AI Engineer + Architect + UX + Compliance + DevOps voices.

## Agent roster
| Agent | Voice | Output file | Responsibility |
|-------|-------|-------------|----------------|
| CMO | Clinical authority | `01_clinical_spec.md` | Scope, patient journey, CDS, safety gates |
| Lead AI Engineer | RAG/LLM architect | `02_ai_orchestration.md` | Persona, RAG strategy, LangChain chains, guardrails |
| Principal Software Architect | Backend/ERD/API | `03_technical_arch.md` | Endpoints, data model, integrations, RLS |
| Product Manager & UX Lead | UI/UX | `04_ux_ui_stitch.md` | Stitch tokens, user stories, wireframes |
| Compliance & Quality Officer | Governance | `05_compliance_security.md` | JCI/PDPL/CBAHI, RBAC, audit, PHI |
| DevOps Lead | Delivery | `06_implementation_plan.md` | Phases, migrations, QA, deployment |
| Master Orchestrator | Synthesizer | `brain.md` | Unified 5-section cognitive core |

## Workflow
1. Load canonical references once (`nm-ai-brain-department-generator`).
2. For each department, run the 6 agents in parallel conceptually.
3. Master Orchestrator synthesizes into `brain.md`.
4. Emit 01-06 files with single expert voice each.

## Token rules
- Agents share `skills/shared/snippets.md`; no re-explaining RLS/PHI/Stitch.
- Reference canonical docs by name/section only.
- Batch similar departments to share context.

## Safety rails
- Planning-only unless frontend-bridge is explicitly invoked.
- No secrets, no PHI, no production deploy commands.
