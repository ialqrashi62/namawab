# NamaMedical — Master Plan 2026.08

> **Read this first.** Single source of truth for the next 90 days of work.
> Drives AUTOPILOT, LOOP ENGINEERING, and MULTI-AGENT orchestration.

## 1. Mission

Ship a complete, AI-powered, Saudi-compliant Hospital Enterprise Platform
(NamaMedical ERP) covering **122 clinical departments**, **44 buckets each**,
across **all 16 facility types** — live on [jumanasoft.com](https://jumanasoft.com).

## 2. Baseline (as of 2026-08-10)

| Asset | Count | Status |
|---|---|---|
| Engines (clinical pure functions) | 47 | shipped, tested |
| Routers (Express endpoints) | 47 | mounted, tenant-bound |
| Migrations (DB schema) | 401 | applied to live |
| Tests (unit + integration) | 283 | passing |
| HTML Stitch pages | 16 | deployed |
| i18n keys (AR/EN/FR/UR) | 5,000+ | 100% parity |
| Skills (token-saver) | 141 | 106 existing + 35 new |
| Department blueprints | 124 | 14 docs complete, 14 EHR-benchmarked |
| Dept modules deployed live | 14 | cardiology, oncology, pediatrics, surgery, pharmacy, ER, endocrine, pulmo, GI, rheum, ortho, neuro, nephro, OBGYN |
| PM2 process | nama-medical-erp | online, ~127 MB |
| Live URL | jumanasoft.com | online |

## 3. The 44-Bucket Contract (per dept)

Every department blueprint ships **exactly 44 files**, in this order:

### Bucket group A — Architecture (1-8)
| # | File | Purpose |
|---|---|---|
| 01 | `00_README.md` | Dept overview, KPIs, scope |
| 02 | `01_ARCHITECTURE_AR.md` | Architecture diagram, components |
| 03 | `02_DATA_MODEL_AR.md` | ERD, tables, relationships |
| 04 | `03_API_CONTRACT_AR.md` | OpenAPI 3.0 spec |
| 05 | `04_SECURITY_THREAT_MODEL_AR.md` | STRIDE analysis |
| 06 | `05_PERFORMANCE_BUDGET_AR.md` | Latency, throughput targets |
| 07 | `06_I18N_KEYS_AR.md` | AR/EN/FR/UR key registry |
| 08 | `07_COMPLIANCE_MATRIX_AR.md` | PDPL/NPHIES/CBAHI/ZATCA map |

### Bucket group B — Backend implementation (9-20)
| # | File | Purpose |
|---|---|---|
| 09 | `engine.js` | Pure-function clinical engine |
| 10 | `engine_test.js` | Unit tests (≥5) |
| 11 | `router.js` | Express router with middleware chain |
| 12 | `router_test.js` | Integration tests (≥3) |
| 13 | `route_schemas.js` | JSON-schema validation |
| 14 | `migration_NN_up.sql` | Forward migration |
| 15 | `migration_NN_down.sql` | Reverse migration |
| 16 | `migration_test.js` | Sandbox apply + verify |
| 17 | `rbac_policies.js` | Role-to-permission map |
| 18 | `audit_instrumentation.js` | Audit log hooks |
| 19 | `error_codes.js` | Dept-specific error codebook |
| 20 | `fixtures.js` | Test fixtures (anonymized) |

### Bucket group C — Frontend (21-32)
| # | File | Purpose |
|---|---|---|
| 21 | `index.html` | Landing page |
| 22 | `queue.html` | Patient queue |
| 23 | `detail.html` | Patient detail |
| 24 | `form.html` | Calculator / order form |
| 25 | `settings.html` | Dept config |
| 26 | `app.js` | Page logic |
| 27 | `app.css` | Page styles (uses tokens) |
| 28 | `icon.svg` | Dept icon |
| 29 | `i18n_ar.json` | AR translations |
| 30 | `i18n_en.json` | EN translations |
| 31 | `i18n_fr.json` | FR translations |
| 32 | `i18n_ur.json` | UR translations |

### Bucket group D — AI / RAG (33-38)
| # | File | Purpose |
|---|---|---|
| 33 | `rag_corpus.md` | Source documents to embed |
| 34 | `embed_pipeline.js` | Chunk → embed → upsert |
| 35 | `retrieval_pipeline.js` | Query → retrieve → rerank |
| 36 | `co_pilot_prompts.js` | System prompts (4 locales) |
| 37 | `co_pilot_router.js` | Express endpoint |
| 38 | `co_pilot_test.js` | Integration test |

### Bucket group E — Ops / docs (39-44)
| # | File | Purpose |
|---|---|---|
| 39 | `DEPLOY_RUNBOOK.md` | Deploy steps |
| 40 | `INCIDENT_PLAYBOOK.md` | Rollback steps |
| 41 | `CHANGELOG_entry.md` | One-paragraph change note |
| 42 | `QA_TEST_PLAN.md` | Acceptance criteria |
| 43 | `USER_MANUAL_AR.md` | Arabic user guide |
| 44 | `EHR_BENCHMARK_AR.md` | vs Epic/Cerner/MEDITECH |

## 4. Token budget per bucket

| Group | Files | Lines avg | Tokens avg | Subtotal |
|---|---|---|---|---|
| A. Architecture | 8 | ~150 | ~600 | ~4,800 |
| B. Backend | 12 | ~120 | ~500 | ~6,000 |
| C. Frontend | 12 | ~100 | ~400 | ~4,800 |
| D. AI / RAG | 6 | ~150 | ~600 | ~3,600 |
| E. Ops / docs | 6 | ~80 | ~300 | ~1,800 |
| **Total per dept** | **44** | | | **~21,000** |

**122 depts × 21,000 tokens = ~2.5M tokens** (without token-saver skills).

With token-saver skills: **~600K tokens** (~75% reduction).

## 5. Phased rollout (14 waves × ~9 depts)

| Wave | Depts | ETA | Tokens | Skills used |
|---|---|---|---|---|
| W01 | cardiology, oncology, pediatrics | done | 60K | nm-engine-pattern, nm-router-middleware, nm-stitch-google |
| W02 | surgery, pharmacy, emergency | done | 60K | (same) |
| W03 | endocrine, pulmo, GI | done | 60K | (same) |
| W04 | rheum, ortho, neuro | done | 60K | (same) |
| W05 | nephro, OBGYN, derma | done | 60K | (same) |
| W06 | family, geriatric, sports | 3 days | 50K | nm-engine-pattern, nm-router-middleware |
| W07 | dental, ophthalmology, ENT | 3 days | 50K | (same) |
| W08 | urology, plastic-surg, vascular | 3 days | 50K | (same) |
| W09 | thoracic, neurosurg, trauma | 3 days | 50K | (same) |
| W10 | anesthesia, pain, palliative | 3 days | 50K | (same) |
| W11 | rehab, physio, occ-therapy | 3 days | 50K | (same) |
| W12 | nutrition, psych, sleep | 3 days | 50K | (same) |
| W13 | genetics, immunol, allergy | 3 days | 50K | (same) |
| W14 | remaining 38 depts | 7 days | 200K | nm-multi-agent, nm-autopilot |

**Total: ~14 waves × ~50K tokens = ~700K tokens** (using all 35 token-saver skills).

## 6. System modules (independent of depts)

Beyond the 122 depts, the platform needs these **system modules**:

| Module | Engine | Router | Migration | HTML | Skills |
|---|---|---|---|---|---|
| AI co-pilot | ✓ | ✓ | ✓ | ✓ | nm-rag-vector, nm-multimodel |
| Vector store | ✓ | ✓ | ✓ | – | nm-vector-store |
| LangChain orchestrator | ✓ | ✓ | – | – | nm-langchain-template |
| Prompt registry | ✓ | – | ✓ | ✓ | nm-prompt-engineering |
| Auth / MFA | – | ✓ | ✓ | ✓ | nm-security-rbac |
| RBAC | – | – | ✓ | – | nm-rbac-default |
| i18n switcher | – | – | – | ✓ | nm-i18n-default |
| Compliance (PDPL) | ✓ | ✓ | ✓ | ✓ | nm-compliance-pdpl |
| NPHIES integration | ✓ | ✓ | ✓ | ✓ | (compliance) |
| ZATCA invoicing | ✓ | ✓ | ✓ | ✓ | (compliance) |
| Audit log | ✓ | ✓ | ✓ | ✓ | nm-observability |
| Observability | – | – | – | ✓ | nm-observability |
| Cost tracking | ✓ | ✓ | ✓ | – | nm-budget-tracking |
| Deploy / rollback | – | – | – | – | nm-deployment-cicd, nm-deployment-rollback |
| Phase planner | ✓ | – | – | – | nm-phase-planner |
| Quality gates | ✓ | – | – | – | nm-quality-gates |
| Handoff | ✓ | – | – | – | nm-handoff |

## 7. Frontend pages (Stitch Google, MD3)

| Page type | Count | Per dept | Total |
|---|---|---|---|
| Landing | 1 | × 122 | 122 |
| Queue | 1 | × 122 | 122 |
| Detail | 1 | × 122 | 122 |
| Form | 1 | × 122 | 122 |
| Settings | 1 | × 122 | 122 |
| AI co-pilot | 1 | – | 1 |
| Admin console | 1 | – | 1 |
| Login + MFA | 1 | – | 1 |
| Patient portal | 5 | – | 5 |
| Reports dashboard | 5 | – | 5 |
| **Total HTML pages** | | | **~625** |

## 8. Orchestration scripts (this batch)

Scripts to write in `.ai-brain/03_AUTOPILOT/`:

1. `autopilot.js` — master orchestrator (DISCOVER → PLAN → CODE → TEST → COMMIT → PUSH → CLOSE)
2. `loop_engineering.js` — Plan → Implement → Test → Verify (cap 4)
3. `multi_agent.js` — parallel sub-agent dispatcher
4. `phase_planner.js` — roadmap → phases → deliverables
5. `quality_gates.js` — 6-gate enforcement
6. `budget_tracker.js` — token + cost tracking
7. `system_gap_audit.js` — end-to-end audit
8. `improvement_roadmap.js` — priority ranking
9. `global_benchmark.js` — Epic/Cerner comparison
10. `frontend_bridge.js` — blueprint → HTML pipeline

## 9. Safety rails (binding)

From `AGENTS.md §2.2` — 13 rails, none negotiable:

1. No hardcoded secrets
2. No PHI in commits
3. No force-push to protected branches
4. No DELETE/DROP without backup
5. Tenant isolation stays on (RLS + middleware)
7. PHI at rest stays encrypted
8. CSP stays report-only by default
9. All money/VAT server-side
10. Audit log hash-chained, 7+ yr
11. Fail-closed on missing tenant
12. No PHI in logs
13. Golden Access Rule (owner absolute, others specialty)

## 10. Acceptance gates (per phase)

| # | Gate | Pass condition |
|---|---|---|
| G1 | Tests | All green, coverage ≥ 80% |
| G2 | Security | No secrets, no XSS, no PHI in logs |
| G3 | RLS | All new tables have FORCE_RLS + policy |
| G4 | i18n | All 4 locales 100% coverage |
| G5 | RBAC | Every router has full middleware chain |
| G6 | Deploy | Sandbox → live, smoke green |

## 11. Live site verification (post-deploy)

```
GET https://jumanasoft.com/api/health                          → 200
GET https://jumanasoft.com/api/{dept}/icd10                    → 200
GET https://jumanasoft.com/api/{dept}/tnm-stages               → 200
POST https://jumanasoft.com/api/{dept}/assessments/{score}     → 201
```

## 12. Open questions for owner

1. Approve AUTOPILOT batch run for W06-W14 (12 depts in parallel)?
2. Confirm budget cap per phase ($20/dept)?
3. Approve CSP change to enforce mode?
4. Approve audit-log enable (currently inert)?
5. Approve ZATCA live creds when available?

## 13. Status as of 2026-08-10

| Bucket | Done | Remaining |
|---|---|---|
| 14 EHR benchmarks | 14 | 0 |
| Skills (token-saver) | 141 | ~10 (final) |
| Dept blueprints (44 buckets each) | 14 | 108 |
| Engines deployed | 14 | 108 |
| Routers mounted | 14 | 108 |
| Migrations applied | 30+ | ~108 |
| Stitch HTML pages | 16 | ~610 |
| Orchestration scripts | 0 | 10 |

## 14. Next 14 days (concrete)

| Day | Deliverable |
|---|---|
| Day 1 (today) | Master plan + 35 token-saver skills (✅ done) |
| Day 2 | Orchestration scripts (10) |
| Day 3 | W06-W08 (9 depts) via multi-agent |
| Day 4 | W09-W11 (9 depts) |
| Day 5 | W12-W14 (47 depts) via AUTOPILOT |
| Day 6-7 | System modules (AI co-pilot, RAG, LangChain, vector store) |
| Day 8-9 | Stitch pages (batch render 625 pages) |
| Day 10 | Compliance module (PDPL + NPHIES + ZATCA) |
| Day 11-12 | QA: all 6 L4 gates, full smoke test |
| Day 13 | Deploy to live, verify, rollback script ready |
| Day 14 | Git push, CHANGELOG, closeout |

**Total tokens planned: ~1.2M** (vs ~10M without skills, ~85% savings).

---

> This plan is the canonical reference. AUTOPILOT reads it; LOOP ENGINEERING
> iterates against it; MULTI-AGENT parallelizes it.