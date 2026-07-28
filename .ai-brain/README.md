# .ai-brain/ — README

> **Two layouts, one source of truth.** This directory contains:
> 1. The **existing** `.ai-brain/00_SYSTEM/...14_OBSERVABILITY/` layout
>    (62 modules × ~36 files = 2,228 files, built 2026-07-22/23, in active use).
> 2. The **new** `.ai-brain/99-state/, 00-orchestrator/, 01-requirements/...`
>    layout, added 2026-07-24 per the master builder prompt v1.0.
>
> The new layout is currently **parked** pending owner decisions
> (see `DECISIONS_PENDING.md`). The existing layout remains the live,
> in-use blueprint.

## TL;DR

| Question | Answer |
|---|---|
| Where is the live app? | `../namaweb/` (Express + Vanilla JS + PostgreSQL, deployed at jumanasoft.com) |
| Where is the active blueprint? | `./00_SYSTEM/MASTER_PROMPT_v3.md` + `./02_MODULES/<id>/` (62 modules) |
| Where is the new master prompt? | `./00-orchestrator/MASTER-PROMPT.md` (verbatim, parked) |
| Where is the state file? | `./99-state/current-phase.json` |
| Where are the owner decisions? | `./DECISIONS_PENDING.md` |
| Where is the repo memory? | `/memories/repo/remediation_state.md` |
| Where is the runbook? | `./MASTER_RUNBOOK.md` + `./AUTOPILOT_RUNBOOK.md` + `./LOOP_ENGINEERING_PLAYBOOK.md` |

## Layout map

```
.ai-brain/
├── 00_SYSTEM/                 ← EXISTING (active): engine, prompts, templates
│   ├── MASTER_PROMPT_v3.md
│   ├── PROMPT_ENGINE_v2.yaml
│   └── DEPT_TEMPLATE.yaml
│
├── 01_DATA/CATALOG.yaml       ← EXISTING (active): 186 dept IDs across 10 groups
│
├── 02_MODULES/                ← EXISTING (active): 62 per-dept blueprints × ~36 files
│   ├── ER-001/  MICU/  OBG-001/  PEDS-002/  SURG-001/  CARD-001/  PULM-001/  ...
│   └── (47 more)
│
├── 03_AUTOPILOT/              ← EXISTING (active): pipeline
├── 04_EXAMPLES/               ← EXISTING (active): worked examples
├── 05_SHARED/                 ← EXISTING (active): infra, design system, compliance
├── 06_SHARED/                 ← EXISTING (active): AI observability
├── 07_DEPLOY/                 ← EXISTING (active): deploy runbooks
├── 08_TESTING/                ← EXISTING (active): test plans
├── 09_DOCS/                   ← EXISTING (active): generated docs
├── 10_COMPLIANCE/             ← EXISTING (active): CBAHI, NPHIES, SFDA, PDPL
├── 11_TRAINING/               ← EXISTING (active): training materials
├── 12_DATA/                   ← EXISTING (active): data assets
├── 13_AGILE/                  ← EXISTING (active): agile artefacts
├── 14_OBSERVABILITY/          ← EXISTING (active): observability
│
├── ─── NEW LAYOUT (parked, awaiting owner decisions) ───
│
├── 99-state/                  ← NEW: state of the master-prompt-v1.0 effort
│   └── current-phase.json
│
├── 00-orchestrator/           ← NEW: orchestrator files
│   ├── MASTER-PROMPT.md       (verbatim copy of the new master prompt v1.0)
│   └── TOKEN-BUDGET.yaml
│
├── 01-requirements/           ← NEW: requirements
│   └── medical-departments-tree.yaml  (38 depts, DEP-001..DEP-038)
│
├── 03-database/schemas/       ← NEW: empty until Phase 1 unlocks
├── 04-backend/                ← NEW: empty until Phase 2 unlocks
├── 05-frontend/               ← NEW: empty until Phase 3 unlocks
├── 06-vector-rag/             ← NEW: empty until Phase 4 unlocks
├── 07-devops/                 ← NEW: empty until Phase 5 unlocks
├── 08-testing/                ← NEW: empty until Phase 7 unlocks
├── 09-docs/                   ← NEW: empty until Phase 8 unlocks
├── 10-compliance/             ← NEW: empty until Phase 6 unlocks
├── 11-security/               ← NEW: empty until Phase 6 unlocks
├── 12-project-mgmt/           ← NEW: empty until Phase 9 unlocks
├── 13-business/               ← NEW: empty until Phase 9 unlocks
│
├── DECISIONS_PENDING.md       ← NEW: owner decisions required (read this first)
├── .gitignore                 ← NEW: inner .gitignore (no PHI, no secrets, no IaC state)
└── README.md                  ← NEW: this file
```

## How to read the state file

```bash
# Linux/macOS/Git-Bash
cat .ai-brain/99-state/current-phase.json | head -60
jq .current_phase .ai-brain/99-state/current-phase.json
jq .next_action.owner_required .ai-brain/99-state/current-phase.json

# PowerShell
Get-Content .ai-brain/99-state/current-phase.json
```

Look for:
- `current_phase.status` — should be `in_progress` only when an agent is actively working
- `next_action.owner_required` — must be `true` between phases
- `layouts.active` — currently `alongside` (no migration)
- `actual_remediation_state.phase_3_status` — should be `deployed_live` until the next major push

## How to add a file in the new layout

1. **Read** `99-state/current-phase.json` to confirm you're allowed in the current phase.
2. **Read** `DECISIONS_PENDING.md` and confirm no decision blocks your action.
3. **If blocked**, do not write the file. Add a note to `DECISIONS_PENDING.md` and stop.
4. **If unblocked**, write the file with:
   - A header that names the phase, task ID, and date.
   - The "BLUEPRINT v2 — informational, not yet live" banner if it's a
     fastapi/next.js/langchain file (until the owner ratifies the stack).
   - A footer that updates `99-state/current-phase.json` `session_tasks` entry.
5. **Update** `99-state/current-phase.json` to mark the task done.

## Safety rails (binding)

You may not write a file that violates any of:

- AGENTS.md §2.2 #1 — no hardcoded secrets
- AGENTS.md §2.2 #2 — no PHI in tracked files
- AGENTS.md §2.2 #5 — tenant isolation stays on (`requireTenantScope` + RLS)
- AGENTS.md §2.2 #7 — PHI at rest stays encrypted (`crypto_envelope` DPAPI KEK)
- AGENTS.md §2.2 #8 — CSP report-only by default
- AGENTS.md §2.2 #12 — no print of secrets/PHI in logs
- AGENTS.md §2.2 #13 — Golden Access Rule
- AGENTS.md §2.4 — owner authorization for live-server, schema, runbook, push, merge, .env, AGENTS.md, .ai_rules changes
- AGENTS.md §3 + .ai_rules §4 — phase-by-phase, one phase per session, explicit owner "go" required

## How to halt

If you realize mid-task that you're in the wrong phase, or you hit a
blocking decision you can't resolve: write a closeout to
`.ai-brain/00-orchestrator/CLOSE-OUT-<date>.md` (one screen of markdown)
and update `99-state/current-phase.json` to mark the task blocked. Do
not continue. Do not write a partial file.
