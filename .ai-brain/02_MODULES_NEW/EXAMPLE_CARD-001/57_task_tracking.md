# 57 — Task Tracking (CARD-001)

> Owner: ORC · Tier 1

## Format

Use Jira / Linear / GitHub Issues with the following fields:

- **Project:** CARDIO
- **Epic:** CARDIO-Epic-{N} (e.g. CARDIO-Epic-1: Core engine)
- **Story:** CARDIO-{NNN}
- **Subtask:** CARDIO-{NNN}-{SS}
- **Bug:** CARDIO-BUG-{NNN}
- **Spike:** CARDIO-SPIKE-{NNN}

## Status

- `backlog` → `todo` → `in_progress` → `in_review` → `qa` → `done`
- `blocked` (with reason)
- `cancelled` (with reason)

## Priority

- P0: critical, blocks release
- P1: high, must be done
- P2: medium, should be done
- P3: low, nice to have

## Labels

- `cardiology`, `engine`, `ui`, `db`, `rls`, `llm`, `nphies`, `red_flag`, `security`, `compliance`
- `cds`, `gdmt`, `ecg`, `echo`, `cath`, `device`, `hf`, `af`
- `ar-rtl`, `i18n`, `a11y`
- `tier-1`, `tier-2`, `tier-3`

## Epics (CARD-001)

| Epic | Title | Status | Owner |
|------|-------|--------|-------|
| CARDIO-Epic-1 | Cardiology core engine | done | SA + AIE |
| CARDIO-Epic-2 | Migrations + RLS | done | SA + DSL |
| CARDIO-Epic-3 | Routes + middleware | done | SA + DSL |
| CARDIO-Epic-4 | Co-pilot LLM | done | AIE |
| CARDIO-Epic-5 | Red flag activation | done | CMO + SA |
| CARDIO-Epic-6 | NPHIES integration | done | DSL + CQO |
| CARDIO-Epic-7 | Doctor station UI | done | PM/UX |
| CARDIO-Epic-8 | Cath lab report UI | done | PM/UX |
| CARDIO-Epic-9 | HF GDMT optimizer | done | CMO + AIE |
| CARDIO-Epic-10 | Stitch layout | done | PM/UX |
| CARDIO-Epic-11 | Compliance (JCI, ISO, PDPL) | done | CQO |
| CARDIO-Epic-12 | Tests (unit + integration + E2E) | done | ORC + SA |
| CARDIO-Epic-13 | Training + docs | done | PM/UX |
| CARDIO-Epic-14 | Observability (logs, metrics, traces) | done | DSL |
| CARDIO-Epic-15 | Pen test + security review | todo | DSL |
| CARDIO-Epic-16 | Production deploy | todo | DSL |

## Sprint cadence

- 2-week sprints
- Sprint planning: Monday week 1
- Daily standup: 9 AM KSA
- Sprint review: Friday week 2
- Retrospective: Friday week 2

## Definition of Done

- [ ] Code complete + PR approved by 2 reviewers
- [ ] Unit tests pass (>80% coverage on changed files)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Migration up + down + validate
- [ ] No RLS regression
- [ ] No new hardcoded secrets
- [ ] No new PHI in fixtures
- [ ] LLM cost projection within cap
- [ ] i18n keys added (AR + EN)
- [ ] Accessibility check (axe)
- [ ] Documentation updated
- [ ] Owner sign-off (for Tier-1)

## Sample tasks

```
CARDIO-001: Implement cardiology.heartScore engine
  labels: [cardiology, engine, cds]
  status: done
  estimate: 4h
  actual: 3h
  pr: #1234
  ac: [AC-CARD-009-01..10]

CARDIO-002: Implement cardiology.ecgBasic with STEMI detection
  labels: [cardiology, engine, red_flag, ecg]
  status: done
  estimate: 8h
  actual: 6h
  pr: #1235

CARDIO-003: Migration for cardio_encounters + 10 tables
  labels: [cardiology, db, rls, migration]
  status: done
  estimate: 8h
  actual: 8h
  pr: #1236

CARDIO-004: Routes /api/cardiology/encounters
  labels: [cardiology, ui, rls]
  status: done
  estimate: 4h
  actual: 4h
  pr: #1237

CARDIO-005: Co-pilot LLM chain
  labels: [cardiology, llm, rag]
  status: done
  estimate: 16h
  actual: 14h
  pr: #1238

CARDIO-006: NPHIES claim submission
  labels: [cardiology, nphies, money]
  status: done
  estimate: 12h
  actual: 10h
  pr: #1239

CARDIO-007: Red flag activation flow
  labels: [cardiology, red_flag]
  status: done
  estimate: 8h
  actual: 6h
  pr: #1240

CARDIO-008: Stitch layout for doctor station
  labels: [cardiology, ui, stitch]
  status: done
  estimate: 12h
  actual: 14h
  pr: #1241

CARDIO-009: HF GDMT optimizer
  labels: [cardiology, engine, cds, hf]
  status: done
  estimate: 8h
  actual: 8h
  pr: #1242

CARDIO-010: JCI compliance mapping
  labels: [cardiology, compliance, jci]
  status: done
  estimate: 4h
  actual: 3h
  pr: #1243
```

## Tracking tools

- **Sprint board:** Jira / Linear / GitHub Projects
- **Time tracking:** Clockify / Harvest
- **Code review:** GitHub / GitLab
- **CI:** GitHub Actions
- **Coverage:** Codecov
- **LLM eval:** RAGAS + DeepEval + Langfuse
- **Pen test:** OWASP ZAP + Burp
