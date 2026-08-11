---
name: nm-phase-planner
description: Use when decomposing a roadmap into shippable phases. Loads the canonical pattern: phase → gate → ETA → deliverables. Saves ~80% tokens per planning session.
---

# Phase Planner — Token-Saver

## When to use

Any roadmap needs breaking down:
- "Build 122 departments" → 14 phases of ~9 depts each
- "Add AI co-pilot to all modules" → 5 phases (vector store, RAG, LangChain, frontend, audit)
- "Ship ZATCA compliance" → 4 phases (invoice, cert, XAdES, NPHIES bridge)
- "Migrate to PostgreSQL 16" → 3 phases (test, shadow, cutover)

## Canonical phase structure

```yaml
phase:
  id: PCC_P3_PHASE_X
  name: "Cardiology + Oncology + Pediatrics"
  goals:
    - Ship 3 PCC modules with full stack (engine + router + migration + tests + HTML)
    - Live deploy to Hetzner
    - Smoke test green
  deliverables:
    engines: 3
    routers: 3
    migrations: 3
    tests: 3
    html_pages: 3
    docs: 3
  skills:
    - nm-sql-table-template
    - nm-engine-pattern
    - nm-router-middleware
    - nm-test-suite-default
    - nm-stitch-google
    - nm-deployment-cicd
  agents:
    generator: 1
    tester: 1
    auditor: 1
    deployer: 1
  gates:
    discover:
      check: state.md emitted
      fail_action: retry
    plan:
      check: file list with budget
      fail_action: retry
    code:
      check: all files created
      fail_action: repair
    test:
      check: tests green
      fail_action: repair
    deploy:
      check: live smoke green
      fail_action: rollback
  eta:
    wall_clock_min: 90
    tokens: 180000
  risks:
    - "Live DB migration may fail if patients table not migrated"
    - "PM2 reload may fail if routes have syntax error"
  rollback:
    - "Restore /var/backups/server.js.before-deploy.LATEST"
    - "Restore /var/backups/data.before-deploy.LATEST.sql.gz"
```

## Phase budget template

| Deliverable | Tokens per unit | Units per phase | Subtotal |
|---|---|---|---|
| Engine | 600 | 3 | 1,800 |
| Router | 800 | 3 | 2,400 |
| Migration | 400 | 3 | 1,200 |
| Test | 1,500 | 3 | 4,500 |
| HTML page | 1,500 | 3 | 4,500 |
| Docs | 600 | 3 | 1,800 |
| Agent overhead | 2,000 | 4 | 8,000 |
| **Subtotal** | | | **24,200** |
| Repair loops (×2) | | | 8,000 |
| **Total per phase** | | | **~32K** |

## 14-phase plan (122 departments)

```yaml
phases:
  - id: PCC_P3_01
    name: "Cardiology + Oncology + Pediatrics"
    depts: [cardiology, oncology, pediatrics]
    eta_wall_clock_min: 60

  - id: PCC_P3_02
    name: "Surgery + Pharmacy + Emergency"
    depts: [surgery, pharmacy, emergency]
    eta_wall_clock_min: 60

  - id: PCC_P3_03
    name: "Endocrine + Pulmonology + GI"
    depts: [endocrine, pulmonology, gi]
    eta_wall_clock_min: 60

  - id: PCC_P3_04
    name: "Rheumatology + Orthopedics + Neurology"
    depts: [rheumatology, orthopedics, neurology]
    eta_wall_clock_min: 60

  - id: PCC_P3_05
    name: "Nephrology + OBGYN + Dermatology"
    depts: [nephrology, obgyn, dermatology]
    eta_wall_clock_min: 60

  # ... 9 more phases ...
```

## Decomposition by skill

```
Phase 1 (P3-01):
  load_skill: nm-sql-table-template → 3 migrations
  load_skill: nm-engine-pattern → 3 engines
  load_skill: nm-router-middleware → 3 routers
  load_skill: nm-test-suite-default → 3 tests
  load_skill: nm-stitch-google → 3 HTML pages
  load_skill: nm-deployment-cicd → 1 deploy

Phase 2 (P3-02):
  load_skill: nm-sql-table-template → 3 migrations
  ... (same pattern)
```

## Decomposition by gate

Each phase has 6 gates (Discover → Plan → Code → Test → Commit → Close). Fail at any
gate → repair loop (max 4 attempts) → escalate.

## Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Migration fails on live | medium | high | sandbox first, backup always |
| Engine returns wrong value | low | critical | cite-based tests, golden fixtures |
| Router 500s on first deploy | medium | medium | try/catch wrapper, audit log |
| HTML breaks RTL/LTR | low | low | Material tokens, manual flip tested |
| Smoke test fails after deploy | medium | high | rollback script ready, 5-min SLA |
| Token budget exceeded | medium | medium | skip optional deliverables |

## Token saving

Manual planning = ~400 lines per phase. With template = ~80 lines unique
(deliverables, risks). ~80% reduction.