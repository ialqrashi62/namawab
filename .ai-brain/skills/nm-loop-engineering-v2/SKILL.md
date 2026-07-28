# nm-loop-engineering-v2

> **Type:** procedural workflow
> **Loops:** 5 (Discover → Plan → Build → Test → Verify)
> **Max loops before escalation:** 4
> **Token reduction:** ~30% by reusing same context across loops

---

## Description

Iterative 5-loop engineering pattern for any clinical or technical deliverable. Each loop is short, has explicit inputs/outputs, and **increments a single document** rather than re-writing from scratch. After loop 4, escalate to owner; do not loop forever.

## When to use

- Building a department, feature, page, or workflow.
- Refactoring a module, engine, route, or table.
- Audit / gap analysis with concrete remediation.
- Anything where you might "iterate forever" without discipline.

## The 5 loops

```
┌─────────────────────────────────────────┐
│ L1  DISCOVER  (research + audit)        │
│     ↓  findings + gaps                  │
│ L2  PLAN      (design + decisions)      │
│     ↓  design doc + risk register       │
│ L3  BUILD     (code + data + UI)        │
│     ↓  PR-ready artifacts               │
│ L4  TEST      (unit + integration + UAT)│
│     ↓  test report + coverage           │
│ L5  VERIFY    (compliance + signoff)    │
│     ↓  closeout report → owner          │
└─────────────────────────────────────────┘
        (back to L1 if gap found, max 4)
```

## L1 — DISCOVER

**Goal:** Establish facts only. No opinions, no proposals.

**Inputs:** request, current code, current docs, current state.
**Tools:** read, grep, list, query (read-only).
**Outputs:**
- `discovery.md` with 4 sections: current state, related work, gaps, red flags.
- Token budget: 300-600.

**Output template:**
```yaml
discovery:
  date: YYYY-MM-DD
  scope: <one sentence>
  current_state:
    code: <file:line refs>
    docs: <file refs>
    schema: <table refs>
  related_work:
    - <phase id + brief outcome>
  gaps:
    - <id + description + severity (blocker|high|med|low)>
  red_flags:
    - <clinical or security finding>
  questions_for_owner: []
  ready_for_l2: true|false
```

## L2 — PLAN

**Goal:** Decide what to do, in what order, with what risks.

**Inputs:** `discovery.md`, snippets, MASTER_CATALOG_v3, safety rails.
**Tools:** write, edit.
**Outputs:**
- `plan.md` with: approach options (2+), chosen approach + reason, file list, risk register, rollback plan, success criteria.
- Token budget: 400-800.

**Output template:**
```yaml
plan:
  date: YYYY-MM-DD
  approaches:
    - id: A
      summary: <1-2 lines>
      pros: [<list>]
      cons: [<list>]
    - id: B
      summary: <1-2 lines>
      pros: [<list>]
      cons: [<list>]
  chosen: A
  reason: <2-3 lines>
  file_changes:
    - { path: <file>, action: new|modify|delete, lines: <int est> }
    - { path: <file>, action: new|modify|delete, lines: <int est> }
  migrations:
    - { name: <eN_topic_NN>, up: <file>, down: <file>, destructive: false }
  risks:
    - { id: R1, desc: <...>, likelihood: low|med|high, impact: low|med|high, mitigation: <...> }
  rollback:
    steps: [<list>]
    eta: <min>
  success_criteria:
    - <measurable criterion>
  safety_rails_check: [1,2,3,5,9,11,12,13]
  ready_for_l3: true|false
```

## L3 — BUILD

**Goal:** Implement the chosen plan, in full, copy-pasteable, no abbreviations.

**Inputs:** `plan.md`, snippets, safety rails.
**Tools:** write, edit, run tests (local only).
**Outputs:**
- Code files (full, no `// ... rest of code`)
- Migration files (up + down + validate)
- New tests (unit + integration minimum)
- UI artifacts (Stitch layout + AR/EN i18n keys)
- Docs (one-pager per expert)
- Token budget: 600-1500.

**Output template:**
```yaml
build:
  date: YYYY-MM-DD
  files_created:
    - { path: <file>, lines: <int>, purpose: <1 line> }
  files_modified:
    - { path: <file>, diff_lines: <int>, reason: <1 line> }
  migrations:
    - { name: <...>, up_lines: <int>, down_lines: <int>, validated: true|false }
  tests_added:
    - { name: <test_id>, type: unit|integration|e2e, assertions: <int> }
  i18n_keys:
    - { key: <...>, ar: <...>, en: <...> }
  api_contracts:
    - { method, path, body_schema, auth, idempotent }
  build_status: pass|fail
  ready_for_l4: true|false
```

## L4 — TEST

**Goal:** Verify correctness, performance, security, edge cases.

**Inputs:** build artifacts, test plan from L2.
**Tools:** test runner, smoke tests, cross-tenant tests, OWASP checklist, pen-test script.
**Outputs:**
- `test_report.md` with: unit results, integration results, e2e results, coverage %, security findings, red-flag list, performance baseline.
- Token budget: 400-800.

**Output template:**
```yaml
test_report:
  date: YYYY-MM-DD
  unit:
    total: <int>
    pass: <int>
    fail: [<list>]
    coverage_pct: <int>
  integration:
    total: <int>
    pass: <int>
    fail: [<list>]
  e2e:
    total: <int>
    pass: <int>
    fail: [<list>]
  cross_tenant:
    tested: true|false
    pass: <int>
    fail: [<list>]
  security:
    xss_checked: true
    csrf_checked: true
    sql_injection_checked: true
    csp_report_only: true
    rls_enforced: true
    secrets_in_logs: false
  performance:
    p50_ms: <int>
    p95_ms: <int>
    p99_ms: <int>
  red_flags_resolved: true|false
  ready_for_l5: true|false
```

## L5 — VERIFY

**Goal:** Final compliance check, sign-off, closeout.

**Inputs:** all prior loop outputs, compliance matrix, owner acceptance criteria.
**Tools:** review checklist, generate closeout report.
**Outputs:**
- `closeout.md` with: scope recap, what was delivered, what was tested, what was NOT delivered, owner sign-off line, next phase suggestion.
- Token budget: 200-400.

**Output template:**
```yaml
closeout:
  date: YYYY-MM-DD
  status: COMPLETED | BLOCKED | DEFERRED
  scope:
    delivered: [...]
    not_delivered: [...]
  safety_rails:
    applied: [1,2,3,5,9,11,12,13]
    exceptions: []
  compliance:
    jci: pass|fail
    cbahi: pass|fail
    nphies: pass|fail
    zatca: pass|fail
    pdpl: pass|fail
    sfda: pass|fail
  performance: pass|fail
  security: pass|fail
  owner_signoff_required: true
  next_phase: <name>
```

## Loop discipline

- Each loop **increments** the prior output, never rewrites from scratch.
- After **4 iterations** of the same loop without convergence, **escalate to owner** with a clear question and proposed default.
- Never run L3 (build) without a clean L2 (plan) sign-off.
- Never run L5 (verify) without L4 (test) green.
- Owner approval is the only thing that closes a loop into the next phase.

## Safety rails (apply to every loop)

- L1/L2: read-only, no production touch.
- L3: never DROP, never lose RLS, never `pm2 restart` without owner.
- L4: tests must include cross-tenant + security + red-flag scenarios.
- L5: closeout must list what was NOT delivered, never claim success by omission.
