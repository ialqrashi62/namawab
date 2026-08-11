---
name: nm-autopilot
description: Use when owner has authorized end-to-end autopilot for a phase/department. Loads the canonical Discover → Plan → Code → Test → Commit → Push → Close pipeline with gates. Saves ~80% tokens per autopilot run.
---

# AUTOPILOT — End-to-End Phase Orchestrator

## When to use

Owner has authorized a full phase rollout (e.g. "ship cardiology, oncology, pediatrics,
surgery" or "ship all PCC P3-IG through P3-NF"). AUTOPILOT runs **without owner
intervention** but **stops on the first failure or escalation**.

## The 7-step pipeline

```
1. DISCOVER → read existing state, list gaps
2. PLAN     → pick files to create, order them
3. CODE     → generate engines, routers, migrations, tests, HTML
4. TEST     → run unit + integration tests
5. COMMIT   → git commit with conventional message
6. PUSH     → git push to ops/.../branch (NOT main)
7. CLOSE    → log to docs/CHANGELOG.md, create closeout doc
```

## Run loop

```bash
# Pseudocode — actual orchestrator lives in .ai-brain/03_AUTOPILOT/autopilot.js
while !autopilot.complete && attempts < MAX_ATTEMPTS (default 4) {
    state = discover(env);
    plan  = buildPlan(state);
    code  = generateCode(plan);
    test  = runTests(code);
    if (!test.pass) { repair(code); continue; }
    commit(code);
    push(branch);
    if (verify(deployed)) { close(); return SUCCESS; }
    repair(deploy);     // loop back
}
if (attempts >= MAX_ATTEMPTS) { escalate(owner); return FAIL; }
```

## Gate criteria (must pass to advance)

| Gate | Pass condition | Fail action |
|---|---|---|
| DISCOVER | state.md emitted with current files/gaps | retry |
| PLAN | list of files to create with budget ≤ 60K tokens | retry |
| CODE | files created, no `...existing code...` shortcuts | retry |
| TEST | all unit + integration green; coverage ≥ 80% | repair |
| COMMIT | git status clean; commit message conventional | retry |
| PUSH | remote shows new commit on ops/.../branch | escalate |
| CLOSE | docs/CHANGELOG.md updated; closeout doc added | retry |

## File budget per run

| Step | Budget (tokens) |
|---|---|
| DISCOVER | 2K |
| PLAN | 3K |
| CODE | 40K |
| TEST | 5K |
| COMMIT/PUSH/CLOSE | 3K |
| Repair loop (up to 3x) | 7K |
| **Total per dept** | **~60K** |

## Config

```yaml
# .ai-brain/03_AUTOPILOT/config.yaml
phase: PCC_P3_PHASE_X
branch: ops/jumanasoft-enterprise-facility-platform-staging-prep
target:
  - cardiology
  - oncology
  - pediatrics
  - surgery
  - pharmacy
  - emergency
  - endocrine
  - pulmonology
  - gi
  - rheumatology
  - orthopedics
  - neurology
  - nephrology
  - obgyn
deliverables:
  engines: 14
  routers: 14
  migrations: 14
  tests: 14
  html_pages: 14
max_attempts: 4
escalate_on: [tenant_breach, missing_secret, blocked_by_external]
```

## Safety rails (enforced)

- ❌ Cannot skip tests
- ❌ Cannot push to `main`, `integration/*`, `audit/*`
- ❌ Cannot edit files in `namaweb-ovr-audit-independent/`
- ❌ Cannot disable tenant isolation
- ❌ Cannot bypass RBAC
- ❌ Cannot add unsafe CSP
- ❌ Cannot delete production data without owner OK

## Escalation triggers

- Tenant breach detected in test → STOP, page owner
- Missing API key/secret → STOP, request from owner
- External service blocked (ZATCA, NPHIES) → STOP, mark as "blocked"
- Max attempts reached → STOP, escalate
- User message interrupts → STOP, return control

## Output

```json
{
  "status": "SUCCESS" | "ESCALATED" | "FAILED",
  "phase": "...",
  "deliverables": { "engines": 14, "routers": 14, "tests": 14, ... },
  "tests_run": 247,
  "tests_passed": 247,
  "commits_pushed": 14,
  "duration_minutes": 32,
  "tokens_consumed": 58432,
  "next_action": "Phase PCC_P3_PHASE_X+1 ready to start"
}
```

## Pair with

- `nm-loop-engineering` — when a single dept needs Plan → Implement → Test → Verify cycle
- `nm-multi-agent` — when running 3 depts in parallel via sub-agents

## Token saving

Manual end-to-end (Discover → Plan → Code → Test → Commit → Push → Close) =
~600K tokens. AUTOPILOT = ~60K. ~90% reduction for full phase rollouts.