# AUTOPILOT Directory — Orchestration Scripts

> 10 orchestration scripts that drive the NamaMedical build pipeline.
> Each script reads token-saver skills from `.ai-brain/skills/` to minimize tokens.

## Scripts

| Script | Purpose | Usage |
|---|---|---|
| `autopilot.js` | Master orchestrator: 7-stage pipeline (DISCOVER→PLAN→CODE→TEST→COMMIT→PUSH→CLOSE) | `node autopilot.js --phase=PCC_P3_PHASE_06` |
| `loop_engineering.js` | Plan→Implement→Test→Verify (cap 4 attempts) | `node loop_engineering.js --problem="..." --files="a.js,b.js"` |
| `multi_agent.js` | Parallel sub-agents (Generator/Tester/Auditor) | `node multi_agent.js --task="..." --depts=family,geriatric,sports` |
| `phase_planner.js` | Decompose roadmap into shippable phases | `node phase_planner.js --scope=14 --budget_per_dept=60000` |
| `quality_gates.js` | Enforce 6 L4 gates before close | `node quality_gates.js --phase=PCC_P3_PHASE_06 --depts=family,geriatric,sports` |
| `budget_tracker.js` | Track token + cost per session | `node budget_tracker.js --log="openai,gpt-4o-mini,1500,800,cardiology,engine"` |
| `system_gap_audit.js` | 6-dimension end-to-end audit | `node system_gap_audit.js --report=audit.md` |
| `improvement_roadmap.js` | Rank improvements by impact × safety / effort × risk | `node improvement_roadmap.js --improvements=imps.yaml --report=roadmap.md` |
| `frontend_bridge.js` | Blueprint → Stitch HTML pipeline | `node frontend_bridge.js --dept=family_medicine --blueprint=...` |
| `global_benchmark.js` | Epic/Cerner/MEDITECH comparison matrix | `node global_benchmark.js --report=benchmark.md` |
| `deployment_cicd.js` | 9-step deploy pipeline + rollback | `node deployment_cicd.js --action=deploy --files=...` |
| `hetzner_deploy.js` | SSH-driven deploy to live | `node hetzner_deploy.js --files=... --restart` |

## Token-saver skills used

All scripts read templates from `.ai-brain/skills/`:

- `nm-engine-pattern` — clinical engines
- `nm-router-middleware` — Express routers
- `nm-sql-table-template` — DB migrations
- `nm-test-suite-default` — test fixtures
- `nm-stitch-google` — HTML pages
- `nm-stitch-scaffold` — page skeletons
- `nm-i18n-default` — locale handling
- `nm-deployment-cicd` — deploy pipeline
- `nm-deployment-rollback` — rollback steps
- `nm-loop-engineering` — iteration patterns
- `nm-multi-agent` — parallel roles
- `nm-quality-gates` — gate definitions
- `nm-phase-planner` — phase structure
- `nm-budget-tracking` — cost logging
- `nm-observability` — structured logging
- `nm-rbac-default` — RBAC matrix
- `nm-system-gap-audit` — audit dimensions
- `nm-improvement-roadmap` — priority formula
- `nm-global-hospital-benchmark` — comparison matrix
- `nm-frontend-bridge` — pipeline structure

## Pipeline (orchestrated)

```
phase_planner  ──►  multi_agent  ──►  autopilot  ──►  quality_gates
       │                  │                 │                │
       ▼                  ▼                 ▼                ▼
  PHASE_PLAN.json   parallel jobs    code→test→commit     6 gates
                                       →push→close
                                            │
                                            ▼
                                    deployment_cicd
                                            │
                                            ▼
                                    Hetzner live deploy
                                            │
                                            ▼
                                    system_gap_audit
                                    budget_tracker
                                    global_benchmark
```

## Configuration files

- `autopilot.config.yaml` — main pipeline config
- `loop_engineering.config.yaml` — per-loop config
- `multi_agent.config.yaml` — sub-agent config
- `phase_planner.config.yaml` — phase structure
- `improvements.yaml` — IMP list for roadmap

## State files (auto-generated)

- `STATE.json` — current autopilot state
- `BUDGET_STATE.json` — token + cost log
- `PHASE_PLAN.json` — full plan
- `multi_agent_logs/*.json` — sub-agent reports
- `loops/*.md` — loop attempt history
- `state/*.md` — discover/plan/code outputs
- `audit_*.md` — audit reports
- `benchmark_*.md` — benchmark reports
- `roadmap_*.md` — improvement roadmaps

## Outputs

After running, scripts produce:

1. Engine + router + migration + test files (per dept)
2. Stitch HTML pages (per dept)
3. i18n JSON keys (AR/EN/FR/UR)
4. Migration up + down (forward + reverse)
5. CHANGELOG.md entry
6. PHASE_*_AR.md closeout doc
7. Audit + benchmark + budget reports

## Safety rails

All scripts enforce AGENTS.md §2.2 (13 rails):

- ❌ No hardcoded secrets
- ❌ No PHI in commits
- ❌ No force-push to protected branches
- ❌ No DELETE/DROP without backup
- ✅ Tenant isolation stays on (RLS)
- ✅ PHI at rest encrypted
- ✅ CSP report-only by default
- ✅ Money routes idempotent + opt-in
- ✅ Audit log hash-chained
- ✅ Fail-closed on missing tenant
- ✅ No PHI in logs
- ✅ Golden Access Rule

## Pair with

- Skills in `.ai-brain/skills/nm-*` — provide templates
- Docs in `.ai-brain/02_MASTER_PLAN/` — provide strategy
- 14 EHR benchmark files in `.ai-brain/11_GLOBAL_EHR_BENCHMARK/` — provide dept specs