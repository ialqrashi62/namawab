# .ai-brain — Orchestration Hub (this batch)

> Complete orchestration hub for the NamaMedical Hospital Platform.
> Combines token-saver skills, master plan, AUTOPILOT scripts, EHR benchmarks, and frontend bridge.

## What's in this batch (2026-08-10)

| Section | Files | Purpose |
|---|---|---|
| `02_MASTER_PLAN/` | 1 | Master plan with 44-bucket contract per dept |
| `03_AUTOPILOT/` | 12 | 10 orchestration scripts + README |
| `04_FRONTEND/` | 9 | Family Medicine Stitch Google pages (5 HTML + 4 i18n + README) |
| `skills/` | 35 new + 106 existing = **141 total** | Token-saver skills |

## Headline numbers

| Asset | Count |
|---|---|
| Token-saver skills | **141** (35 new + 106 existing) |
| AUTOPILOT scripts | **10** (autopilot, loop_engineering, multi_agent, phase_planner, quality_gates, budget_tracker, system_gap_audit, improvement_roadmap, frontend_bridge, global_benchmark, deployment_cicd, hetzner_deploy) |
| Orchestration docs | 1 master plan + 1 README |
| EHR benchmark files | **14 depts** (vs Epic/Cerner/MEDITECH/TrakCare) |
| Stitch HTML pages (this batch) | **5** family_medicine + 16 existing |
| i18n files (this batch) | **4** family_medicine + 5000+ existing |
| Dept engines (live) | 14 + **1 new** (family_medicine) |
| Routers mounted | 14 + **1 new** |
| Migrations (this batch) | **1 new** (e52_family_medicine) |

## Workflow

```
Owner request
       ↓
phase_planner (decompose roadmap)
       ↓
multi_agent (parallel sub-agents: generator, tester, auditor)
       ↓
autopilot (DISCOVER → PLAN → CODE → TEST → COMMIT → PUSH → CLOSE)
       ↓
quality_gates (6 L4 gates)
       ↓
hetzner_deploy (upload to live)
       ↓
system_gap_audit (verify post-deploy)
       ↓
budget_tracker (log cost)
       ↓
Done (closeout doc + CHANGELOG)
```

## Token-saver math

| Step | Without skills | With skills | Savings |
|---|---|---|---|
| Engine | 600 | 200 | 67% |
| Router | 800 | 250 | 69% |
| Migration | 400 | 150 | 63% |
| Test | 1,500 | 500 | 67% |
| HTML page | 1,500 | 300 | 80% |
| Docs | 600 | 150 | 75% |
| **Per dept** | **~5,400** | **~1,550** | **~71%** |
| **Per phase (9 depts)** | **~49K** | **~14K** | **~71%** |
| **All 14 phases (~122 depts)** | **~660K** | **~189K** | **~71%** |

Plus multi-agent parallelism saves **~40% wall-clock** (5× speedup typical).

## Safety rails (binding)

AGENTS.md §2.2 — 13 rails, all scripts enforce:

1. No hardcoded secrets
2. No PHI in commits
3. No force-push to protected branches
4. No DELETE/DROP without backup
5. Tenant isolation (RLS + middleware) stays on
7. PHI at rest encrypted
8. CSP report-only by default
9. Money routes idempotent + opt-in + fail-open
10. Audit log hash-chained, 7+ yr
11. Fail-closed on missing tenant
12. No PHI in logs
13. Golden Access Rule

## Quick start

```bash
# 1. Plan
node .ai-brain/03_AUTOPILOT/phase_planner.js --scope=14 --budget_per_dept=60000

# 2. Parallel agents
node .ai-brain/03_AUTOPILOT/multi_agent.js \
  --task="ship PCC_P3_PHASE_06" \
  --depts=family,geriatric,sports

# 3. Master pipeline
node .ai-brain/03_AUTOPILOT/autopilot.js --phase=PCC_P3_PHASE_06

# 4. Gate enforcement
node .ai-brain/03_AUTOPILOT/quality_gates.js \
  --phase=PCC_P3_PHASE_06 \
  --depts=family,geriatric,sports

# 5. Deploy to live
node .ai-brain/03_AUTOPILOT/hetzner_deploy.js \
  --files="namaweb/family_engine.js,namaweb/family_router.js" \
  --migrations="namaweb/migrations/e52_family_medicine_up.sql" \
  --restart

# 6. Verify + audit
node .ai-brain/03_AUTOPILOT/system_gap_audit.js --report=audit_latest.md

# 7. Log cost
node .ai-brain/03_AUTOPILOT/budget_tracker.js --report=budget_latest.md
```

## Reference

- `AGENTS.md` (workspace root) — project charter
- `docs/ARCHITECTURE_MAP_AR.md` — system architecture
- `docs/CHANGELOG.md` — release notes
- `.ai-brain/02_MASTER_PLAN/00_MASTER_PLAN_AR.md` — full master plan
- `.ai-brain/03_AUTOPILOT/README.md` — orchestration scripts index
- `.ai-brain/11_GLOBAL_EHR_BENCHMARK/` — 14 dept benchmarks
- `.ai-brain/skills/nm-*/SKILL.md` — 35 new token-saver skills

## Status

✅ Token-saver skills library (141 total)
✅ Master plan with 44-bucket contract
✅ AUTOPILOT orchestration scripts (10)
✅ Family Medicine dept shipped (engine + router + migration + tests + HTML + i18n)
✅ EHR benchmarks for 14 depts
⏳ Remaining 107 depts (W06-W14)
⏳ System modules (AI co-pilot, RAG, LangChain, vector store)
⏳ Frontend pages for remaining depts (~610)
⏳ Live deploy + verify + push to GitHub